import logger from "../../../logger/logger.js";
import { Product } from "../../products/models/Product.js";
import { allowedFields, allowedOperators } from "../../../utils/productutility.js";

/**
 * Controller class for segment evaluation operations.
 */
class SegmentControllerClass {
  /**
   * Evaluates the segment based on dynamic filtering rules provided in the request body.
   *
   * @async
   * @function evaluateSegment
   * @param {import("express").Request} req - The Express request object.
   * @param {import("express").Response} res - The Express response object.
   *
   * @returns {Promise<Object>} Returns a JSON response with matching products or error information.
   *
   * @example
   * // Sample request body
   * {
   *   "rules": [
   *     "price >= 100",
   *     "createdAt < 2023-01-01",
   *     "category = electronics"
   *   ]
   * }
   *
   * // Allowed Fields:
   * // {
   * //   price: "number",
   * //   category: "string",
   * //   stock_status: "string",
   * //   created_at: "date",
   * //   ...
   * // }
   *
   * // Allowed Operators:
   * // ["=", "!=", ">", "<", ">=", "<="]
   *
   * @description
   * Parses the rules array to build a MongoDB-compatible query using supported fields and operators,
   * then queries the `Product` collection using the constructed filter.
   */
  async evaluateSegment(req, res) {
    try {
      const { rules } = req.body;
      if (!rules || !Array.isArray(rules)) {
        return res.status(400).json({
          success: false,
          message: "Rules must be an array",
          error: "Rules must be an array",
        });
      }

      let query = {};

      for (const rule of rules) {
        const [field, operator, rawValue] = rule.split(/\s+/);

        if (!allowedFields.hasOwnProperty(field)) {
          return res.status(400).json({
            success: false,
            message: `Invalid field '${field}' in rule '${rule}'`,
            error: `Invalid field '${field}'`,
          });
        }

        if (!allowedOperators.includes(operator)) {
          return res.status(400).json({
            success: false,
            message: `Invalid operator '${operator}' in rule '${rule}'`,
            error: `Invalid operator '${operator}'`,
          });
        }

        let value;
        const type = allowedFields[field];

        switch (type) {
          case "number":
            value = parseFloat(rawValue);
            if (isNaN(value)) {
              return res.status(400).json({
                success: false,
                message: `Invalid number value '${rawValue}' for field '${field}'`,
                error: "Invalid number",
              });
            }
            break;

          case "date":
            const [day, month, year] = rawValue.split("-");
            value = new Date(`${year}-${month}-${day}T00:00:00`);
            if (isNaN(value.getTime())) {
              return res.status(400).json({
                success: false,
                message: `Invalid date value '${rawValue}' for field '${field}'`,
                error: "Invalid date",
              });
            }
            break;

          case "boolean":
            if (rawValue !== "true" && rawValue !== "false") {
              return res.status(400).json({
                success: false,
                message: `Invalid boolean value '${rawValue}' for field '${field}'`,
                error: "Invalid boolean",
              });
            }
            value = rawValue === "true";
            break;

          case "string":
            value = rawValue;
            break;

          default:
            return res.status(400).json({
              success: false,
              message: `Unsupported field type '${type}'`,
              error: `Field type not supported`,
            });
        }

        // MongoDB query conversion
        switch (operator) {
          case "=":
            query[field] = value;
            break;
          case "!=":
            query[field] = { $ne: value };
            break;
          case ">":
            query[field] = { $gt: value };
            break;
          case "<":
            query[field] = { $lt: value };
            break;
          case ">=":
            query[field] = { $gte: value };
            break;
          case "<=":
            query[field] = { $lte: value };
            break;
        }
      }
      const products = await Product.find(query);
      return res.json({
        data: products,
        message: "Products retrieved successfully",
        error: null,
      });
    } catch (error) {
      logger.error("Error evaluating segment:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to evaluate segment",
        error: error.message,
      });
    }
  }
}

export const SegmentController = new SegmentControllerClass();
