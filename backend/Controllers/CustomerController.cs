using MER_zadatak.DTOs.Customer;
using MER_zadatak.DTOs.Pagination;
using MER_zadatak.Models;
using MER_zadatak.Services;
using Microsoft.AspNetCore.Mvc;

namespace MER_zadatak.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }


        [HttpGet("{id}")]
        [ActionName(nameof(GetCustomerByIdAsync))]
        public async Task<ActionResult<Customer>> GetCustomerByIdAsync([FromRoute] int id)
        {
            var customer = await _customerService.GetByIdAsync(id);

            return Ok(customer);
        }


        [HttpPost]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] CreateCustomerRequest request)
        {
            /*
            if (await _customerService.EmailExistsAsync(request.Email))
            {
                return Conflict("User with " + request.Email + " email already exists!");
            }
            */

            var newCustomer = await _customerService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetCustomerByIdAsync),
                new { id = newCustomer.Id },
                newCustomer
                );

            //return Ok(newCusomer);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomerAsync([FromRoute] int id, [FromBody] UpdateCustomerRequest request)
        {
            var updatedCustomer = await _customerService.UpdateAsync(id, request);

            return Ok(updatedCustomer);
        }


        [HttpPut("deactivate/{id}")]
        public async Task<IActionResult> SoftDeleteAsync([FromRoute] int id)
        {
            await _customerService.SoftDeactivateAsync(id);

            return NoContent();
        }

        [HttpPut("activate/{id}")]
        public async Task<IActionResult> SoftActivateAsync([FromRoute] int id)
        {
            await _customerService.SoftActivateAsync(id);

            return Ok();
        }


        [HttpGet]
        public async Task<IActionResult> GetCustomersPaginatedAsync([FromQuery] PaginationParametersRequest request) {
            var result = await _customerService.GetPagedAsync(request);
            
            return Ok(result);
        }


        [HttpPut("bulk-deactivate")]
        public async Task<IActionResult> BulkDeactiateAsync([FromBody] List<int> ids)
        {
            var updatedCount = await _customerService.BulkDeactivateAsync(ids);

            return Ok(updatedCount);
        }


        [HttpPut("bulk-activate")]
        public async Task<IActionResult> BulkActivateAsync([FromBody] List<int> ids)
        {
            var updatedCount = await _customerService.BulkActivateAsync(ids);

            return Ok(updatedCount);
        }


        [HttpGet("stats")]
        public async Task<ActionResult<CustomerStatsResponse>> GetCustomerStatsAsync()
        {
            return Ok(await _customerService.GetCustomerStatsAsync());
        }

        [HttpGet("allCountries")]
        public async Task<ActionResult<IEnumerable<string>>> GetAllCountriesAsync() 
        {
            return Ok(await _customerService.GetAllCountriesAsync());
        }

    }
}
