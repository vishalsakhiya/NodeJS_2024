import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { PrismaClientKnownRequestError } = Prisma

export const list = async () => {
    try {
        const data = await prisma.userExperience.findMany();
        return data;
    } catch (err) {
        console.log("Error in list userExperience", err);
        throw err;
    }
}

export const get = async (id) => {
    try {
        const data = await prisma.userExperience.findFirstOrThrow({
            where: { id }
        });
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in get userExperience", err);
        throw err;
    }
}

export const insert = async (
    userId,
    jobTitle,
    employer,
    description,
    startDate,
    endDate,
    current
) => {
    try {
        const data = await prisma.userExperience.create({
            data: {
                userId,
                jobTitle,
                employer,
                description,
                startDate,
                endDate,
                current
            }
        });
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2003') {
                throw 404;
            }
        }
        console.log("Error in insert userExperience", err);
        throw err;
    }
}

export const update = async (
    id,
    jobTitle,
    employer,
    description,
    startDate,
    endDate,
    current
) => {
    try {
        console.log({
            jobTitle,
            employer,
            description,
            startDate,
            endDate,
            current
        })
        const data = await prisma.userExperience.update({
            where: { id },
            data: {
                jobTitle,
                employer,
                description,
                startDate,
                endDate,
                current
            },
        })
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2003') {
                throw 404;
            }
        }
        console.log("Error in update userExperience", err);
        throw err;
    }
}

export const remove = async (id) => {
    try {
        const data = await prisma.userExperience.delete({
            where: { id }
        });
        return data;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw 404;
            }
        }
        console.log("Error in remove userExperience", err);
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