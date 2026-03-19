using MER_zadatak.Models;
using Microsoft.EntityFrameworkCore;

namespace MER_zadatak.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; } = null!;
    }
}
