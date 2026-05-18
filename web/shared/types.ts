export interface Stock {
  name: string;
  code: string;
  now: number;
  low: number;
  high: number;
  percent: number;
  yesterday: number;
  source?: "base" | "eastmoney" | "sina" | "tencent";
}

export type StockSource = "auto" | "tencent" | "sina" | "eastmoney";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
