import { CityCustomerCountResponse } from "./city-customer-count-response";

export interface CustomerStatsResponse {
    totalCount: number,
    activeCount: number,
    inactiveCount: number,
    top5Cities: Array<CityCustomerCountResponse>;
}
