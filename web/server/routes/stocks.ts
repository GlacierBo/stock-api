import { Router, Request, Response, NextFunction } from "express";
import { stocks } from "../../../src/index";

const router = Router();

function getSource(source?: string) {
  switch (source) {
    case "tencent":
      return stocks.tencent;
    case "sina":
      return stocks.sina;
    case "eastmoney":
      return stocks.eastmoney;
    case "auto":
    default:
      return stocks.auto;
  }
}

// 搜索股票
router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, source } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing required parameter: q",
      });
    }

    const provider = getSource(source as string);
    const results = await provider.searchStocks(q);

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    next(err);
  }
});

// 查询单只股票
router.get("/:code", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const { source } = req.query;

    const provider = getSource(source as string);
    const stock = await provider.getStock(code);

    res.json({
      success: true,
      data: stock,
    });
  } catch (err) {
    next(err);
  }
});

// 批量查询
router.post("/batch", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codes, source } = req.body;

    if (!Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameter: codes (array)",
      });
    }

    if (codes.length > 20) {
      return res.status(400).json({
        success: false,
        error: "Maximum 20 codes per batch request",
      });
    }

    const provider = getSource(source as string);
    const results = await provider.getStocks(codes);

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
