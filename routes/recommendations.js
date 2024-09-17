const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const Calculator = require('../models/calculator');
const color = require('colors');
const auth = require('../middlewares/auth');


function getBloodTypeIndex(bloodType) {
    const bloodTypes = ['0(I)', 'A(II)', 'B(III)', 'AB(IV)'];
    return bloodTypes.indexOf(bloodType);
};

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
 *           example: "flour"
 *         weight:
 *           type: number
 *           example: 100
 *         title:
 *           type: string
 *           example: "Bread sticks Manifesto with rye taste"
 *         calories:
 *           type: number
 *           example: 404
 *         groupBloodNotAllowed:
 *           type: array
 *           items:
 *             type: boolean
 *           example: [null, true, true, true, true]

 *     CalculatorData:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           example: "60c72b2f9b1e8d001f64760b"
 *         height:
 *           type: number
 *           example: 175
 *         age:
 *           type: number
 *           example: 30
 *         current_weight:
 *           type: number
 *           example: 70
 *         desired_weight:
 *           type: number
 *           example: 65
 *         blood_type:
 *           type: string
 *           enum: ['0(I)', 'A(II)', 'B(III)', 'AB(IV)']
 *           example: 'A(II)'

 *     Calculator:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "60c72b2f9b1e8d001f64760b"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CalculatorData'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2021-09-01T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2021-09-01T12:34:56Z"
 */

/**
 * @swagger
 * /api/products/public-recommendations:
 *   post:
 *     summary: Get public food recommendations based on user inputs
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalculatorData'
 *     responses:
 *       200:
 *         description: Successfully fetched food recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dailyCalories:
 *                   type: number
 *                   example: 2800
 *                 forbiddenProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 length:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Internal server error
 */


router.post('/public-recommendations', async (req, res, next) => {
    try {
        const { height, age, current_weight, desired_weight, blood_type } = req.body;

        if (!height || !age || !current_weight || !desired_weight || !blood_type) {
            return res.status(400).json({ message: "All fields are required!".red });
        }

        const bloodTypeIndex = getBloodTypeIndex(blood_type);
        if (bloodTypeIndex === -1) {
            return res.status(400).json({ message: "Invalid blood type!".red });
        }

        const products = await Product.find({});

       
        let forbiddenProducts = products.filter(product => product.groupBloodNotAllowed[bloodTypeIndex] === true);
        forbiddenProducts = forbiddenProducts.slice(0, 4);
        forbiddenProducts.sort((a, b) => a.title.localeCompare(b.title));

        const length = forbiddenProducts.length
        
        const dailyCalories = 2800;

        return res.status(200).json({
            dailyCalories,
            forbiddenProducts,
            length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching recommendations.".red });
    }
});

/**
 * @swagger
 * /api/products/private-recommendations:
 *    post:
 *     summary: Get private food recommendations based on user inputs and authentication
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalculatorData'
 *     responses:
 *       '200':
 *         description: Successfully fetched private food recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dailyCalories:
 *                   type: number
 *                   example: 2800
 *                 forbiddenProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 length:
 *                   type: number
 *                   example: 1
 *       '400':
 *         description: Missing or invalid parameters
 *       '401':
 *         description: Unauthorized, invalid token
 *       '500':
 *         description: Internal server error
 */

router.post('/private-recommendations', auth, async (req, res) => {
    try {
        const { height, age, current_weight, desired_weight, blood_type } = req.body;
        const userId = req.user._id;

        if (!height || !age || !current_weight || !desired_weight || !blood_type) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const bloodTypeIndex = getBloodTypeIndex(blood_type);
        if (bloodTypeIndex === -1) {
            return res.status(400).json({ message: "Invalid blood type!" });
        }

       
        const existingData = await Calculator.findOne({ userId });

        if (existingData) {
           
            existingData.data = [{
                height,
                age,
                current_weight,
                desired_weight,
                blood_type
            }];
            await existingData.save();
        } else {
          
            const newCalculatorData = new Calculator({
                userId,
                data: [{
                    height,
                    age,
                    current_weight,
                    desired_weight,
                    blood_type
                }]
            });
            await newCalculatorData.save();
        }

        const products = await Product.find({});
        let forbiddenProducts = products.filter(product => product.groupBloodNotAllowed[bloodTypeIndex] === true);
        forbiddenProducts = forbiddenProducts.slice(0, 4);
        forbiddenProducts.sort((a, b) => a.title.localeCompare(b.title));

        const length = forbiddenProducts.length
        const dailyCalories = 2800; 

        return res.status(200).json({
            dailyCalories,
            forbiddenProducts,
            length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while processing your request." });
    }
});


module.exports = router;
