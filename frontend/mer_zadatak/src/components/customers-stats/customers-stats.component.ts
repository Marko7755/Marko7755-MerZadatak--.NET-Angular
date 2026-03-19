import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/CustomerService/customer-service.service';
import { CustomerStatsResponse } from '../../interfaces/DTOs/response/customer-stats-response';
import { NotificationService } from '../../services/NotificationService/notification-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customers-stats',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customers-stats.component.html',
  styleUrl: './customers-stats.component.scss'
})
export class CustomersStatsComponent implements OnInit {
  public stats: CustomerStatsResponse = {
    totalCount: 0,
    activeCount: 0,
    inactiveCount: 0,
    top5Cities: []
  }

  constructor(private customerService: CustomerService, private notificationService: NotificationService) {}


  ngOnInit(): void {
    this.customerService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log(stats);
      },
      error: (err) => {
        this.notificationService.errorNotification("Stats error", "There was an error while getting the Customers stats");
        console.error(err);
      }
    })
  }




}
