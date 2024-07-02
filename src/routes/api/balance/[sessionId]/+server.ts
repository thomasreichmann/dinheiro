import { error, type RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { GetBalanceResponse } from '$lib/types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const { sessionId } = params;

    const user = await prisma.user.findUnique({
        where: {
            sessionId
        }
    });

    if (!user) return error(404, { message: 'NOT FOUND' });

    const response: GetBalanceResponse = {
        userId: user.sessionId,
        balance: user.balance
    };

    return new Response(JSON.stringify(response));
};
