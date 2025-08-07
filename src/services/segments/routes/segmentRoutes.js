import express from 'express';
import { SegmentController } from '../controllers/segmentController.js';

const segmentsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Product segmentation endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SegmentRule:
 *       type: object
 *       properties:
 *         rule:
 *           type: string
 *           description: A single rule in format "field operator value"
 *           example: "price > 500"
 *     SegmentEvaluationRequest:
 *       type: object
 *       required:
 *         - rules
 *       properties:
 *         rules:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of rules to evaluate
 *           example: ["price > 500", "category = Electronics"]
 *     SegmentEvaluationSuccess:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         message:
 *           type: string
 *           example: "Products retrieved successfully"
 *         error:
 *           type: null
 *     SegmentEvaluationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Invalid operator '~' in rule 'price ~ 500'"
 *         error:
 *           type: string
 *           example: "Invalid operator"
 *   parameters:
 *     RuleExampleParam:
 *       in: query
 *       name: example
 *       schema:
 *         type: string
 *         enum: [price, category, stock, date, sale]
 *       description: Type of example rule to show
 *       required: false
 */

/**
 * @swagger
 * /segments/evaluate:
 *   post:
 *     summary: Evaluate product segment rules
 *     description: |
 *       Evaluate a set of rules to filter products.
 *       Supported operators: =, !=, >, <, >=, <=
 *       Supported fields:
 *       - price (number)
 *       - category (string)
 *       - stock_status (string)
 *       - stock_quantity (number)
 *       - created_at (date in DD-MM-YYYY format)
 *       - on_sale (boolean)
 *     tags: [Segments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SegmentEvaluationRequest'
 *           examples:
 *             basic:
 *               summary: Basic example
 *               value:
 *                 rules: ["price > 500", "category = Electronics"]
 *             dateExample:
 *               summary: Date filter example
 *               value:
 *                 rules: ["created_at >= 01-01-2023"]
 *             combined:
 *               summary: Combined filters
 *               value:
 *                 rules: ["price < 1000", "stock_status = instock", "on_sale = true"]
 *     responses:
 *       200:
 *         description: Successful evaluation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SegmentEvaluationSuccess'
 *       400:
 *         description: Invalid rule format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SegmentEvaluationError'
 *             examples:
 *               invalidField:
 *                 value:
 *                   success: false
 *                   message: "Invalid field 'color' in rule 'color = red'"
 *                   error: "Invalid field"
 *               invalidOperator:
 *                 value:
 *                   success: false
 *                   message: "Invalid operator '~' in rule 'price ~ 500'"
 *                   error: "Invalid operator"
 *               invalidValue:
 *                 value:
 *                   success: false
 *                   message: "Invalid date value '32-13-2023' for field 'created_at'"
 *                   error: "Invalid date"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SegmentEvaluationError'
 *             example:
 *               success: false
 *               message: "Failed to evaluate segment"
 *               error: "Database connection error"
 */
segmentsRouter.post('/evaluate', SegmentController.evaluateSegment);

export default segmentsRouter;