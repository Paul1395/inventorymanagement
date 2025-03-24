namespace Product.Models
{
    public class ClsMProduct
    {
        public int pro_id_producto { get; set; }
        public string pro_nombre { get; set; }
        public string pro_descripcion { get; set; }
        public string pro_categoria { get; set; }
        public string pro_imagen { get; set; }
        public decimal pro_precio { get; set; }
        public int pro_stock { get; set; }
        public int pro_estado { get; set; }
    }
}
