import { Prisma, PrismaClient } from "@prisma/client";
import { EDUCATION_IMAGE_FOLDER, EDUCATION_IMAGE_LOCATION } from "../common/common.js";

const prisma = new PrismaClient();
const { PrismaClientKnownRequestError } = Prisma

export const list = async () => {
    try {
        const data = await prisma.userEducation.findMany();
        return data;
    } catch (err) {
        console.log("Error in list userEducation", err);
        throw err;
    }
}

export const get = async (id) => {
    try {
        const data = await prisma.userEducation.findFirstOrThrow({
            where: { id }
        });
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in get userEducation", err);
        throw err;
    }
}

export const insert = async (
    userId,
    degree,
    institute,
    startDate,
    endDate,
    details,
    current,
    image
) => {
    try {
        if (image) {
            image.mv(EDUCATION_IMAGE_LOCATION + new Date().getTime() + "_" + image.name);
            image = EDUCATION_IMAGE_FOLDER + new Date().getTime() + "_" + image.name;
        }
        const data = await prisma.userEducation.create({
            data: {
                userId,
                degree,
                institute,
                startDate,
                endDate,
                details,
                current,
                image
            }
        });
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2003') {
                throw 404;
            }
        }
        console.log("Error in insert userEducation", err);
        throw err;
    }
}

export const update = async (
    id,
    userId,
    degree,
    institute,
    startDate,
    endDate,
    details,
    current,
    image
) => {
    try {
        if (image) {
            image.mv(EDUCATION_IMAGE_LOCATION + new Date().getTime() + "_" + image.name);
            image = EDUCATION_IMAGE_FOLDER + new Date().getTime() + "_" + image.name;
        }
        const data = await prisma.userEducation.update({
            where: { id },
            data: {
                userId,
                degree,
                institute,
                startDate,
                endDate,
                details,
                current,
                image
            },
        })
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in update userEducation", err);
        throw err;
    }
}

export const remove = async (id) => {
    try {
        const data = await prisma.userEducation.delete({
            where: { id }
        });
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in remove userEducation", err);
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