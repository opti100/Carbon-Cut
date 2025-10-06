"use server";

import { prisma } from "@/utils/prisma";

export async function performOffsetCheck(email:string) {
    try{
        const user = await prisma.user.findUnique({
            where: { email, market: { in: ["COMPLIANCE", "VOLUNTARY"] } },
        });
        return user !== null;
    } catch (error) {
        console.error("Error checking offset:", error);
        return false;
    }
}