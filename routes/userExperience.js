import { body, param } from 'express-validator';
import express from 'express';
import { response } from '../common/response.js';
import { list, get, insert, update, remove } from '../controllers/userExperience.js';
import { validate } from '../common/validation.js';

const userExperience = express.Router();

userExperience
  .get('/',
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
          return response(res, { message: "The userExperience does not exist", status: 404, error: `id ${id} not found` })
        }
        return response(res, { status: 500, error: err });
      }
    })

  .post('/',
    body('userId', "invaild userId should be number").exists().withMessage('userId is required').isNumeric(),
    body('jobTitle', "invaild jobTitle").exists().withMessage('jobTitle is required').isString(),
    body('employer', "invaild employer").exists().withMessage('employer is required').isString(),
    body('description', "invaild description").isString().optional(),
    body('startDate', "invaild startDate").exists().withMessage('startDate is required').isDate(),
    body('endDate', "invaild endDate").isDate().optional(),
    body('current', "invaild current").isBoolean().optional(),
    validate,
    async (req, res) => {
      const {
        userId,
        jobTitle,
        employer,
        description,
        startDate,
        endDate,
        current
      } = req.body;

      try {
        const data = await insert(
          Number(userId),
          jobTitle,
          employer,
          description,
          new Date(startDate).toISOString(),
          endDate !== undefined ? new Date(endDate).toISOString() : undefined,
          current !== undefined ? Boolean(current) : undefined
        ) || null;
        response(res, { data, message: "User Experience Created Successfully" })
      } catch (err) {
        if (err === 404) {
          return response(res, { message: "The user does not exist", status: 404, error: `userId ${userId} not found` })
        } 
        return response(res, { status: 500, error: err });
      }
    })

  .patch('/:id',
    param('id', 'Invalid Id').isNumeric(),
    body('jobTitle', "invaild jobTitle").isString().optional(),
    body('employer', "invaild employer").isString().optional(),
    body('description', "invaild description").isString().optional(),
    body('startDate', "invaild startDate").isDate().optional(),
    body('endDate', "invaild endDate").isDate().optional(),
    body('current', "invaild current").isBoolean().optional(),
    validate,
    async (req, res) => {
      const {
        jobTitle,
        employer,
        description,
        startDate,
        endDate,
        current
      } = req.body;
      const { id } = req.params;
      try {
        const data = await update(
          Number(id),
          jobTitle,
          employer,
          description,
          startDate !== undefined ? new Date(startDate).toISOString() : undefined,
          endDate !== undefined ? new Date(endDate).toISOString() : undefined,
          current !== undefined ? Boolean(current) : undefined
        ) || null;
        response(res, { data, message: "User Experience Updated Successfully" })
      } catch (err) {
        if (err === 404) {
          return response(res, { message: "The userExperience does not exist", status: 404, error: `id ${id} not found` })
        } else if (err === 403) {
          return response(res, { message: "userExperience already exist", status: 403, error: `userExperience already exist` })
        }
        console.log(err)
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
        response(res, { data, message: "User Experience Deleted Successfully" })
      } catch (err) {
        if (err === 404) {
          return response(res, { message: "The userExperience does not exist", status: 404, error: `id ${id} not found` })
        }
        return response(res, { status: 500, error: err });
      }
    })

  ;



export default userExperience;