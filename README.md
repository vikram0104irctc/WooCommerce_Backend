# 🛒 WooCommerce Product Segmentation API

A Node.js backend service that integrates with the WooCommerce REST API to ingest product data and provides dynamic endpoints for product segmentation.

Built using **Express.js**, **MongoDB**, and **cron jobs**, this backend offers automated syncing, rule-based querying, and a **Swagger-documented** API interface.

---

## 🚀 Key Features

- ⏱️ **Automated Product Ingestion** from WooCommerce (every 5 minutes)
- 🧩 **Rule-Based Product Segmentation** engine (query by price, date, category, etc.)
- 📦 **MongoDB Storage** with Mongoose schema validation
- 📄 **Interactive Swagger API Docs**
- ❤️ **Health Check** Endpoint for uptime monitoring
- 🔄 **Scheduled Jobs** using `node-cron`

---

## 🧱 Technologies Used

| Purpose              | Tool                   |
|----------------------|------------------------|
| Runtime              | Node.js 18+            |
| Web Framework        | Express.js             |
| Database             | MongoDB + Mongoose     |
| Job Scheduling       | node-cron              |
| Logging              | Winston                |
| API Documentation    | Swagger UI Express     |

---

## ⏰ Scheduled Jobs

| Job Name           | Frequency       | Description                                 |
|--------------------|-----------------|---------------------------------------------|
| Product Ingestion  | Every 5 minutes | Syncs products from WooCommerce to MongoDB  |

---

## 📡 API Endpoints

| Endpoint               | Method | Description                                |
|------------------------|--------|--------------------------------------------|
| `/products`            | GET    | Retrieve all products (paginated)          |
| `/products/ingest`     | GET    | Manually trigger product ingestion         |
| `/segments/evaluate`   | POST   | Evaluate product segments via rules        |
| `/health`              | GET    | System health check                        |

---

## 🔁 Cron Job Implementation

```js
// File: src/services/cron/ingestProductCronJob.js

import cron from 'node-cron';
import { ingestProducts } from '../productService';

const IngestionCronJob = {
  start: () => {
    cron.schedule('*/5 * * * *', async () => {
      console.log('Running scheduled product ingestion...');
      try {
        await ingestProducts();
        console.log('Product ingestion completed successfully');
      } catch (error) {
        console.error('Scheduled ingestion failed:', error.message);
      }
    });

    console.log('Product ingestion cron job started (runs every 5 minutes)');
  }
};

export default IngestionCronJob;

🛠️ Setup Instructions
1. Clone the Repository

git clone https://github.com/vikram0104irctc/WooCommerce_Backend.git
cd WooCommerce_Backend

2. Install Dependencies
npm install

3. Configure Environment Variables
cp .env.example .env

Sample .env Configuration:
MONGO_URI=mongodb://localhost:27017/woocommerce
WOOCOMMERCE_BASE_URL=https://wp-multisite.convertcart.com
WOOCOMMERCE_CONSUMER_KEY = WOOCOMMERCE_CONSUMER_KEY
WOOCOMMERCE_CONSUMER_SECRET=WOOCOMMERCE_CONSUMER_SECRET
CRON_INTERVAL=*/5 * * * *  # Every 5 minutes
PORT=4001

4. Start the Server
npm start

5. 📚 API Documentation
The interactive Swagger UI is available at:

👉 http://${caseUrl}/api-docs

Use it to test and explore all available endpoints.

🧭 Monitoring the Cron Job
✅ Successful run: Product ingestion completed successfully

❌ Failure log: Scheduled ingestion failed: [error message]

🚀 Startup log: Product ingestion cron job started (runs every 5 minutes)

🤖 AI & Code Notes
✨ Backend logic and segmentation engine: Fully custom built

📜 Swagger/OpenAPI: Used DeepSeek for auto-spec generation (OpenAPI 3.0)

🧯 Error Handling: Graceful and informative, especially around cron and ingestion errors

🤖 AI & Code Notes
✨ Backend logic and segmentation engine: Fully custom built

📜 Swagger/OpenAPI: Used DeepSeek for auto-spec generation (OpenAPI 3.0)

🧯 Error Handling: Graceful and informative, especially around cron and ingestion errors