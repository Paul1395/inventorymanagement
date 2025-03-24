using System.ComponentModel.DataAnnotations;

namespace Transaction.Models
{
    public class ClsMTransaction
    {
        [Key]
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public string Detalle { get; set; } 
        public decimal PrecioUnitario { get; set; }
        public decimal PrecioTotal { get; set; }
        public string Tipo { get; set; }
    }
}
