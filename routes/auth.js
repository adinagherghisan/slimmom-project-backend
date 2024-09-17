const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validateLogIn, validateSingIn } =  require('../middlewares/users_validation')
const auth = require("../middlewares/auth");
require('dotenv').config();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *         token:
 *           type: string
 *           description: JWT token for authentication
 *       example:
 *         name: Popescu Andrei
 *         email: popescuandrei@example.com
 *         password: 123456
 *         token: null
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 */

router.post('/register', validateSingIn, async (req, res, next) => {
    try {

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered!" });
        };

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        await newUser.save();

        res.status(201).json({
            user: {
                name: newUser.name,
                email: newUser.email,
            }
        });        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: popescuandrei@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: JWT_TOKEN_HERE
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Popescu Andrei
 *                     email:
 *                       type: string
 *                       example: popescuandrei@example.com
 *       401:
 *         description: Email or password is wrong
 *       500:
 *         description: Internal server error
 */

router.post('/login', validateLogIn, async (req, res, next) => {
    try {
        const { email, password} = req.body;

        const user = await User.findOne({ email });
         if (!user) {
            console.error("User not found with email:", email);
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
            console.error("Invalid password for user:", password);
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

        const payload = { id: user._id };
        console.log("Payload for JWT:", payload);

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '3h' });
        user.token = token;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /api/auth/current:
 *   get:
 *     summary: Get the currently authenticated user's data
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Popescu Andrei
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get('/current', auth, async (req, res) => {
    const { name } = req.user;
    res.json({
        user: {
            name,
        }
    });
});

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logs out the current user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Internal Server Error
 */

router.get('/logout',auth, async (req, res) => {
    try {
       
        const user = req.user;
       
        user.token = null;
      
        await user.save();
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;

