export interface CreateCustomerRequest {
    firstName: string,
    lastName: string,
    email: string,
    phone: string | null,
    city: string,
    country: string
}
