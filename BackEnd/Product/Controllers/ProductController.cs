using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Product.Infrastructure.Data;
using Product.Models;

namespace Product.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController: ControllerBase
    {
        private readonly ClsADB _context;

        public ProductController(ClsADB context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClsMProduct>>> GetProducts()
        {
            var products = await _context.Products
                .FromSqlRaw("EXECUTE dbo.GetProducts")
                .ToListAsync();

            if (products == null || products.Count == 0)
            {
                return NotFound("No products found.");
            }

            return Ok(products);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ClsMProduct product)
        {
            try
            {

                var nombreParam = new SqlParameter("@pro_nombre_", product.pro_nombre);
                var descripcionParam = new SqlParameter("@pro_descripcion_", product.pro_descripcion);
                var categoriaParam = new SqlParameter("@pro_categoria_", product.pro_categoria);
                var imagenParam = new SqlParameter("@pro_imagen_", product.pro_imagen);
                var precioParam = new SqlParameter("@pro_precio_", product.pro_precio);
                var stockParam = new SqlParameter("@pro_stock_", product.pro_stock);
                var estadoParam = new SqlParameter("@pro_estado_", product.pro_estado);
                
                var result = await _context.Database.ExecuteSqlRawAsync(
                    "EXEC CreateProduct  @pro_nombre_, @pro_descripcion_, @pro_categoria_, @pro_imagen_, @pro_precio_, @pro_stock_, @pro_estado_",
                     nombreParam, descripcionParam, categoriaParam, imagenParam, precioParam, stockParam, estadoParam);

                if (result > 0)
                {
                    return Ok(new { message = "Producto creado correctamente." });
                }
                else
                {
                    return NotFound(new { message = "Existe un problema al crear el producto." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al crear el producto: {ex.Message}" });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProduct([FromBody] ClsMProduct product)
        {
            if (product == null)
            {
                return BadRequest("Los datos del producto son incorrectos.");
            }
            try
            {
                var idParam = new SqlParameter("@pro_id_producto_", product.pro_id_producto);
                var nombreParam = new SqlParameter("@pro_nombre_", product.pro_nombre);
                var descripcionParam = new SqlParameter("@pro_descripcion_", product.pro_descripcion);
                var categoriaParam = new SqlParameter("@pro_categoria_", product.pro_categoria);
                var imagenParam = new SqlParameter("@pro_imagen_", product.pro_imagen);
                var precioParam = new SqlParameter("@pro_precio_", product.pro_precio);
                var stockParam = new SqlParameter("@pro_stock_", product.pro_stock);
                var estadoParam = new SqlParameter("@pro_estado_", product.pro_estado);

                var result = await _context.Database.ExecuteSqlRawAsync(
                    "EXEC UpdateProduct @pro_id_producto_, @pro_nombre_, @pro_descripcion_, @pro_categoria_, @pro_imagen_, @pro_precio_, @pro_stock_, @pro_estado_",
                    idParam, nombreParam, descripcionParam, categoriaParam, imagenParam, precioParam, stockParam, estadoParam);

                if (result > 0)
                {
                    return Ok(new { message = "Producto actualizado correctamente." });
                }
                else
                {
                    return NotFound(new { message = "Existe un problema al actualizar el producto." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al actualizar el producto: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var proIdProductoParam = new SqlParameter("@pro_id_producto_", id);
                var result = await _context.Database.ExecuteSqlRawAsync(
                    "EXEC DeleteProduct @pro_id_producto_", proIdProductoParam);

                if (result > 0)
                {
                    return Ok(new { message = "Producto eliminado correctamente." });
                }
                else
                {
                    return NotFound(new { message = "Existe un problema al eliminar el producto." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al eliminar el producto: {ex.Message}" });
            }
        }


        [HttpGet("{id}/stock")]
        public async Task<ActionResult<int>> GetProductStock(int id)
        {
            try
            {
                var idParam = new SqlParameter("@pro_id_producto_", id);

                var result = await _context.Products
                    .FromSqlRaw("EXEC GetProductStock @pro_id_producto_", idParam)
                    .ToListAsync();

                if (result == null || result.Count == 0)
                {
                    return NotFound("Producto no encontrado.");
                }

                var stock = result.FirstOrDefault()?.pro_stock;

                if (stock == null)
                {
                    return NotFound("Producto no encontrado o sin stock.");
                }

                return Ok(stock);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error al obtener el stock del producto: {ex.Message}" });
            }
        }

    }
}
