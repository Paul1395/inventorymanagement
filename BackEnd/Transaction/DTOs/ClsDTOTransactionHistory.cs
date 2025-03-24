using System.ComponentModel.DataAnnotations;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Transaction.DTOs
{
    public class ClsDTOTransactionHistory
    {
        [Key]
        public int idtransaccion { get; set; }
        public DateTime fecha { get; set; }
        public string nombre { get; set; }
        public string tipotransaccion { get; set; }
        public int cantidad { get; set; }
        public decimal preciounitario { get; set; }
        public decimal preciototal { get; set; }
        public string detalle { get; set; }

    }
}
