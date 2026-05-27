"""
Stock API 文档服务

基于 FastAPI 自动生成交互式 API 文档
启动方式: uvicorn main:app --reload --port 8000
访问文档: http://localhost:8000/docs (Swagger UI)
          http://localhost:8000/redoc (ReDoc)
"""

from enum import Enum
from typing import Generic, TypeVar, Optional

from fastapi import FastAPI, Query, Path, Body
from pydantic import BaseModel, Field

T = TypeVar("T")

# ─── 枚举 ───────────────────────────────────────────────

class StockSource(str, Enum):
    auto = "auto"
    tencent = "tencent"
    sina = "sina"
    eastmoney = "eastmoney"


class StockSourceEnum(str, Enum):
    base = "base"
    eastmoney = "eastmoney"
    sina = "sina"
    tencent = "tencent"


# ─── 数据模型 ────────────────────────────────────────────

class Stock(BaseModel):
    """股票行情数据"""
    name: str = Field(..., description="股票名称", examples=["贵州茅台"])
    code: str = Field(..., description="标准化股票代码", examples=["SH600519"])
    now: float = Field(..., description="当前价格", examples=[1850.50])
    low: float = Field(..., description="最低价", examples=[1830.00])
    high: float = Field(..., description="最高价", examples=[1865.00])
    percent: float = Field(..., description="涨跌幅 (0.01 表示 1%)", examples=[0.012])
    yesterday: float = Field(..., description="昨收价", examples=[1828.00])
    source: Optional[StockSourceEnum] = Field(None, description="数据来源")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "贵州茅台",
                    "code": "SH600519",
                    "now": 1850.50,
                    "low": 1830.00,
                    "high": 1865.00,
                    "percent": 0.012,
                    "yesterday": 1828.00,
                    "source": "tencent",
                }
            ]
        }
    }


class ApiResponse(BaseModel, Generic[T]):
    """统一 API 响应格式"""
    success: bool = Field(..., description="请求是否成功")
    data: Optional[T] = Field(None, description="响应数据")
    error: Optional[str] = Field(None, description="错误信息")


class ErrorResponse(BaseModel):
    """错误响应"""
    success: bool = Field(False, description="固定为 false")
    error: str = Field(..., description="错误描述")


class BatchRequest(BaseModel):
    """批量查询请求体"""
    codes: list[str] = Field(
        ...,
        description="股票代码列表，最多 20 个",
        min_length=1,
        max_length=20,
        examples=[["SH600519", "SZ000651"]],
    )
    source: Optional[StockSource] = Field(
        StockSource.auto,
        description="数据来源，默认 auto",
    )


# ─── FastAPI 应用 ────────────────────────────────────────

app = FastAPI(
    title="Stock API",
    description="""
## 股票行情 API

提供 A 股、港股、美股实时行情数据查询服务。

### 数据来源
- **tencent** — 腾讯财经
- **sina** — 新浪财经
- **eastmoney** — 东方财富
- **auto** — 自动选择（依次尝试 tencent → sina → eastmoney）

### 股票代码格式
| 市场 | 格式 | 示例 |
|------|------|------|
| 沪市 | `SH` + 6位代码 | `SH600519` |
| 深市 | `SZ` + 6位代码 | `SZ000651` |
| 港股 | `HK` + 5位代码 | `HK00700` |
| 美股 | `US` + 代码 | `USAAPL` |
""",
    version="2.3.0",
    docs_url="/docs",
    redoc_url="/redoc",
    license_info={"name": "MIT"},
)


# ─── 错误响应映射 ────────────────────────────────────────

error_responses = {
    400: {"model": ErrorResponse, "description": "股票代码无效或参数错误"},
    500: {"model": ErrorResponse, "description": "服务器内部错误"},
    502: {"model": ErrorResponse, "description": "上游数据源请求失败"},
}


# ─── 路由 ────────────────────────────────────────────────

@app.get(
    "/api/sources",
    response_model=ApiResponse[list[str]],
    tags=["数据源"],
    summary="获取可用数据源列表",
    description="返回所有支持的股票数据来源名称。",
)
async def get_sources():
    """
    返回可用的数据源列表，例如:
    ```json
    { "success": true, "data": ["tencent", "sina", "eastmoney"] }
    ```
    """
    ...


@app.get(
    "/api/stocks/search",
    response_model=ApiResponse[list[Stock]],
    tags=["股票查询"],
    summary="搜索股票",
    description="根据关键词搜索股票，返回匹配的股票列表。",
    responses={
        400: {"model": ErrorResponse, "description": "缺少必要参数 q"},
        502: {"model": ErrorResponse, "description": "数据源请求失败"},
    },
)
async def search_stocks(
    q: str = Query(..., description="搜索关键词（股票名称或代码）", examples=["茅台"]),
    source: StockSource = Query(StockSource.auto, description="数据来源"),
):
    """
    搜索示例:

    ```
    GET /api/stocks/search?q=茅台&source=auto
    ```
    """
    ...


@app.get(
    "/api/stocks/{code}",
    response_model=ApiResponse[Stock],
    tags=["股票查询"],
    summary="查询单只股票行情",
    description="根据股票代码获取实时行情数据。",
    responses=error_responses,
)
async def get_stock(
    code: str = Path(..., description="股票代码，如 SH600519", examples=["SH600519"]),
    source: StockSource = Query(StockSource.auto, description="数据来源"),
):
    """
    查询示例:

    ```
    GET /api/stocks/SH600519?source=tencent
    ```
    """
    ...


@app.post(
    "/api/stocks/batch",
    response_model=ApiResponse[list[Stock]],
    tags=["股票查询"],
    summary="批量查询股票行情",
    description="一次性查询多只股票的实时行情，最多支持 20 个股票代码。",
    responses={
        **error_responses,
        422: {"description": "请求体验证失败（codes 为空或超过 20 个）"},
    },
)
async def batch_get_stocks(
    body: BatchRequest = Body(
        ...,
        examples={
            "normal": {
                "summary": "批量查询示例",
                "value": {"codes": ["SH600519", "SZ000651", "HK00700"], "source": "auto"},
            }
        },
    ),
):
    """
    批量查询示例:

    ```json
    POST /api/stocks/batch
    {
      "codes": ["SH600519", "SZ000651"],
      "source": "auto"
    }
    ```
    """
    ...
