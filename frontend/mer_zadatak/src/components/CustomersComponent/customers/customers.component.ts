import { Component, OnDestroy } from '@angular/core';
import { OnInit } from "@angular/core";
import { PaginationParametersRequest } from '../../../interfaces/DTOs/request/pagination-parameters-request';
import { CustomerResponse } from '../../../interfaces/DTOs/response/customer-response';
import { PagedResponse } from '../../../interfaces/DTOs/response/paged-response';
import { CustomerService } from '../../../services/CustomerService/customer-service.service';
import { NotificationService } from '../../../services/NotificationService/notification-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit, OnDestroy {
  public pagedResponse: PagedResponse<CustomerResponse> = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0
  };
  private destroy$ = new Subject<void>();

  public nameSearchControl = new FormControl('', { nonNullable: true });
  public countrySearchControl = new FormControl<string | null>(null);
  public isActiveSearchControl = new FormControl<boolean | null>(null);

  public allCountries: string[] = [];

  public selectedIds = new Set<number>;
  public checked: boolean = true;

  paginationParameters: PaginationParametersRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortDirection: 'asc'
  };

  constructor(
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.customerService.getAllCountries().subscribe(countries => this.allCountries = countries);

    this.executeNameSearch();
    this.executeCountrySearch();
    this.executeIsActiveSearch();

    this.route.queryParams.subscribe(params => {
      console.log('PARAMS:', params);
      this.paginationParameters = {
        pageNumber: params['pageNumber'] ? Number(params['pageNumber']) : 1,
        pageSize: params['pageSize'] ? Number(params['pageSize']) : 10,
        name: params['name'] || undefined,
        city: params['city'] || undefined,
        country: params['country'] || undefined,
        isActive: params['isActive'] !== undefined && params['isActive'] !== ''
          ? params['isActive'] === 'true'
          : undefined,
        sortBy: params['sortBy'] || undefined,
        sortDirection: params['sortDirection'] || 'asc'
      }

      this.nameSearchControl.setValue(this.paginationParameters.name ?? '', {
        emitEvent: false
      });

      this.countrySearchControl.setValue(this.paginationParameters.country ?? null, {
        emitEvent: false
      });

      this.isActiveSearchControl.setValue(this.paginationParameters.isActive ?? null, {
        emitEvent: false
      });

      this.loadCustomers();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private executeNameSearch() {
    this.nameSearchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        const trimmedValue = value.trim();

        if (trimmedValue.length === 0) {
          this.paginationParameters.name = undefined;
          this.paginationParameters.pageNumber = 1;
          this.updateUrlAndReload();
          return;
        }

        if (trimmedValue.length >= 2) {
          this.paginationParameters.name = trimmedValue;
          this.paginationParameters.pageNumber = 1;
          this.updateUrlAndReload();
        }
      });
  }

  private executeCountrySearch() {
    this.countrySearchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.paginationParameters.country = value || undefined;
        this.paginationParameters.pageNumber = 1;
        this.updateUrlAndReload();
      })
  }

  private executeIsActiveSearch() {
    this.isActiveSearchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.paginationParameters.isActive = value ?? undefined;
        this.paginationParameters.pageNumber = 1;
        this.updateUrlAndReload();
      })
  }

  public sort(column: string) {
    if (this.paginationParameters.sortBy === column) {
      this.paginationParameters.sortDirection =
        this.paginationParameters.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else {
      this.paginationParameters.sortBy = column;
      this.paginationParameters.sortDirection = 'asc';
    }
    this.paginationParameters.pageNumber = 1;
    this.updateUrlAndReload();
  }

  public getSortIcon(column: string): string {
    if (this.paginationParameters.sortBy !== column) return '';

    return this.paginationParameters.sortDirection === 'asc' ? '↑' : '↓';
  }



  loadCustomers() {
    this.customerService.getPaged(this.paginationParameters).subscribe({
      next: (res) => {
        console.log("Res ", res);
        this.pagedResponse = res;
      },
      error: (err) => {
        console.error(err);
      }
    }
    );
  }


  updateUrlAndReload() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pageNumber: this.paginationParameters.pageNumber,
        pageSize: this.paginationParameters.pageSize,
        name: this.paginationParameters.name || null,
        city: this.paginationParameters.city || null,
        country: this.paginationParameters.country || null,
        isActive: this.paginationParameters.isActive ?? null,
        sortBy: this.paginationParameters.sortBy || null,
        sortDirection: this.paginationParameters.sortDirection || 'asc'
      }
    });
  }


  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) return;

    this.paginationParameters.pageNumber = page;
    this.updateUrlAndReload();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.goToPage(this.pageNumber + 1);
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.goToPage(this.pageNumber - 1);
    }
  }



  editCustomer(customerId: number) {
    this.router.navigate(['customerEdit/', customerId], { state: { returnUrl: this.router.url } });
  }

  isItemSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  toggleCheckedItem(id: number) {
    if (this.isItemSelected(id)) {
      this.selectedIds.delete(id);
    }
    else {
      this.selectedIds.add(id);
    }
    /* console.log(this.selectedIds.size);
    console.log(this.selectedIds); */
  }


  isAllSelected(): boolean {
    return this.selectedIds.size > 0 && this.customers.length === this.selectedIds.size;
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    let selectableItems = this.customers;
    if (this.paginationParameters.isActive) {
      selectableItems.filter(c => c.isActive === false);
    }
    else {
      selectableItems.filter(c => c.isActive === true);
    }
    //const selectableItems = this.customers.filter(c => c.isActive === false);

    if (checked) {
      selectableItems.forEach(c => this.selectedIds.add(c.id))
    }
    else {
      selectableItems.forEach(i => this.selectedIds.delete(i.id));
    }

  }

  get isBulkActivateDisabled(): boolean {
    return this.selectedIds.size == 0 || this.customers.some(c => this.selectedIds.has(c.id) && c.isActive);
  }

  get isBulkDiactivateDisabled(): boolean {
    return this.selectedIds.size == 0 || this.customers.some(c => this.selectedIds.has(c.id) && !c.isActive)
  }



  activateCustomer(id: number) {
    if (id != null) {
      this.notificationService.confirmCancelNotification("activate this user", () => {
        this.customerService.activate(id)
          .subscribe({
            next: () => {
              this.notificationService
                .successNotification("User activated", 'User has been successfully activated');
            },
            error: () => {
              this.notificationService.errorNotification("Error", "Failed to activate user");
            }
          })
      })

    }
    else {
      this.notificationService.errorNotification("Unkown error", "Unkown error occurred");
    }

  }



  deactivateCustomer(id: number) {
    if (id != null) {
      this.notificationService.confirmCancelNotification("deactivate this user", () => {
        this.customerService.deactivate(id)
          .subscribe({
            next: () => {
              this.notificationService
                .successNotification("User deactivate", 'User has been successfully deactivate');
            },
            error: () => {
              this.notificationService.errorNotification("Error", "Failed to deactivate user");
            }
          })
      })

    }
    else {
      this.notificationService.errorNotification("Unkown error", "Unkown error occurred");
    }

  }




  bulkActivateCustomers() {
    if (this.selectedIds.size > 0) {
      this.notificationService.confirmCancelNotification("activate this user", () => {
        this.customerService.bulkActivate(this.selectedIds)
          .subscribe({
            next: (activatedCount) => {
              if (activatedCount > 0) {
                this.notificationService
                  .successNotification("Users activate", `${activatedCount} user/users have been successfully activate`);
                this.selectedIds.clear();
              }
            },
            error: () => {
              this.notificationService.errorNotification("Error", "Failed to deactivate users");
            }
          })
      })

    }
    else {
      this.notificationService.errorNotification("Unkown error", "Unkown error occurred");
    }

  }


  bulkDeactivateCustomers() {
    if (this.selectedIds.size > 0) {
      this.notificationService.confirmCancelNotification("deactivate this user", () => {
        this.customerService.bulkDeactivate(this.selectedIds)
          .subscribe({
            next: (deactivatedCount) => {
              if (deactivatedCount > 0) {
                this.notificationService
                  .successNotification("Users deactivated", `${deactivatedCount} user/users have been successfully deactivated`);
                this.selectedIds.clear();
              }
            },
            error: () => {
              this.notificationService.errorNotification("Error", "Failed to deactivate users");
            }
          })
      })

    }
    else {
      this.notificationService.errorNotification("Unkown error", "Unkown error occurred");
    }

  }





  get customers(): CustomerResponse[] {
    return this.pagedResponse.items ?? [];
  }

  get totalCount(): number {
    return this.pagedResponse.totalCount ?? 0;
  }

  get pageNumber(): number {
    return this.pagedResponse.pageNumber ?? this.paginationParameters.pageNumber;
  }

  get pageSize(): number {
    return this.pagedResponse.pageSize ?? this.paginationParameters.pageSize;
  }

  get totalPages(): number {
    return this.pagedResponse.totalPages ?? 0;
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.pageNumber;

    if (total <= 7) {
      return Array.from({ length: total }, (value, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (current >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }

    return [current - 2, current - 1, current, current + 1, current + 2];
  }







}
