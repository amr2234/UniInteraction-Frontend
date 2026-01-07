export interface NafathLoginData {
  nationalId: string;
}

export interface NafathSession {
  transactionId: string;
  randomNumber: string;
  status: 'pending' | 'approved' | 'rejected';
}
