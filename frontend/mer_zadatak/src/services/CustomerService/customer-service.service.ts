import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResponse } from '../../interfaces/DTOs/response/paged-response';
import { CustomerResponse } from '../../interfaces/DTOs/response/customer-response';
import { PaginationParametersRequest } from '../../interfaces/DTOs/request/pagination-parameters-request';
import { HttpClient } from '@angular/common/http';
import { UpdateCustomerRequest } from '../../interfaces/DTOs/request/update-customer-request';
import { CustomerStatsResponse } from '../../interfaces/DTOs/response/customer-stats-response';
import { CreateCustomerRequest } from '../../interfaces/DTOs/request/create-customer-request';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly apiUrl: string = 'https://localhost:7137/api/customers';

  constructor(private http: HttpClient) { }


  getPaged(request: PaginationParametersRequest): Observable<PagedResponse<CustomerResponse>> {
    return this.http.get<PagedResponse<CustomerResponse>>(`${this.apiUrl}`, {
      params: {
        pageNumber: request.pageNumber,
        pageSize: request.pageSize,
        name: request.name ?? '',
        city: request.city ?? '',
        country: request.country ?? '',
        isActive: request.isActive ?? '',
        sortBy: request.sortBy ?? '',
        sortDirection: request.sortDirection ?? 'asc'
      }
    });
  }

  getAllCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/allCountries`);
  }


  activate(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${id}`, {});
  }

  deactivate(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/deactivate/${id}`, {});
  }


  bulkDeactivate(ids: Set<number>): Observable<number> {
    const idsArray = Array.from(ids);
    return this.http.put<number>(`${this.apiUrl}/bulk-deactivate`, idsArray);
  }


  bulkActivate(ids: Set<number>): Observable<number> {
    const idsArray = Array.from(ids);
    return this.http.put<number>(`${this.apiUrl}/bulk-activate`, idsArray);
  }


  getById(id: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/${id}`, {});
  }

  edit(id: number, edited: UpdateCustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.apiUrl}/${id}`, edited);
  }

  getStats(): Observable<CustomerStatsResponse> {
    return this.http.get<CustomerStatsResponse>(`${this.apiUrl}/stats`);
  }

  add(add: CreateCustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(`${this.apiUrl}`, add);
  }


}
