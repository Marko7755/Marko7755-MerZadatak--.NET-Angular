import { Routes } from '@angular/router';
import { CustomersComponent } from '../components/CustomersComponent/customers/customers.component';
import { EditCustomerComponent } from '../components/edit/edit-customer/edit-customer.component';
import { CustomersStatsComponent } from '../components/customers-stats/customers-stats.component';
import { AddCustomerComponent } from '../components/add-customer/add-customer.component';

export const routes: Routes = [
    { path: '', component: CustomersComponent },
    { path: 'customerEdit/:id', component: EditCustomerComponent },
    { path: 'customerStats', component: CustomersStatsComponent },
    {path: 'createCustomer', component: AddCustomerComponent}

];
