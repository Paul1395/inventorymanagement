namespace Transaction.Models
{
    public class ClsETransaction
    {
        public int Id { get; set; }
        public int pro_id_producto { get; set; }
        public int cantidad { get; set; }
        public decimal precio_unitario { get; set; }
        public decimal precio_total { get; set; }
        public string tipo { get; set; }
        public string detalle { get; set; }
        public DateTime fecha { get; set; }
    }
}
