using Microsoft.EntityFrameworkCore;
using Transaction.DTOs;
using Transaction.Models;

namespace Transaction.Infrastructure.Data
{
    public class ClsADB: DbContext
    {
        public ClsADB(DbContextOptions<ClsADB> options) : base(options) { }

        public DbSet<ClsEProduct> Products { get; set; }
        public DbSet<ClsETransaction> Transacciones { get; set; }

        public DbSet<ClsDTOTransactionHistory> TransaccionesHistorial { get; set; }
    }
}
