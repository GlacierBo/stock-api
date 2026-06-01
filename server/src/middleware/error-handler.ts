import { Request, Response, NextFunction } from "express";
import { StockApiError, StockCodeError, StockRequestError, StockParseError } from "../types/errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, next: NextFunction): void {
  console.error("Error:", err.message);

  let statusCode = 500;
  let errorMessage = "Internal server error";

  if (err instanceof StockCodeError) {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err instanceof StockRequestError) {
    statusCode = 502;
    errorMessage = err.message;
  } else if (err instanceof StockParseError) {
    statusCode = 500;
    errorMessage = err.message;
  } else if (err instanceof StockApiError) {
    statusCode = 500;
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
}
