import { body, param } from 'express-validator';
import express from 'express';
import { response } from '../common/response.js';
import { list, get, insert, update, remove } from '../controllers/userEducation.js';
import { validate } from '../common/validation.js';
import { adminGuard } from '../middlewares/authorization.js';

const userEducation = express.Router();

userEducation
    .get('/',
        adminGuard,
        async (req, res) => {
            try {
                const data = await list() || null;
                return response(res, { data });
            } catch (err) {
                return response(res, { status: 500, error: err });
            }
        })

    .get('/:id',
        param('id', 'Invalid Id').isNumeric(),
        validate,
        async (req, res) => {
            const { id } = req.params;

            try {
                const data = await get(Number(id)) || null;
                response(res, { data });
            } catch (err) {
                if (err === 404) {
                    return response(res, { message: "The userEducation does not exist", status: 404, error: `id ${id} not found` })
                }
                return response(res, { status: 500, error: err });
            }
        })

    .post('/',
        body('userId', "invaild userId should be number").exists().withMessage('userId is required').isNumeric(),
        body('degree', "invaild degree").exists().withMessage("degree is required").isString(),
        body('institute', "invaild institute").exists().withMessage("institute is required").isString(),
        body('startDate', "invaild startDate").exists().withMessage("startDate is required").toDate(),
        body('endDate', "invaild endDate").exists().withMessage("endDate is required").toDate(),
        body('details', "invaild details").isString().optional(),
        body('current', "invaild current").isBoolean().optional(),
        validate,
        async (req, res) => {
            const {
                userId,
                degree,
                institute,
                startDate,
                endDate,
                details,
                current
            } = req.body;

            try {
                const image = req.files?.image;

                const data = await insert(
                    Number(userId),
                    degree,
                    institute,
                    startDate,
                    endDate,
                    details,
                    current ? Boolean(current) : undefined,
                    image
                ) || null;
                response(res, { data, message: "userEducation Created Successfully" })
            } catch (err) {
                if (err === 404) {
                    return response(res, { message: "The user does not exist", status: 404, error: `userId ${userId} not found` })
                }
                return response(res, { status: 500, error: err });
            }
        })

    .patch('/:id',
        param('id', 'Invalid Id').isNumeric(),
        body('userId', "invaild userId should be number").isNumeric().optional(),
        body('degree', "invaild degree").isString().optional(),
        body('institute', "invaild institute").isString().optional(),
        body('startDate', "invaild startDate").toDate().optional(),
        body('endDate', "invaild endDate").toDate().optional(),
        body('details', "invaild details").isString().optional(),
        body('current', "invaild current").isBoolean().optional(),
        validate,
        async (req, res) => {
            const {
                userId,
                degree,
                institute,
                startDate,
                endDate,
                details,
                current
            } = req.body;
            const { id } = req.params;

            try {
                const image = req.files?.image;

                const data = await update(
                    Number(id),
                    userId ? Number(userId) : undefined,
                    degree,
                    institute,
                    startDate,
                    endDate,
                    details,
                    current ? Boolean(current) : undefined,
                    image
                ) || null;
                response(res, { data, message: "userEducation Updated Successfully" })
            } catch (err) {
                if (err === 404) {
                    return response(res, { message: "The userEducation does not exist", status: 404, error: `id ${id} not found` })
                } else if (err === 403) {
                    return response(res, { message: "userEducation already exist", status: 403, error: `userEducation already exist` })
                }
                return response(res, { status: 500, error: err });
            }
        })

    .delete('/:id',
        param('id', 'Invalid Id').isNumeric(),
        validate,
        async (req, res) => {
            const { id } = req.params;

            try {
                const data = await remove(Number(id)) || null;
                response(res, { data, message: "userEducation Deleted Successfully" })
            } catch (err) {
                if (err === 404) {
                    return response(res, { message: "The userEducation does not exist", status: 404, error: `id ${id} not found` })
                }
                return response(res, { status: 500, error: err });
            }
        })

    ;



export default userEducation;