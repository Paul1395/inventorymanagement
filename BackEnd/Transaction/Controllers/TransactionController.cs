using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Transaction.Infrastructure.Data;
using Transaction.Models;
using System;
using System.Threading.Tasks;
using Transaction.DTOs;

namespace Transaction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ClsADB _context;
        private readonly string _productoApiUrl;

        public TransactionController(HttpClient httpClient, ClsADB context, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _context = context;
            _productoApiUrl = configuration.GetValue<string>("ProductoApiUrl");  // Se obtiene el URL del microservicio de productos desde appsettings.json
        }

        [HttpPost]
        public async Task<IActionResult> RegisterTransaction([FromBody] ClsMTransaction transaccion)
        {
            try
            {
                var productResponse = await _httpClient.GetAsync($"{_productoApiUrl}/{transaccion.ProductoId}/stock");

                if (!productResponse.IsSuccessStatusCode)
                {
                    return NotFound(new { message = "Producto no encontrado." });
                }

                var stock = await productResponse.Content.ReadFromJsonAsync<int>();

                if (transaccion.Tipo == "V")
                {
                    return await ProccessSale(transaccion, stock);
                }
                else if (transaccion.Tipo == "C")
                {
                    return await ProcessBuy(transaccion);
                }
                else
                {
                    return BadRequest(new { message = "Tipo de transacción inválido. Debe ser 'C' para compra o 'V' para venta." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error en el procesamiento de la transacción: {ex.Message}" });
            }
        }

        private async Task<IActionResult> ProccessSale(ClsMTransaction transaccion, int stock)
        {
            if (stock < transaccion.Cantidad)
            {
                return BadRequest(new { message = "No hay suficiente stock para realizar la transacción." });
            }

            var idProducto = new SqlParameter("@pro_id_producto", transaccion.ProductoId);
            var cantidadParam = new SqlParameter("@cantidad", transaccion.Cantidad);

            var result = await _context.Database.ExecuteSqlRawAsync(
                "EXEC UpdateSaleStock @pro_id_producto, @cantidad",
                idProducto, cantidadParam);

            if (result <= 0)
            {
                return StatusCode(500, new { message = "Error al actualizar el stock durante la venta." });
            }

            var transaccionParam1 = new SqlParameter("@producto_id", transaccion.ProductoId);
            var transaccionParam2 = new SqlParameter("@cantidad", transaccion.Cantidad);
            var transaccionParam3 = new SqlParameter("@precio_unitario", transaccion.PrecioUnitario);
            var transaccionParam4 = new SqlParameter("@precio_total", transaccion.PrecioTotal);
            var transaccionParam5 = new SqlParameter("@tipo_transaccion", transaccion.Tipo);
            var transaccionParam6 = new SqlParameter("@detalle", transaccion.Detalle);

            var insertResult = await _context.Database.ExecuteSqlRawAsync(
                "EXEC SaveTransaction @producto_id, @cantidad, @precio_unitario, @precio_total, @tipo_transaccion, @detalle",
                transaccionParam1, transaccionParam2, transaccionParam3, transaccionParam4, transaccionParam5, transaccionParam6);

            if (insertResult <= 0)
            {
                return StatusCode(500, new { message = "Error al registrar la transacción." });
            }

            return Ok(new { message = "Transacción de venta registrada y stock actualizado correctamente." });
        }

        private async Task<IActionResult> ProcessBuy(ClsMTransaction transaccion)
        {
            var idProducto = new SqlParameter("@pro_id_producto", transaccion.ProductoId);
            var cantidadParam = new SqlParameter("@cantidad", transaccion.Cantidad);

            var result = await _context.Database.ExecuteSqlRawAsync(
                "EXEC UpdateBuyStock @pro_id_producto, @cantidad",
                idProducto, cantidadParam);

            if (result <= 0)
            {
                return StatusCode(500, new { message = "Error al actualizar el stock durante la compra." });
            }

            var transaccionParam1 = new SqlParameter("@producto_id", transaccion.ProductoId);
            var transaccionParam2 = new SqlParameter("@cantidad", transaccion.Cantidad);
            var transaccionParam3 = new SqlParameter("@precio_unitario", transaccion.PrecioUnitario);
            var transaccionParam4 = new SqlParameter("@precio_total", transaccion.PrecioTotal);
            var transaccionParam5 = new SqlParameter("@tipo_transaccion", transaccion.Tipo);
            var transaccionParam6 = new SqlParameter("@detalle", transaccion.Detalle);

            var insertResult = await _context.Database.ExecuteSqlRawAsync(
                "EXEC SaveTransaction @producto_id, @cantidad, @precio_unitario, @precio_total, @tipo_transaccion, @detalle",
                transaccionParam1, transaccionParam2, transaccionParam3, transaccionParam4, transaccionParam5, transaccionParam6);

            if (insertResult <= 0)
            {
                return StatusCode(500, new { message = "Error al registrar la transacción." });
            }

            return Ok(new { message = "Transacción de compra registrada y stock actualizado correctamente." });
        }


        [HttpGet("historial")]
        public async Task<IActionResult> GetTransactionHistory( DateTime fechaInicio, DateTime fechaFin, string tipo)
        {
            try
            {
            
                var sqlQuery = @"
                EXEC GetTransactionHistory 
                    @tipo = {0}, 
                    @fechaInicio = {1}, 
                    @fechaFin = {2}";

                var result = await _context.Set<ClsDTOTransactionHistory>()
                    .FromSqlRaw(sqlQuery, tipo, fechaInicio, fechaFin)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al obtener el historial de transacciones: {ex.Message}" });
            }
        }
    }
}
