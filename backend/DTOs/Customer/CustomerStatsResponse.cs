namespace MER_zadatak.DTOs.Customer
{
    public class CustomerStatsResponse
    {
        public int TotalCount { get; set; }

        public int ActiveCount { get; set; }

        public int InactiveCount { get; set; }

        public List<CityCustomerCountResponse> Top5Cities { get; set; }


        public CustomerStatsResponse(int totalCount, int activeCount, int inactiveCount, List<CityCustomerCountResponse> top5Cities) {
            TotalCount = totalCount;
            ActiveCount = activeCount;
            InactiveCount = inactiveCount;
            Top5Cities = top5Cities;
        }

    }
}
