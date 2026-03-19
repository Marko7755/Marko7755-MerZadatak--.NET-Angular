using MER_zadatak.Data;
using MER_zadatak.DTOs.Customer;
using MER_zadatak.DTOs.Pagination;
using MER_zadatak.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MER_zadatak.Exceptions;
using EFCore.BulkExtensions;

namespace MER_zadatak.Services
{
    public class CustomerService : ICustomerService
    {

        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;

        }


        public static async Task SeedCustomersAsync(AppDbContext context)
        {
            const int targetCount = 100_000;
            const int batchSize = 5_000;

            if (await context.Customers.AnyAsync())
                return;

            string[] firstNames =
            {
                "Ivan","Marko","Ana","Petra","Luka","Lucija",
                "Lukas","Anna","Leon","Marie","Paul",
                "Luca","Giulia","Marco","Sofia",
                "John","Emily","Michael","Sarah","David"
            };

            string[] lastNames =
            {
                "Horvat","Kovačević","Babić","Marić",
                "Müller","Schmidt","Schneider","Fischer",
                "Rossi","Russo","Ferrari","Bianchi",
                "Smith","Johnson","Brown","Williams"
            };

            string[] countries =
            {
                "Croatia", "Germany", "Italy", "USA"
            };

            string[][] citiesByCountry =
            {
                new[] { "Zagreb","Split","Rijeka","Osijek","Zadar" },
                new[] { "Berlin","Munich","Hamburg","Frankfurt","Stuttgart" },
                new[] { "Rome","Milan","Naples","Turin","Bologna" },
                new[] { "New York","Los Angeles","Chicago","Houston","Phoenix" }
            };


            /*var originalSetting = context.ChangeTracker.AutoDetectChangesEnabled;
            context.ChangeTracker.AutoDetectChangesEnabled = false;*/

            for (int offset = 0; offset < targetCount; offset += batchSize)
            {
                var customers = new List<Customer>(batchSize);

                for (int i = offset; i < offset + batchSize && i < targetCount; i++)
                {
                    var firstName = firstNames[i % firstNames.Length];
                    var lastName = lastNames[(i / firstNames.Length) % lastNames.Length];

                    var countryIndex = i % countries.Length;
                    var country = countries[countryIndex];

                    var cities = citiesByCountry[countryIndex];
                    var city = cities[(i / countries.Length) % cities.Length];


                    var email =
                        $"{firstName.ToLower()}.{lastName.ToLower()}{i + 1}@example.com"
                        .Replace("č", "c")
                        .Replace("ć", "c")
                        .Replace("š", "s")
                        .Replace("ž", "z")
                        .Replace("đ", "d");


                    customers.Add(new Customer
                    {
                        FirstName = firstName,
                        LastName = lastName,
                        Email = email,
                        Phone = $"+38591{i % 100000000:D8}",
                        City = city,
                        Country = country,
                        IsActive = i % 5 != 0,
                        CreatedAt = DateTime.UtcNow.AddMinutes(-(i % 50000)),
                        LastModifiedAt = i % 3 == 0 ? DateTime.UtcNow : null
                    });
                }

                await context.BulkInsertAsync(customers, new BulkConfig
                {
                    BatchSize = batchSize,
                    PreserveInsertOrder = true,
                    SetOutputIdentity = false
                });
                /*
                await context.Customers.AddRangeAsync(customers);
                await context.SaveChangesAsync();
                context.ChangeTracker.Clear();
                */

            }

        }


        public async Task<Customer?> GetByIdAsync(int id)
        {
            var customerToUpdate = await _context.Customers.FindAsync(id);

            return customerToUpdate == null
                ? throw new CustomerNotFoundException($"Customer with ID {id} does not exists.")
                : await _context.Customers.FindAsync(id);
        }

