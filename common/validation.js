import { validationResult } from 'express-validator';

import { response } from "./response.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length) return response(res, { status: 400, message: errors[0]['msg'], error: errors[0]['value'] || true });
    next();
}