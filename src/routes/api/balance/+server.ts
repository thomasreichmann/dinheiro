import type { RequestHandler } from '@sveltejs/kit';
import type { UpdateBalanceRequest } from '$lib/types';
import prisma from '$lib/db';

export const PUT: RequestHandler = async ({ request }) => {
    const body = (await request.json()) as UpdateBalanceRequest;

    // const user = await prisma.user.findUnique({
    //     where: {
    //         sessionId: body.userId
    //     }
    // });

    let a = await prisma.user.update({
        where: {
            sessionId: body.userId
        },
        data: {
            balance: body.balance
        }
    });

    return new Response(JSON.stringify(body));
};
