namespace MER_zadatak.DTOs.Pagination
{
    public class PaginationParametersRequest
    {
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;

        public int PageSize {
            get => _pageSize;
            set => _pageSize = value > 100 ? 100 : value;
        }

        public string? Name { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public bool? IsActive { get; set; }

        public string? SortBy { get; set; }

        public string? SortDirection { get; set; } = "asc";


    }
}
