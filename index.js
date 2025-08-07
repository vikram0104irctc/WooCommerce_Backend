import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { connectToDatabase } from "./config/db.connection.js";
import productsRouter from "./src/services/products/routes/productRoutes.js";
import segmentsRouter from "./src/services/segments/routes/segmentRoutes.js";
import { IngestionCronJob } from "./src/services/cron/ingestProductCronJob.js";

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WooCommerce Product API",
      version: "1.0.0",
      description: "API for managing products",
      contact: {
        name: "API Support",
        email: "vikram0104irctc@gmail.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server"
      },
      {
        url: `${process.env.Production_Server_Url}`,
        description: "Production server"
      }
    ],

  },
  apis: ["./src/services/**/routes/*.js"] // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use('/products', productsRouter);
app.use('/segments', segmentsRouter);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is working fine",
    error: "",
  });
});

const port = process.env.PORT || 5000;

async function startApplication() {
  try {
    await connectToDatabase();
    console.log("MongoDB connection established successfully");
  } catch (error) {
    console.error(
      "Failed to start application due to database connection error:",
      error.message
    );
    process.exit(1);
  }
}

startApplication();
IngestionCronJob.start();

app
  .listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  })
  .on("error", (err) => {
    console.error("Failed to start the server", err.message);
  });
