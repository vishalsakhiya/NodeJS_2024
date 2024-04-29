import Jwt from "jsonwebtoken";

import { response } from "../common/response.js";

const unauthorize = (res, type = "user") => {
    let message = "Failed to verify authenticate";
    if (type === "admin") {
        message = "Failed to verify admin authenticate";
    }
    return response(res, {
        message,
        error: "Authentication Failure",
        status: 403,
    });
};


export const checkAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return unauthorize(res);

    let [authType, token] = authorization.trim().split(' ');
    if (authType !== 'Bearer') return unauthorize(res);

    if (!token)
        return unauthorize(res);

    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return unauthorize(res);
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            type: decoded.type
        };
        next();
    })
}

export const adminGuard = (req, res, next) => {
    const { type } = req.user;
    if (type === "admin") {
        next();
    } else {
        unauthorize(res, "admin");
    }
}

export const generateToken = (id, email, type) => {
    return Jwt.sign({ id, email, type }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });
}