        /*
        public async Task<List<Customer>> GetAsync() { 
            return await _context.Customers.ToListAsync();
        }
        */

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Customers.AnyAsync(c => c.Email == email);
        }

        public async Task<Customer> CreateAsync(CreateCustomerRequest request)
        {

            if (await EmailExistsAsync(request.Email))
            {
                throw new DuplicateCustomerException($"Customer with email '{request.Email}' already exists.");
            }

            var newCustomer = new Customer
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                City = request.City,
                Country = request.Country
            };

            _context.Customers.Add(newCustomer);
            await _context.SaveChangesAsync();

            return newCustomer;

        }


        public async Task<Customer?> UpdateAsync(int id, UpdateCustomerRequest request)
        {
            var customerToUpdate = await GetByIdAsync(id);

            if (customerToUpdate == null)
            {
                throw new CustomerNotFoundException($"Customer with ID {id} does not exists.");
            }

            customerToUpdate.FirstName = request.FirstName;
            customerToUpdate.LastName = request.LastName;
            customerToUpdate.Email = request.Email;
            customerToUpdate.Phone = request.Phone;
            customerToUpdate.City = request.City;
            customerToUpdate.Country = request.Country;
            customerToUpdate.IsActive = request.IsActive;
            customerToUpdate.LastModifiedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return customerToUpdate;
        }


        public async Task<bool> SoftActivateAsync([FromRoute] int id)
        {
            var customerToActivate = await GetByIdAsync(id);

            if (customerToActivate == null)
            {
                throw new CustomerNotFoundException($"Customer with ID {id} does not exists.");
            }

            customerToActivate.IsActive = true;
            customerToActivate.LastModifiedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<bool> SoftDeactivateAsync([FromRoute] int id)
        {
            var customerToDeactivate= await GetByIdAsync(id);

            if (customerToDeactivate == null)
            {
                throw new CustomerNotFoundException($"Customer with ID {id} does not exists.");
            }

            customerToDeactivate.IsActive = false;
            customerToDeactivate.LastModifiedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;

        }


        public async Task<PagedResponse<Customer>> GetPagedAsync(PaginationParametersRequest request)
        {

            var query = _context.Customers.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Name) && request.Name.Trim().Length >= 2)
            {
                var firstLastName = request.Name.Split(" ", StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

                foreach (var value in firstLastName)
                {
                    query =
                        query.Where(c => c.FirstName.Contains(value) || c.LastName.Contains(value));
                }

                //var name = request.Name.Trim();

                //query = query.Where(c =>
                //    (c.FirstName + " " + c.LastName).Contains(name));
            }


            if (!string.IsNullOrWhiteSpace(request.City))
            {
                var city = request.City.Trim();

                query = query.Where(c => c.City == city);

            }


            if (!string.IsNullOrWhiteSpace(request.Country))
            {
                var country = request.Country.Trim();

                query = query.Where(c => c.Country == country);

            }


            if (request.IsActive.HasValue)
            {
                query = query.Where(c => c.IsActive == request.IsActive.Value);
            }


            var totalCount = await query.CountAsync();

            query = (request.SortBy?.Trim().ToLower(), request.SortDirection?.Trim().ToLower())
                switch
            {
                ("firstname", "desc") => query.OrderByDescending(c => c.FirstName).ThenByDescending(c => c.Id),
                ("firstname", _) => query.OrderBy(c => c.FirstName).ThenBy(c => c.Id),

                ("lastname", "desc") => query.OrderByDescending(c => c.LastName).ThenByDescending(c => c.Id),
                ("lastname", _) => query.OrderBy(c => c.LastName).ThenBy(c => c.Id),

                ("email", "desc") => query.OrderByDescending(c => c.Email).ThenByDescending(c => c.Id),
                ("email", _) => query.OrderBy(c => c.Email).ThenBy(c => c.Id),

                ("city", "desc") => query.OrderByDescending(c => c.City).ThenByDescending(c => c.Id),
                ("city", _) => query.OrderBy(c => c.City).ThenBy(c => c.Id),

                ("country", "desc") => query.OrderByDescending(c => c.Country).ThenByDescending(c => c.Id),
                ("country", _) => query.OrderBy(c => c.Country).ThenBy(c => c.Id),

                ("createdat", "desc") => query.OrderByDescending(c => c.CreatedAt).ThenByDescending(c => c.Id),
                ("createdat", _) => query.OrderBy(c => c.CreatedAt).ThenBy(c => c.Id),

                ("isactive", "desc") => query.OrderByDescending(c => c.IsActive).ThenByDescending(c => c.Id),
                ("isactive", _) => query.OrderBy(c => c.IsActive).ThenBy(c => c.Id),

                _ => query.OrderBy(c => c.Id)

            };



            var pagedCustomers = await query
                //.OrderBy(c => c.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PagedResponse<Customer>
            {
                Items = pagedCustomers,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / request.PageSize)
            };

        }



        public async Task<int> BulkDeactivateAsync(List<int> ids)
        {
            var updatedCount = await _context.Customers
                .Where(c => ids.Contains(c.Id))
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.IsActive, false)
                                          .SetProperty(c => c.LastModifiedAt, DateTime.UtcNow));

            return updatedCount;

        }


        public async Task<int> BulkActivateAsync(List<int> ids)
        {
            var updatedCount = await _context.Customers
                .Where(c => ids.Contains(c.Id))
                .ExecuteUpdateAsync(s => s.SetProperty(c => c.IsActive, true)
                                          .SetProperty(c => c.LastModifiedAt, DateTime.UtcNow));

            return updatedCount;

        }


        public async Task<CustomerStatsResponse> GetCustomerStatsAsync()
        {
            var customersQuery = _context.Customers.AsNoTracking();

            var totalCount = await _context.Customers.CountAsync();

            var activeCount = await _context.Customers
                .Where(c => c.IsActive)
                .CountAsync();

            /*
            var inactiveCount = await _context.Customers
                .Where(c => c.IsActive == false)
                .CountAsync();
            */

            int inactiveCount = totalCount - activeCount;


            List<CityCustomerCountResponse> top5CitiesByCount = await _context.Customers
                .GroupBy(c => c.City)
                .Select(g => new CityCustomerCountResponse
                {
                    City = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(c => c.Count)
                .Take(5)
                .ToListAsync();

            return new CustomerStatsResponse(
                totalCount, activeCount, inactiveCount, top5CitiesByCount
                );
        }



        public async Task<List<string>> GetAllCountriesAsync()
        {
             return await _context.Customers.Select(c => c.Country).Distinct().ToListAsync();

        }







    }
}
