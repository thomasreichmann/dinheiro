import { type RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { GetBalanceResponse } from '$lib/types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const { sessionId } = params;

    if (!sessionId) return new Response('Missing session id', { status: 400 });

    const user = await prisma.user.findUnique({
        where: {
            sessionId
        }
    });

    if (!user) return new Response(`user not found`, { status: 400 });

    const response: GetBalanceResponse = {
        userId: user.sessionId,
        balance: user.balance
    };

    return new Response(JSON.stringify(response));
};
