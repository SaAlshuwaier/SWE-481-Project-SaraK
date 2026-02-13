export interface CheckoutDto {
  firstName?: string;
  lastName?: string;
  cardNumber?: string;
  expiration?: string; // "2030-12-31"

  success?: boolean;
  message?: string;
}
