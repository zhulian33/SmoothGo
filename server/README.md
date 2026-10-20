# SmoothGo API Server

这个服务使用 **Python 标准库**，不需要安装第三方依赖。它同时提供：

- `web/` 静态网页
- 手机号验证码登录 API
- SQLite 用户与会话存储
- mock 短信（本地开发）
- 阿里云短信（真实短信）
- 通用 SMS Webhook（接其他短信网关）

## 1. 配置高德地图

1. 打开 [高德开放平台控制台](https://console.amap.com/dev/key/app)。
2. 创建 **Web 端（JS API）** Key。
3. 在 Key 的白名单里加入你实际使用的域名，例如：
   - `http://localhost:8080`
   - 你的 GitHub Pages 域名
4. 编辑 `web/config.js`：

```js
window.SMOOTHGO_CONFIG = {
  amapKey: "你的 Web 端 Key",
  amapSecurityJsCode: "你的安全密钥（如果控制台要求）",
  apiBaseUrl: "",
  authMode: "real"
};
```

`apiBaseUrl` 留空表示网页和 API 同源；如果分开部署，就填 API 地址，例如 `https://api.example.com`。

没有填 `amapKey` 时，网页会自动使用原来的示意地图，不会报错。

## 2. 启动本地服务

```bash
cd server
cp .env.example .env
```

编辑 `.env`：

```env
SMS_PROVIDER=mock
DEV_SHOW_CODE=1
OTP_SECRET=换成一个足够长的随机字符串
```

然后运行：

```bash
python3 server/app.py
```

打开 `http://localhost:8080`。网页和 API 都由这个服务提供。

本地 mock 模式下，点击“发送验证码”会在页面上显示演示验证码。

## 3. 接真实短信

### 阿里云短信

在 `.env` 中设置：

```env
SMS_PROVIDER=aliyun
DEV_SHOW_CODE=0
ALIYUN_SMS_ACCESS_KEY_ID=...
ALIYUN_SMS_ACCESS_KEY_SECRET=...
ALIYUN_SMS_SIGN_NAME=...
ALIYUN_SMS_TEMPLATE_CODE=...
```

阿里云模板里需要有验证码变量，例如：

```text
您的验证码是 ${code}，5 分钟内有效。
```

服务端会发送 `TemplateParam={"code":"123456"}`。

### 其他短信网关

设置：

```env
SMS_PROVIDER=webhook
DEV_SHOW_CODE=0
SMS_WEBHOOK_URL=https://your-sms-gateway.example.com/send
SMS_WEBHOOK_TOKEN=...
```

网关会收到：

```json
{"phone":"+8613800138000","code":"123456","template":"smoothgo_login"}
```

这样也可以接 Twilio 代理、企业微信/飞书机器人或其他合规短信服务。

## 4. 登录流程

1. 用户输入手机号。
2. `POST /api/auth/send-code` 生成 6 位验证码，过期时间默认 5 分钟。
3. 服务端通过短信服务发送验证码。
4. `POST /api/auth/verify` 校验验证码。
5. 首次验证成功会自动创建用户。
6. 返回随机会话 token，网页保存到 `localStorage`。
7. `GET /api/me` 用于恢复登录状态。
8. `POST /api/auth/logout` 用于退出。

登录后还可以使用：

- `GET /api/searches` / `POST /api/searches`：读取和保存路线搜索记录。
- `GET /api/queue-requests` / `POST /api/queue-requests`：读取和保存排队管家演示请求。

排队管家默认每个自然月 **2 次** 演示额度，可用 `QUEUE_MONTHLY_LIMIT`
调整。请求会保存地点类型、前方桌数/人数和初始等待时间，供网页端展示置顶动态；
但只写入演示记录，不派单、不收款、不出票。

## 4b. 购票渠道中转（无需登录）

- `GET /api/booking/channels?place=<id>&name=&lng=&lat=&tel=`
  返回该地点全部渠道，不可用的也返回，只是 `available: false` 并说明原因。
- `GET /api/go?place=<id>&ch=<渠道>&name=&lng=&lat=&tel=` 302 跳转到目标。

渠道取自 `server/booking_channels.json`，也可以只靠查询参数拼装：

| ch | 来源 | 说明 |
|---|---|---|
| `official_miniprogram` | 注册表 | 只有场馆自己提供的 URL Link 才能填；第三方无权生成别人的小程序 Scheme |
| `official_site` | 注册表 | 场馆官网 |
| `phone` | `tel` 参数 | `tel:` 直拨 |
| `amap` | `lng` / `lat` | 高德 POI 详情页，全库保底可用 |
| `meituan` / `dianping` | — | 返回 409 并要求在 App 内搜索，网页版有登录墙/风控 |
| `douyin` | `name` | 搜索页 |

`/api/go` **不接受任何 URL 参数**，只接受数据，目标地址一律由服务端拼装，
因此无法被当作开放重定向使用。网页端拿不到接口时（静态部署、离线）会自动
退回本地拼装的直链，行为一致。

## 5. POI 门店搜索（可选）

网页端默认用浏览器里的 `AMap.PlaceSearch` 直接查门店，用的是 JS API Key，
不需要本服务。下面这个接口是给「自己部署了 server、希望把 Key 留在服务端」的人用的。

```bash
curl "http://127.0.0.1:8080/api/poi/search?keywords=%E4%B8%9C%E5%8C%97%E8%8F%9C&city=%E9%95%BF%E6%98%A5"
curl "http://127.0.0.1:8080/api/poi/search?keywords=%E5%92%96%E5%95%A1&location=125.32,43.81&radius=3000"
```

返回字段：`name`（店名）、`type`（分类）、`address`（地址）、`tel`（电话）、
`province/city/district`、`lng/lat`。

需要到高德控制台申请 **「Web服务」类型** 的 Key，写进 `server/.env` 的
`AMAP_WEB_SERVICE_KEY`。**JS API Key 不能用于此接口**，两者不通用。

注意：高德 POI 不返回大众点评的评分和人均消费，点评也没有面向第三方查询的公开
API。需要这两个字段的话请自行接入合规数据源，再填进同一张卡片。

## 6. 安全边界

- 不要把 `server/.env` 提交到 GitHub。
- 正式部署必须设置强随机 `OTP_SECRET`。
- 正式环境应使用 HTTPS。
- 当前限流是单进程内存/SQLite 级别；生产环境应使用 Redis 或网关限流。
- 验证码只存 HMAC 哈希，不存明文。
- 真实手机号属于个人信息，需要隐私政策、删除机制和合规说明。
- 当前不会自动发送真实短信，除非你配置了阿里云或 webhook。
