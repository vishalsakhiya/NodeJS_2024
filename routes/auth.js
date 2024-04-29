import { body } from 'express-validator';
import express from 'express';
import { response } from '../common/response.js';
import { changePassword, forgotPassword, login } from '../controllers/auth.js';
import { adminGuard, checkAuth } from '../middlewares/authorization.js';
import { validate } from '../common/validation.js';

const auth = express.Router();

auth
  .post('/login',
    body('email', 'eamil is invalid').exists().withMessage('email is required').isEmail(),
    body('password', 'password must contain atleast 6 character').exists().withMessage('password is required').isString().withMessage('Invalid password').isLength({ min: 6 }),
    validate,
    async (req, res) => {
      const {
        email,
        password
      } = req.body;

      try {
        let data = null;

        data = await login(email, password);
        return response(res, { data });
      } catch (err) {
        if (err === 404) {
          return response(res, { message: "The user does not exist", status: 404, error: `user ${email} not found` })
        } else if (err === 401) {
          return response(res, { message: "password or email is incorrect", status: 401, error: `authentication failure` })
        }
        return response(res, { status: 500, error: err });
      }
    })

  .post('/forgot-password',
    checkAuth,
    adminGuard,
    body('email', 'eamil is invalid').exists().withMessage('email is required').isEmail(),
    body('new_password', 'password must contain atleast 6 character').exists().withMessage('new_password is required').isString().withMessage('Invalid password').isLength({ min: 6 }),
    validate,
    async (req, res) => {
      const {
        email,
        new_password
      } = req.body;

      try {
        let data = null;
        data = await forgotPassword(email, new_password);
        return response(res, { data, message: "password changed successfully" });
      } catch (err) {
        return response(res, { status: 500, error: err });
      }
    })

  .post('/change-password',
    checkAuth,
    body('old_password', 'password must contain atleast 6 character').exists().withMessage('old_password is required').isString().withMessage('Invalid password').isLength({ min: 6 }),
    body('new_password', 'password must contain atleast 6 character').exists().withMessage('new_password is required').isString().withMessage('Invalid password').isLength({ min: 6 }),
    validate,
    async (req, res) => {
      const {
        old_password,
        new_password
      } = req.body;

      const {
        email
      } = req.user;

      try {
        let data = null;
        data = await changePassword(email, old_password, new_password);
        return response(res, { data, message: "password changed successfully" });
      } catch (err) {
        return response(res, { status: 500, error: err });
      }
    })
  ;


export default auth;