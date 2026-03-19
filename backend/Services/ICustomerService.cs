using MER_zadatak.DTOs.Customer;
using MER_zadatak.DTOs.Pagination;
using MER_zadatak.Models;

namespace MER_zadatak.Services
{
    public interface ICustomerService
    {
        Task<Customer?> GetByIdAsync(int id);

        Task<Customer> CreateAsync(CreateCustomerRequest request);

        Task<bool> EmailExistsAsync(string email);

        Task<Customer?> UpdateAsync(int id, UpdateCustomerRequest request);

        Task<bool> SoftActivateAsync(int id);

        Task<bool> SoftDeactivateAsync(int id);

        Task<PagedResponse<Customer>> GetPagedAsync(PaginationParametersRequest request);

        Task<int> BulkDeactivateAsync(List<int> ids);

        Task<int> BulkActivateAsync(List<int> ids);

        Task<CustomerStatsResponse> GetCustomerStatsAsync();

        Task<List<string>> GetAllCountriesAsync();
        



    }
}
