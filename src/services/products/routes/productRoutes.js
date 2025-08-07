import express from "express";
import { ProductController } from "../controllers/productController.js";
const productsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - price
 *         - regular_price
 *         - sale_price
 *         - stock_status
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the product
 *           example: 12345
 *         title:
 *           type: string
 *           description: Name of the product
 *           example: "Premium Wireless Headphones"
 *         price:
 *           type: number
 *           format: float
 *           description: Current price of the product
 *           example: 199.99
 *         regular_price:
 *           type: number
 *           format: float
 *           description: Original price of the product
 *           example: 249.99
 *         sale_price:
 *           type: number
 *           format: float
 *           description: Sale price of the product
 *           example: 179.99
 *         stock_status:
 *           type: string
 *           description: Availability status
 *           enum: [instock, outofstock]
 *           example: "instock"
 *         stock_quantity:
 *           type: integer
 *           description: Number of items available in stock
 *           example: 50
 *         category:
 *           type: string
 *           description: Product category
 *           example: "Electronics"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags
 *           example: ["wireless", "noise-cancelling", "bluetooth"]
 *         on_sale:
 *           type: boolean
 *           description: Whether the product is on sale
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date when product was created
 *           example: "2023-01-15T10:30:00Z"
 *         average_rating:
 *           type: number
 *           format: float
 *           description: Average customer rating (0-5)
 *           example: 4.5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated update timestamp
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         message:
 *           type: string
 *           example: "Products retrieved successfully"
 *         error:
 *           type: null
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Failed to fetch products"
 *         error:
 *           type: string
 *           example: "Database connection error"
 *     IngestResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Products ingested successfully"
 *         count:
 *           type: integer
 *           example: 50
 *         error:
 *           type: null
 */

/**
 * @swagger
 * /products/ingest:
 *   get:
 *     summary: Ingest products from external source
 *     description: Fetches products from WooCommerce API and stores them in database
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products ingested successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngestResponse'
 *       500:
 *         description: Error during ingestion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productsRouter.get("/ingest", ProductController.ingestProducts);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Get a complete list of all products in the database
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
productsRouter.get("/", ProductController.getProducts);

export default productsRouter;