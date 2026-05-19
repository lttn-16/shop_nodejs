# Node.js E-Commerce Backend (shopDEV)

A Node.js / Express backend for an e-commerce platform. It covers authentication, product catalog, cart, checkout, discounts, file uploads (local / S3 / Cloudinary), email, RBAC, search via Elasticsearch, caching with Redis, and async messaging through Kafka & RabbitMQ.

Entry point: [server.js](server.js) → [src/app.js](src/app.js) → [src/routes/index.js](src/routes/index.js).

---

## Features

### Authentication & Access
- Shop signup / login / logout — [src/routes/access/index.js](src/routes/access/index.js)
- JWT access + refresh token rotation — [src/auth/checkAuth.js](src/auth/checkAuth.js), [src/services/keyToken.service.js](src/services/keyToken.service.js)
- API key checking middleware — [src/auth/checkAuth.js](src/auth/checkAuth.js)
- Password hashing with bcrypt — [src/services/access.service.js](src/services/access.service.js)
- Role-Based Access Control (RBAC) using `accesscontrol` — [src/middleware/rbac.js](src/middleware/rbac.js), [src/middleware/role.middleware.js](src/middleware/role.middleware.js)

### Users & Profile
- New user creation — [src/routes/user/index.js](src/routes/user/index.js)
- View any / view own profile (RBAC-gated) — [src/routes/profile/index.js](src/routes/profile/index.js)
- OTP support — [src/models/otp.model.js](src/models/otp.model.js), [src/services/otp.service.js](src/services/otp.service.js)

### Product Catalog
- Create / update product — [src/routes/product/index.js](src/routes/product/index.js)
- Product, SKU, inventory, comment, resource models — [src/models/](src/models/)
- Slug generation via `slugify`
- Search indexing via Elasticsearch — [src/configs/elasticsearch.config.js](src/configs/elasticsearch.config.js)

### Cart
- Get / add / update / delete cart items — [src/routes/cart/index.js](src/routes/cart/index.js)

### Checkout & Order
- Checkout review and place order — [src/routes/checkout/index.js](src/routes/checkout/index.js)
- Order producer / consumer via RabbitMQ — [src/message_queue/rabbitmq/order/](src/message_queue/rabbitmq/order/)

### Discounts
- Create / apply / cancel discounts — [src/routes/discount/index.js](src/routes/discount/index.js)

### File Upload
- Local disk upload (multer) — [src/configs/multer.config.js](src/configs/multer.config.js)
- Cloudinary upload — [src/configs/cloudinary.config.js](src/configs/cloudinary.config.js)
- AWS S3 upload with presigned URLs + CloudFront signer — [src/configs/s3.config.js](src/configs/s3.config.js)
- Routes — [src/routes/upload/index.js](src/routes/upload/index.js)

### Email & Templates
- Create email templates — [src/routes/email/index.js](src/routes/email/index.js)
- Send mail via Nodemailer — [src/configs/nodemailer.config.js](src/configs/nodemailer.config.js)
- HTML template helper — [src/utils/tem.html.js](src/utils/tem.html.js)

### Notifications
- Notification model & service — [src/models/notification.model.js](src/models/notification.model.js), [src/services/notification.service.js](src/services/notification.service.js)

### Messaging / Async Processing
- Kafka producer & consumer — [src/message_queue/kafka/](src/message_queue/kafka/)
- RabbitMQ producer, consumer, and Dead-Letter Exchange (DLX) — [src/message_queue/rabbitmq/](src/message_queue/rabbitmq/)

### Caching & Search
- Redis (node-redis) — [src/configs/redis.config.js](src/configs/redis.config.js)
- ioredis client — [src/configs/ioredis.config.js](src/configs/ioredis.config.js)
- Redis service utilities — [src/services/redis.service.js](src/services/redis.service.js)
- Elasticsearch client — [src/configs/elasticsearch.config.js](src/configs/elasticsearch.config.js)

### Observability
- Winston logger with daily rotating file transport — [src/loggers/winston.log.js](src/loggers/winston.log.js)
- HTTP request logging via Morgan
- Per-request UUID correlation id — [src/app.js](src/app.js)
- Connection health helper — [src/helpers/check.connection.js](src/helpers/check.connection.js)

### Error Handling
- Standardized success / error response classes — [src/core/](src/core/)
- Async route wrapper — [src/helpers/asyncHandler.js](src/helpers/asyncHandler.js)
- Centralized 404 + error middleware — [src/app.js](src/app.js)

### Security & Middleware
- `helmet` HTTP headers
- `compression` gzip
- JSON & urlencoded body parsing
- API key + permission middleware

