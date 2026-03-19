export interface UpdateCustomerRequest {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    city: string,
    country: string,
    isActive: boolean | null
}
