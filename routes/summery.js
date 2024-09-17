const express = require('express');
const router = express.Router();
const Diary = require('../models/diary');
const Summary = require('../models/summery');
const auth = require('../middlewares/auth');  
const { startOfDay, endOfDay } = require('date-fns');

/**
 * @swagger
 * components:
 *   schemas:
 *     Summary:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "60c72b2f9b1e8d001f64760b"
 *         summaryInfo:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               diaryId:
 *                 type: string
 *                 example: "60d5f54f8d5c41001c8e6b0a"
 *               daily_left:
 *                 type: number
 *                 example: 1500
 *               daily_consumed:
 *                 type: number
 *                 example: 1300
 *               daily_rate:
 *                 type: number
 *                 example: 2800
 *               percentage:
 *                 type: number
 *                 example: 46.43
 *     SummaryResponse:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-09-12"
 *         daily_left:
 *           type: number
 *           example: 1500
 *         daily_consumed:
 *           type: number
 *           example: 1300
 *         daily_rate:
 *           type: number
 *           example: 2800
 *         percentage:
 *           type: number
 *           example: 46.43
 */

/**
 * @swagger
 * /api/summary/{date}:
 *   get:
 *     summary: Get the daily summary for a specific date
 *     tags: [Summary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date
 *         in: path
 *         required: true
 *         description: Date for which to retrieve the summary
 *         schema:
 *           type: string
 *           example: "2024-09-12"
 *     responses:
 *       200:
 *         description: Successfully retrieved the daily summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SummaryResponse'
 *       404:
 *         description: No diary entry found for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No diary entry found for this date."
 *       500:
 *         description: Error calculating the summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error calculating summary"
 */

router.get('/summary/:date', auth, async (req, res, next) => {
    try {
        const { date } = req.params;
        const userId = req.user._id;

        

        const startDate = startOfDay(new Date(date));
        const endDate = endOfDay(new Date(date));

        console.log("Start date:", startDate);
        console.log("End date:", endDate);

       

        const diaryEntry = await Diary.findOne({
            userId,
            'entries.date': {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('entries.productId');

        console.log(diaryEntry);

        if (!diaryEntry) {
            return res.status(404).json({ message: "No diary entry found for this date." });
        }
    
       

        const totalConsumed = diaryEntry.entries.reduce((accumulator, product) => accumulator + product.product_Calories, 0);
        const dailyRate = 2800;
        const dailyLeft = dailyRate - totalConsumed;
        const dailyPercentage = ((totalConsumed / dailyRate) * 100).toFixed(2);

      

        let summary = await Summary.findOne({ userId }).populate('summaryInfo.diaryId');

        if (!summary) {
            summary = new Summary({ userId, summaryInfo: [] });
        };

        
        
        const existingSummaryIndex = summary.summaryInfo.findIndex(index => index.diaryId.entries.some(entry =>
            new Date(entry.date).toDateString() === new Date(date).toDateString()
        )
        );

        if (existingSummaryIndex > -1) {
            summary.summaryInfo[existingSummaryIndex] = {
                diaryId: diaryEntry._id,
                daily_left: dailyLeft,
                daily_consumed: totalConsumed,
                daily_rate: dailyRate,
                percentage: dailyPercentage
            };
        } else {
            summary.summaryInfo.push({
                diaryId: diaryEntry._id,
                daily_left: dailyLeft,
                daily_consumed: totalConsumed,
                daily_rate: dailyRate,
                percentage: dailyPercentage
            });
        }

        await summary.save();

        return res.status(200).json({
            date,
            daily_left: dailyLeft,
            daily_consumed: totalConsumed,
            daily_rate: dailyRate,
            percentage: dailyPercentage
        });
    } catch (error) {
        console.error("Error calculating summary:", error);
        return res.status(500).json({ message: "Error calculating summary!" });
    }
});

module.exports = router;