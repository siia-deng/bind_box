# Hurdle Club Website

前后端分离的 Hurdle Club 网站原型。

## Stack

- `web/`: Next.js App Router + TailwindCSS
- `service/`: Node.js + Express + MongoDB/Mongoose
- 根目录 npm workspaces 统一管理

## Local Development

```bash
npm install
cp .env.example service/.env
cp .env.example web/.env.local
npm run seed
npm run dev
```

默认地址：

- Web: http://localhost:3000
- API: http://localhost:4000/api/health

如果暂时没有启动 MongoDB，前端会使用内置首版内容渲染页面；报名提交和后端 CRUD 需要 API 与 MongoDB 可用。
