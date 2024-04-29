import { body, param } from 'express-validator';
import express from 'express';
import { response } from '../common/response.js';
import { list, get, insert, update, remove } from '../controllers/user.js';
import { validate } from '../common/validation.js';
import { adminGuard, checkAuth } from '../middlewares/authorization.js';

const user = express.Router();
const USER_ROLE = [
  "user",
  "admin",
]
const GENDER = [
  "male",
  "female",
  "other"
]

user
  .get('/',
    checkAuth,
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
    checkAuth,
    param('id', 'Invalid Id').isNumeric(),
    validate,
    async (req, res) => {
      const { id } = req.params;

      try {
        const data = await get(Number(id)) || null;
        response(res, { data });
      } catch (err) {
        if (err === 404) {
          return response(res, { message: "The user does not exist", status: 404, error: `id ${id} not found` })
        }
        return response(res, { status: 500, error: err });
      }
    })

  .post('/',
    body('email', "invaild email").exists().withMessage('email is required').isEmail(),
    body('password', 'password must contain atleast 6 character').exists().withMessage('password is required').isString().withMessage('Invalid password').isLength({ min: 6 }),
    body('type', 'invalid type').exists().withMessage('type is required').isIn(USER_ROLE),
    body('firstName', 'invalid firstName').exists().withMessage('firstName is required').isString(),
    body('lastName', 'invalid lastName').exists().withMessage('lastName is required').isString(),
    body('phone', 'invalid phone').exists().withMessage('phone is required').isMobilePhone(),
    body('address', 'invalid address').isString().optional(),
    body('pinCode', 'invalid pinCode').isAlphanumeric("en-US", { ignore: " -" }).optional(),
    body('bio', 'invalid bio').isString().optional(),
    body('skills', 'invalid skills').isArray().optional(),
    body('languages', 'invalid languages').isArray().optional(),
    body('gender', 'invalid gender').exists().withMessage('gender is required').isIn(GENDER),
    body('facebook', 'invalid facebook').isURL().optional(),
    body('twitter', 'invalid twitter').isURL().optional(),
    body('linkedin', 'invalid linkedin').isURL().optional(),
    body('youtube', 'invalid youtube').isURL().optional(),
    validate,
    async (req, res) => {
      const {
        email,
        password,
        type,
        firstName,
        lastName,
        phone,
        address,
        pinCode,
        bio,
        skills,
        languages,
        gender,
        facebook,
        twitter,
        linkedin,
        youtube
      } = req.body;

      try {
        const image = req.files.image;
        const data = await insert(
          email,
          password,
          type,
          firstName,
          lastName,
          phone,
          address,
          pinCode,
          bio,
          skills,
          languages,
          gender,
          image,
          facebook,
          twitter,
          linkedin,
          youtube
        ) || null;
        response(res, { data, message: "User Created Successfully" })
      } catch (err) {
        if (err === 403) {
          return response(res, { message: "email id or phone no. already exist", status: 403, error: `email or phone already exist` })
        }
        return response(res, { status: 500, error: err });
      }
    })

  .patch('/:id',
    checkAuth,
    param('id', 'Invalid Id').isNumeric(),
    body('email', "invaild email").isEmail().optional(),
    body('type', 'invalid type').isIn(USER_ROLE).optional(),
    body('firstName', 'invalid firstName').isString().optional(),
    body('lastName', 'invalid lastName').isString().optional(),
    body('phone', 'invalid phone').isMobilePhone().optional(),
    body('address', 'invalid address').isString().optional(),
    body('pinCode', 'invalid pinCode').isAlphanumeric("en-US", { ignore: " -" }).optional(),
    body('bio', 'invalid bio').isString().optional(),
    body('skills', 'invalid skills').isArray().optional(),
    body('languages', 'invalid languages').isArray().optional(),
    body('gender', 'invalid gender').isIn(GENDER).optional(),
    body('facebook', 'invalid facebook').isURL().optional(),
    body('twitter', 'invalid twitter').isURL().optional(),
    body('linkedin', 'invalid linkedin').isURL().optional(),
    body('youtube', 'invalid youtube').isURL().optional(),
    validate,
    async (req, res) => {
      const {
        email,
        password,
        type,
        firstName,
        lastName,
        phone,
        address,
        pinCode,
        bio,
        skills,
        languages,
        gender,
        facebook,
        twitter,
        linkedin,
        youtube
      } = req.body;
      const { id } = req.params;

      try {
        const image = req.files?.image;
        const data = await update(
          Number(id),
          email,
          password,
          type,
          firstName,
          lastName,
          phone,
          address,
          pinCode,
          bio,
          skills,
          languages,
          gender,
          image,
          facebook,
          twitter,
          linkedin,
          youtube
        ) || null;
        response(res, { data, message: "User Updated Successfully" })
      } catch (err) {
        if (err === 404) {
          return response(res, { message: "The user does not exist", status: 404, error: `id ${id} not found` })
        } else if (err === 403) {
          return response(res, { message: "email already exist", status: 403, error: `email already exist` })
        }
        return response(res, { status: 500, error: err });
      }
    })

  .delete('/:id',
    checkAuth,
    param('id', 'Invalid Id').isNumeric(),
    validate,
    async (req, res) => {
      const { id } = req.params;

      try {
        const data = await remove(Number(id)) || null;
        response(res, { data, message: "User Deleted Successfully" })
      } catch (err) {
        if (err === 404) {
          return response(res, { message: "The user does not exist", status: 404, error: `id ${id} not found` })
        }
        return response(res, { status: 500, error: err });
      }
    })

  ;



export default user;