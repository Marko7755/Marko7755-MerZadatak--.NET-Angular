export interface PaginationParametersRequest {
    pageNumber: number;
    pageSize: number;
    name?: string;
    city?: string;
    country?: string;
    isActive?: boolean;
    sortBy?: string;
    sortDirection?: string;
}
