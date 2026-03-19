using System.ComponentModel.DataAnnotations;

namespace MER_zadatak.DTOs.Customer
{
    public class UpdateCustomerRequest
    {
        [Required]
        [MinLength(2)]
        public string FirstName { get; set; } = null!;

        [Required]
        [MinLength(2)]
        public string LastName { get; set; } = null!;

        [Required]
        [RegularExpression("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")]
        public string Email { get; set; } = null!;

        [MinLength(7)]
        public string? Phone { get; set; }

        [Required]
        [MinLength(2)]
        public string City { get; set; } = null!;

        [Required]
        [MinLength(2)]
        public string Country { get; set; } = null!;

        [Required]
        public bool IsActive { get; set; }
    }
}
