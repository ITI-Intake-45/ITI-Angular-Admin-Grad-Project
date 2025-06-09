export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  creditBalance: number;
}
