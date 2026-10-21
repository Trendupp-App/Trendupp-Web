export interface Bank {
  id: number;
  name: string;
  /** What the payout endpoints identify a bank by */
  code: string;
  currency?: string;
}

export interface GetBanksParams {
  region?: string;
  country?: string;
  search?: string;
}
