import { Product } from "../models/Product.js";
import logger from "../../../logger/logger.js";
import { PeriodicIngestion } from "../../../utils/periodicIngestion.js";

/**
 * Controller for handling product-related operations including ingestion from WooCommerce and retrieval from the database.
 */

class ProductControllerClass {
  /**
   * Ingests products from WooCommerce API and stores them in the database.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with operation status
   */
  async ingestProducts(req, res) {
    try {
      const products = await PeriodicIngestion.periodicIngestionProducts();

      return res.json({
        success: true,
        message: `${products.length} products ingested successfully`,
        error: null,
      });
    } catch (error) {
      logger.error("Error ingesting products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to ingest products",
        error: error.message,
      });
    }
  }

  /**
   * Retrieves products from database with pagination and filtering support
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with products and pagination info
   */
  async getProducts(req, res) {
    try {
      const products = await Product.find({});
      return res.json({
        success: true,
        data: products,
        message: "Products retrieved successfully",
        error: null,
      });
    } catch (error) {
      logger.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  }
}

export const ProductController = new ProductControllerClass();
