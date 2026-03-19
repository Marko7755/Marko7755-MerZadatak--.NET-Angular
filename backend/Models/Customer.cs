using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MER_zadatak.Models
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(FirstName))]
    [Index(nameof(LastName))]
    [Index(nameof(City))]
    [Index(nameof(Country))]
    [Index(nameof(CreatedAt))]
    [Index(nameof(IsActive))]
    public class Customer
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string FirstName { get; set; } = null!;

        [MaxLength(100)]
        public string LastName { get; set; } = null!;

        [MaxLength(255)]
        public string Email { get; set; } = null!;

        [MaxLength(50)]
        public string? Phone { get; set; }

        [MaxLength(100)]
        public string City { get; set; } = null!;

        [MaxLength(100)]
        public string Country { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastModifiedAt { get; set; }

    }
}
