import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCustomerRequest } from '../../../interfaces/DTOs/request/update-customer-request';
import { CustomerService } from '../../../services/CustomerService/customer-service.service';
import { NotificationService } from '../../../services/NotificationService/notification-service.service';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.scss'
})
export class EditCustomerComponent implements OnInit {
  public customer: UpdateCustomerRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    isActive: null
  }

  private id: number | undefined;
  constructor(private route: ActivatedRoute, private router: Router, private customerService: CustomerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.customerService.getById(this.id).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (err) => {
        this.notificationService.errorNotification("Error", "There was an error getting a Customer");
        console.error(err);
        this.fallBack();
      }
    })
  }

  fallBack() {
    const returnUrl = history.state.returnUrl;

    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    }
    else {
      this.router.navigate(['']);
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    
    if (!this.id) {
      this.notificationService.errorNotification("Error", "There was an error getting a Customer");
      this.fallBack();
      return;
    }
    this.customerService.edit(this.id, this.customer).subscribe({
      next: () => {
        this.notificationService
            .successNotificationWithConfirmation(
              "Edit success", 
              `User was successfully edited`, 
              () => this.fallBack());
      },
      error: () => {
        this.notificationService.errorNotification("Error", "There was an error editing a Customer");
        this.fallBack();
      }
    })
  }

  onCancel() {
    this.fallBack();
  }
}
