export interface LoginResponseDto {
  message: string;
  success: boolean;
  customerId: number | null;
}