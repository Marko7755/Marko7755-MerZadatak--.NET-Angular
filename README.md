
Svrha ovog projekta je napraviti user-friendly aplikaciju koja može učinkovito podnijeti veći broj korisnika(npr. 100 000).


Pokretanje projekta:
1. Kloniranje repozitorija --
git clone https://github.com/Marko7755/Marko7755-MerZadatak--.NET-Angula.git ->
cd Marko7755-MerZadatak--.NET-Angula

2. Pokretanje backenda --
cd backend ->
dotnet restore ->
dotnet ef database update ->
dotnet run

3. Pokretanje frontenda --
cd frontend/mer_zadatak -> 
npm install ->
ng serve

4. Pokretanje aplikacije --
otvoriti "http://localhost:4200" u pregledniku


Napomene --
 Provjeriti da je SQL Server pokrenut
 Baza se automatski kreira pomoću migracija
Connection string može se promijeniti u appsettings.json



Korišten je interface za service kako bi kod bio pregledniji i organiziraniji. Sav exception handling je u middleware-u tako da je controller čist. Također, sva business logika je u service-u. 
Server-side paginacija, sort, filter - bolje perfomanske i skalabilnost kod većeg broja zapisa. SQL Server + EF Core migracije zbog lakšeg kreiranja i korištenja baze. Insert u batchevima zbog boljih perfomansi i manje opterećenje memorije.
Odvojeni frontend i backend zbog lakše organizacije.



Da sam imao više vremena napravio bih to da se promjene pokazuju bez refreshanja ekrana(npr. nakon deaktiviranja ili dodavanja korisnika da se odmah pokaže novi status bez potrebe za refreshom). 
Napravio bih log file(da nije ispis samo u konzoli) u koji bi logirao sve greške, requestove itd. Register, login, refresh token...



Najviše vremena sam utrošio na paginaciji, filterima i sortu.