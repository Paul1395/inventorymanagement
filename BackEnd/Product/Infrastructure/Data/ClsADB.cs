using System;
using Microsoft.EntityFrameworkCore;
using Product.Models;

namespace Product.Infrastructure.Data
{
    public class ClsADB : DbContext
    {
        public ClsADB(DbContextOptions<ClsADB> options) : base(options) { }

        public DbSet<ClsMProduct> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClsMProduct>()
                .HasKey(p => p.pro_id_producto);
        }
    }
}
