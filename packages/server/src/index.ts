import express from "express";
import path from "path";
import apiRouter from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// API 路由
app.use("/api", apiRouter);

// 生产模式：serve 前端静态文件
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// 错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
