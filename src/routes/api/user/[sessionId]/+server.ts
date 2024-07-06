import { type RequestHandler } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import type { GetBalanceResponse } from '$lib/types';
import { debugTimeout } from '$lib/utils';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const { sessionId } = params;

    await debugTimeout(2000);

    if (!sessionId) return new Response('Missing session id', { status: 400 });

    let user = await prisma.user.findUnique({
        where: {
            sessionId
        }
    });

    if (!user) {
        user = await prisma.user.create({ data: { sessionId } });
    }

    const response: GetBalanceResponse = {
        userId: user.sessionId,
        balance: user.balance
    };

    return new Response(JSON.stringify(response));
};

export const PUT: RequestHandler = async ({ request }): Promise<Response> => {
    const user = (await request.json()) as Prisma.UserUpdateInput;
    if (!user.sessionId) return new Response('Missing session id', { status: 400 });

    await prisma.user.update({
        where: {
            sessionId: user.sessionId as string
        },
        data: user
    });

    return new Response(JSON.stringify(user));
};
