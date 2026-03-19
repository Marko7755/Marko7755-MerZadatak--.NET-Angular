select * from dbo.Customers;

update dbo.Customers
set City = 'Zagreb'
where id = 2

update dbo.Customers
set City = 'Zagreb'
where id = 12

select city, count(*) numberOfCustomers
from dbo.Customers
group by city
order by numberOfCustomers desc


update dbo.Customers
set City = 'Osijek',
Country = 'Hrvatska'
where id in(13,14,15,16)

truncate table dbo.Customers

select count(*) from dbo.Customers



SELECT COUNT(*) FROM dbo.Customers;

SELECT COUNT(*) FROM dbo.Customers WHERE IsActive = 1;

SELECT TOP 5 City, COUNT(*) AS Cnt
FROM dbo.Customers
GROUP BY City
ORDER BY Cnt DESC;

select top 3 *
from dbo.Customers
order by id desc

delete
from dbo.Customers
where id = 100001


SELECT DATABASEPROPERTYEX(DB_NAME(), 'Collation') AS DatabaseCollation;

SELECT TOP 10 *
FROM Customers
WHERE FirstName LIKE 'marko%' OR LastName LIKE 'marko%'

delete
from dbo.Customers
where country = 'string'