### Database
- MongoDB via Mongoose — [src/dbs/init.mongodb.js](src/dbs/init.mongodb.js)
- Models — [src/models/](src/models/)
- Repositories — [src/models/repositories/](src/models/repositories/)

---

## Tech Stack / Libraries

### Runtime
- **express** ^5.2.1 — HTTP framework
- **dotenv** ^17.4.2 — env variable loading

### Database / ORM
- **mongoose** ^9.6.1 — MongoDB ODM

### Authentication & Security
- **jsonwebtoken** ^9.0.3 — JWT access / refresh tokens
- **bcrypt** ^6.0.0 — password hashing
- **accesscontrol** ^2.2.1 — RBAC permissions
- **helmet** ^8.1.0 — secure HTTP headers

### Caching & Search
- **redis** ^5.12.1 — Redis client
- **ioredis** ^5.10.1 — alternative Redis client (pub/sub, cluster)
- **@elastic/elasticsearch** ^7.17.11 — Elasticsearch client

### Messaging
- **kafkajs** ^2.2.4 — Apache Kafka client
- **amqplib** ^1.0.6 — RabbitMQ (AMQP) client

### File Upload & Storage
- **multer** ^2.1.1 — multipart/form-data handling
- **cloudinary** ^2.10.0 — image hosting / transformations
- **@aws-sdk/client-s3** ^3.1045.0 — AWS S3 SDK
- **@aws-sdk/s3-request-presigner** ^3.1045.0 — presigned S3 URLs
- **@aws-sdk/cloudfront-signer** ^3.1036.0 — signed CloudFront URLs

### Email
- **nodemailer** ^8.0.7 — SMTP email delivery

### Logging
- **winston** ^3.19.0 — structured logger
- **winston-daily-rotate-file** ^5.0.0 — daily-rotated log files
- **morgan** ^1.10.1 — HTTP request logging

### Utilities
- **uuid** ^14.0.0 — request correlation IDs
- **slugify** ^1.6.9 — URL-friendly slugs
- **compression** ^1.8.1 — gzip response compression

---

## Infrastructure (Docker)

`docker-compose.yml` provisions:
- **Elasticsearch 7.10.0** — `localhost:9200`
- **Kibana 7.10.0** — `localhost:5601`

MongoDB, Redis, Kafka, and RabbitMQ must be provisioned separately (or added to the compose file).

---

## Getting Started

```bash
# 1. Install deps
npm install

# 2. Start infra (Elasticsearch + Kibana)
docker compose up -d

# 3. Configure environment in a .env file
#    (MongoDB URI, Redis, Kafka, RabbitMQ, AWS, Cloudinary, SMTP, etc.)

# 4. Run the server
node server.js
```

Server listens on `process.env.PORT` (default `3000`). All routes are namespaced under `/v1/api`.

---

## CI/CD — GitHub Actions deploy to EC2

Auto-deploy is configured in [.github/workflows/node.js.yml](.github/workflows/node.js.yml). Every push to `master` triggers a deployment to the EC2 instance.

**Flow**
1. **Trigger** — `push` to `master`.
2. **Runner** — `self-hosted`, i.e. a GitHub Actions runner installed directly on the EC2 instance (no SSH step needed; the runner pulls the job).
3. **Checkout + Node.js 20.x** with npm cache.
4. **`npm install`** on the instance.
5. **Generate `.env`** from the `ENV_FILE` GitHub Secret (contains Mongo URI, Redis, Kafka, RabbitMQ, AWS, Cloudinary, SMTP, JWT keys, …).
6. **Restart via PM2** — `pm2 reload all` for zero-downtime reload, falling back to `pm2 start server.js --name "shopdev-api"` on first deploy.

**One-time EC2 setup**
- Install Node.js 20.x, `npm`, and `pm2` globally (`npm i -g pm2`).
- Register the machine as a GitHub Actions self-hosted runner (Repo → Settings → Actions → Runners → New self-hosted runner) and run it as a service so it survives reboots.
- Add an `ENV_FILE` repository secret containing the full `.env` contents.
- Open the app port (default `3000`) in the EC2 security group, or front it with Nginx / ALB.

---

## Project Structure

```
src/
├── app.js                 # Express app bootstrap
├── auth/                  # JWT / API-key middleware
├── configs/               # Redis, ioredis, Elasticsearch, S3, Cloudinary, Multer, Nodemailer
├── controllers/           # Route handlers
├── core/                  # Success / error response classes
├── dbs/                   # MongoDB connection
├── helpers/               # asyncHandler, connection check
├── loggers/               # Winston logger
├── message_queue/         # Kafka + RabbitMQ producers/consumers
├── middleware/            # RBAC, role middleware
├── models/                # Mongoose schemas + repositories
├── routes/                # Versioned route definitions
├── services/              # Business logic
└── utils/                 # Misc helpers
```
