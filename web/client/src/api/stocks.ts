import type { Stock, StockSource, ApiResponse } from "../../../shared/types";

const BASE_URL = "/api";

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Request failed");
  }

  return data.data as T;
}

export async function searchStocks(keyword: string, source?: StockSource): Promise<Stock[]> {
  const params = new URLSearchParams({ q: keyword });
  if (source && source !== "auto") {
    params.set("source", source);
  }
  return request<Stock[]>(`${BASE_URL}/stocks/search?${params}`);
}

export async function getStock(code: string, source?: StockSource): Promise<Stock> {
  const params = new URLSearchParams();
  if (source && source !== "auto") {
    params.set("source", source);
  }
  const query = params.toString() ? `?${params}` : "";
  return request<Stock>(`${BASE_URL}/stocks/${code}${query}`);
}

export async function getStocksBatch(codes: string[], source?: StockSource): Promise<Stock[]> {
  const response = await fetch(`${BASE_URL}/stocks/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codes, source: source !== "auto" ? source : undefined }),
  });
  const data: ApiResponse<Stock[]> = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Request failed");
  }

  return data.data as Stock[];
}

export async function getSources(): Promise<string[]> {
  return request<string[]>(`${BASE_URL}/sources`);
}
