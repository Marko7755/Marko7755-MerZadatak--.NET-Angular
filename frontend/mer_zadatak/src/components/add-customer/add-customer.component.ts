import { Component } from '@angular/core';
import { CustomerService } from '../../services/CustomerService/customer-service.service';
import { NotificationService } from '../../services/NotificationService/notification-service.service';
import { CreateCustomerRequest } from '../../interfaces/DTOs/request/create-customer-request';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
  public customer: CreateCustomerRequest = {
    firstName: '',
    lastName: '',
    email: '',
    phone: null,
    city: '',
    country: ''
  }

  constructor(private customerService: CustomerService, private notificationService: NotificationService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload: CreateCustomerRequest = {
      firstName: this.customer.firstName.trim(),
      lastName: this.customer.lastName.trim(),
      email: this.customer.email.trim(),
      phone: this.customer.phone?.trim() ? this.customer.phone.trim() : null,
      city: this.customer.city.trim(),
      country: this.customer.country.trim()
    };


    this.customerService.add(payload).subscribe({
      next: (newCustomer) => {

        this.notificationService
          .successNotificationWithConfirmation(
            "Success",
            `Customer ${newCustomer.firstName + " " + newCustomer.lastName} successfully created`,
            () => this.router.navigate(['']));
      },
      error: (err) => {
        if (err.status === 409) {
          this.notificationService.errorNotification("Error", "Email already exists");
        }
        else {
          this.notificationService.errorNotification("Error", "There was an error adding a Customer")
        }
      }
    })
  }

  onCancel() {
    this.router.navigate(['']);
  }

}
