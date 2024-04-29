import { Prisma, PrismaClient } from "@prisma/client";
import { comparePassword, cryptPassword } from "../common/password.js";
import { generateToken } from "../middlewares/authorization.js";
import { exclude } from "../common/common.js";

const prisma = new PrismaClient();
const { PrismaClientKnownRequestError } = Prisma;

export const login = async (email, password) => {
    try {
        const user = await prisma.users.findFirstOrThrow({
            where: { email }
        });
        const compare = await comparePassword(password, user.password);
        if (compare) {
            const accessToken = generateToken(user.id, email, user.type);
            const data = exclude(user, ["password"]);
            return {
                ...data,
                token: accessToken
            }
        } else {
            throw 401;
        }
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in login", err);
        throw err;
    }
}

export const forgotPassword = async (email, password) => {
    try {
        password = await cryptPassword(password);
        const user = await prisma.users.update({
            where: { email },
            data: {
                password
            },
        })
        const data = exclude(user, ["password"]);
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
            if (err.code === 'P2002') {
                throw 403;
            }
        }
        console.log("Error in forgot password", err);
        throw err;
    }
}

export const changePassword = async (email, old_password, password) => {
    try {
        const user = await prisma.users.findFirstOrThrow({
            where: { email }
        });
        const compare = await comparePassword(old_password, user.password);
        if (compare) {
            password = await cryptPassword(password);
            const user = await prisma.users.update({
                where: { email },
                data: {
                    password
                },
            })
            const data = exclude(user, ["password"]);
            return data;
        } else {
            throw 401;
        }
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
            if (err.code === 'P2002') {
                throw 403;
            }
        }
        console.log("Error in forgot password", err);
        throw err;
    }
}