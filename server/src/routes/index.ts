import { Router } from "express";
import stocksRouter from "./stocks";
import { stocks } from "../providers";

const router = Router();

// 股票相关路由
router.use("/stocks", stocksRouter);

// 获取可用数据源
router.get("/sources", (_req, res) => {
  res.json({
    success: true,
    data: stocks.getSources(),
  });
});

export default router;
