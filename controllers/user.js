import { PrismaClient, Prisma } from "@prisma/client";
import { cryptPassword } from "../common/password.js";
import { exclude, USER_IMAGE_FOLDER, USER_IMAGE_LOCATION } from '../common/common.js';

const prisma = new PrismaClient();
const { PrismaClientKnownRequestError } = Prisma

export const list = async () => {
    try {
        const users = await prisma.users.findMany();
        const data = exclude(users, ["password"]);
        return data;
    } catch (err) {
        console.log("Error in list user", err);
        throw err;
    }
}

export const get = async (id) => {
    try {
        const user = await prisma.users.findFirstOrThrow({
            where: { id }
        });
        const data = exclude(user, ["password"]);
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in get user", err);
        throw err;
    }
}

export const insert = async (
    email,
    password,
    type,
    firstName,
    lastName,
    phone,
    address,
    piNode,
    bio,
    skills,
    languages,
    gender,
    image,
    facebook,
    twitter,
    linkedin,
    youtube
) => {
    password = await cryptPassword(password);
    try {
        if (image) {
            image.mv(USER_IMAGE_LOCATION + image.name);
            image = USER_IMAGE_FOLDER + image.name;
        }
        const user = await prisma.users.create({
            data: {
                email,
                password,
                type,
                firstName,
                lastName,
                phone,
                address,
                piNode,
                bio,
                skills,
                languages,
                gender,
                image,
                facebook,
                twitter,
                linkedin,
                youtube
            }
        });
        const data = exclude(user, ["password"]);
        return data;
    } catch (err) {
        console.log("Error in insert user", err);
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw 403;
            }
        }
        throw err;
    }
}

export const update = async (
    id,
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
) => {
    try {
        if (image) {
            let imageLocation = USER_IMAGE_LOCATION + image.name;
            image.mv(imageLocation);
            image = USER_IMAGE_FOLDER + image.name;
        }
        const user = await prisma.users.update({
            where: { id },
            data: {
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
        console.log("Error in update user", err);
        throw err;
    }
}

export const remove = async (id) => {
    try {
        const user = await prisma.users.delete({
            where: { id }
        });
        const data = exclude(user, ["password"]);
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in remove user", err);
        throw err;
    }
}

export default {
    list,
    get,
    insert,
    update,
    remove
}