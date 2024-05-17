export interface UpdateBalanceRequest {
    balance: number;
    userId: string;
}

export interface GetBalanceResponse {
    balance: number;
    userId: string;
}
