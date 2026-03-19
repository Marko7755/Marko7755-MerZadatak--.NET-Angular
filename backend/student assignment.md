### Task

**Scenario:** You are building a module for a company that manages a large customer database (500,000+ records).
The system needs to handle bulk operations efficiently. Your job is to build a small but functional proof-of-concept.

---

### BACKEND (.NET 8 or 10 Web API)

Build a .NET 8 or 10 Web API project with the following:

**1. Database Setup (SQL Server or SQLite for demo purposes)**

Create a `Customers` table:
```
Id (int, PK, identity)
FirstName (nvarchar 100)
LastName (nvarchar 100)
Email (nvarchar 255, unique)
Phone (nvarchar 50, nullable)
City (nvarchar 100)
Country (nvarchar 100)
IsActive (bit, default 1)
CreatedAt (datetime2, default GETDATE())
LastModifiedAt (datetime2, nullable)
```

**2. Seed Data**

Write a seed method that generates exactly **100,000 customer records** using a pattern
(not random garbage - use realistic-looking first names, last names, cities). 
The seed must complete in under 30 seconds. - r

**3. API Endpoints**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/customers` | Paginated list with **server-side** filtering (by name, city, country, isActive) and sorting. Must support `pageSize` (max 100) and `pageNumber`. | - r
| GET | `/api/customers/{id}` | Single customer | - r
| POST | `/api/customers` | Create one customer (validate email uniqueness) | - r
| PUT | `/api/customers/{id}` | Update customer | - r
| DELETE | `/api/customers/{id}` | Soft delete (set IsActive = false) | - r
| POST | `/api/customers/bulk-deactivate` | Accepts a JSON array of customer IDs (up to 1000). Deactivates all of them in a **single database round-trip**. Returns how many were actually updated. | - r
| GET | `/api/customers/stats` | Returns: total count, active count, inactive count, top 5 cities by customer count. Must respond in under 500ms on 100k records. | - r

**4. Technical Requirements**
- Use Entity Framework Core (Code First with migrations) - r
- Proper HTTP status codes (201 on create, 404 when not found, 409 on email conflict, 400 on validation errors) - r
- No business logic in controllers - use a service layer - r
- Global exception handling middleware - r
- Add a simple request logging middleware that logs: timestamp, HTTP method, path, response time in ms - r

---

### FRONTEND (Angular 17+)

**5. Customer List Page**
- Display customers in a table with columns: Name, Email, City, Country, Status, Actions - r
- Server-side pagination (show page numbers, total records) - r
- Search input that filters by name (debounced, 300ms delay, minimum 2 characters) - r
- Dropdown filter for country - r
- Checkbox column for bulk selection - r
- "Deactivate Selected" button that calls the bulk-deactivate endpoint - r
- Show a loading spinner during API calls - r
- Show total record count in header - r

**6. Customer Detail / Edit**
- Click a row to open edit form (can be a dialog or separate route) - r
- Form validation: email required + valid format, first name + last name required, min 2 characters - r
- Show success/error toast notifications on save - r

**7. Stats Dashboard**
- Simple card layout showing the stats from `/api/customers/stats` - r
- Show "Top 5 cities" as a simple bar chart OR as a ranked list - r

---

### WHAT TO SUBMIT

1. **The code** - pushed to a public GitHub/GitLab repository
2. **A short README.md** (max 1 page) containing:
   - How to run the project (step by step)
   - Any design decisions you made and WHY
   - What you would improve if you had more time
   - How long each part actually took you (be honest)
3. **Screen recording** (2-5 minutes) - record your screen while you:
   - Open the project in your IDE
   - Walk through the code briefly explaining your structure
   - Run the application and demonstrate: searching, pagination, bulk deactivate, stats page
   - Show the console/network tab during a bulk operation


### EVALUATION CRITERIA 

| Criteria | Weight | What we look for |
|----------|--------|------------------|
| **Working application** | 30% | Does it run? Do all endpoints work? Does the frontend connect properly? |
| **Code structure & patterns** | 25% | Service layer separation, proper DI, Angular component structure, reactive forms vs template-driven, how they handle HTTP calls |
| **Performance thinking** | 20% | How is the seed implemented? Does bulk-deactivate actually use a single round-trip? Is pagination truly server-side? How fast is `/stats`? |
| **Error handling & edge cases** | 15% | What happens with duplicate emails? Empty bulk array? Page number beyond total? Invalid ID? |
| **Code explanation (live call)** | 10% | Explain your own code? Change on the fly. |