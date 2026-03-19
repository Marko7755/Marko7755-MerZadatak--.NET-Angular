//using MER_zadatak.Data;
//using Microsoft.EntityFrameworkCore;
//using EFCore.BulkExtensions;

//namespace MER_zadatak.Models
//{
//    public class CustomerSeed
//    {
//        public static async Task SeedCustomersAsync(AppDbContext context)
//        {
//            const int targetCount = 100_000;
//            const int batchSize = 5_000;

//            if (await context.Customers.AnyAsync())
//                return;

//            string[] firstNames =
//                {
//                    "Ivan","Marko","Ana","Petra","Luka","Lucija","Karlo","Mia","Filip","Iva",
//                    "Josip","Ema","Matej","Sara","Leo","Nika","Antonio","Lea","David","Katarina", "Nicole"
//                };

//            string[] lastNames =
//                {
//                    "Horvat","Kovačević","Babić","Marić","Jurić","Novak","Knežević","Vuković","Božić","Pavić",
//                    "Radić","Marković","Matić","Tomić","Perić","Barišić","Šimić","Grgić","Lovrić","Cindrić"
//                };

//            string[] cities =
//                 {
//                    "Zagreb","Split","Rijeka","Osijek","Zadar","Pula","Karlovac","Varaždin","Šibenik","Sisak"
//                 };

//            string country = "Croatia";


//            /*var originalSetting = context.ChangeTracker.AutoDetectChangesEnabled;
//            context.ChangeTracker.AutoDetectChangesEnabled = false;*/

//                for (int offset = 0; offset < targetCount; offset += batchSize)
//                {
//                    var customers = new List<Customer>(batchSize);

//                    for (int i = offset; i < offset + batchSize && i < targetCount; i++)
//                    {
//                        var firstName = firstNames[i % firstNames.Length];
//                        var lastName = lastNames[(i / firstNames.Length) % lastNames.Length];
//                        var city = cities[(i / (firstNames.Length * lastNames.Length)) % cities.Length];


//                        var email =
//                            $"{firstName.ToLower()}.{lastName.ToLower()}{i + 1}@example.com"
//                            .Replace("č", "c")
//                            .Replace("ć", "c")
//                            .Replace("š", "s")
//                            .Replace("ž", "z")
//                            .Replace("đ", "d");


//                        customers.Add(new Customer
//                        {
//                            FirstName = firstName,
//                            LastName = lastName,
//                            Email = email,
//                            Phone = $"+38591{i % 100000000:D8}",
//                            City = city,
//                            Country = country,
//                            IsActive = i % 5 != 0,
//                            CreatedAt = DateTime.UtcNow.AddMinutes(-(i % 50000)),
//                            LastModifiedAt = i % 3 == 0 ? DateTime.UtcNow : null
//                        });
//                    }
                
//                await context.BulkInsertAsync(customers, new BulkConfig {
//                    BatchSize = batchSize,
//                    PreserveInsertOrder = true,
//                    SetOutputIdentity = false
//                });
//                /*
//                await context.Customers.AddRangeAsync(customers);
//                await context.SaveChangesAsync();
//                context.ChangeTracker.Clear();
//                */

//            }


//        }
//    }
//}
