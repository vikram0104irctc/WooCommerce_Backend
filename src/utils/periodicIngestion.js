import axios from "axios";
import { wooCommerceConfig } from "../../config/woocommerce.js";
import { Product } from "../services/products/models/Product.js";
import logger from "../logger/logger.js";

class PeriodicIngestionClass {
  /**
   * Ingests products from WooCommerce API and stores them in the database.
   */
  async periodicIngestionProducts() {
    try {
      const response = await axios.get(
        `${wooCommerceConfig.baseUrl}/wp-json/wc/v3/products`,
        {
          params: {
            consumer_key: wooCommerceConfig.consumerKey,
            consumer_secret: wooCommerceConfig.consumerSecret,
          },
        }
      );

      const products = response.data.map((product) => ({
        id: product.id,
        title: product.name,
        price: product.price,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        stock_status: product.stock_status,
        stock_quantity: product.stock_quantity,
        category: product.categories?.[0]?.name,
        tags: product.tags?.map((tag) => tag.name),
        on_sale: product.on_sale,
        created_at: new Date(product.date_created),
        average_rating: product.average_rating,
      }));

      // Upsert products
      await Promise.all(
        products.map((product) =>
          Product.findOneAndUpdate({ id: product.id }, product, {
            upsert: true,
            new: true,
          })
        )
      );

      return products;
    } catch (error) {
      logger.error("Error ingesting products:", error);
      throw new Error(error);
    }
  }
}

export const PeriodicIngestion = new PeriodicIngestionClass();
