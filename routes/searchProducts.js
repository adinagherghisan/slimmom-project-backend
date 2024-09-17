const express = require('express');
const router = express.Router();
const Product = require('../models/products'); 
const auth = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "5d51694802b2373622ff5530"
 *         categories:
 *           type: string
 *           example: "eggs"
 *         weight:
 *           type: number
 *           example: 100
 *         title:
 *           type: string
 *           example: "Omelet with cheese"
 *         calories:
 *           type: number
 *           example: 342
 *         groupBloodNotAllowed:
 *           type: array
 *           items:
 *             type: boolean
 *           example: [null, true, true, true, true]
 */

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search for products by title 
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         description: The search query for the product title 
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully found products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Products found successfully'
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Query parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Query parameter is required.'
 *       500:
 *         description: An error occurred while searching for products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'An error occurred while searching for products.'
 */


router.get('/search', auth, async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required.' });
        }

        console.log('Search query:', query);  
      
        const products = await Product.find({ title: { $regex: query, $options: 'i' } });

      

        console.log('Products found:', products);  

        return res.status(200).json({
            message: 'Products found successfully',
            products
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ message: 'An error occurred while searching for products.' });
    }
});

module.exports = router;
