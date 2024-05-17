import type { RequestHandler } from '@sveltejs/kit';
import type { UpdateBalanceRequest } from '$lib/types';

export const PUT: RequestHandler = async ({ request }) => {
    const body = (await request.json()) as UpdateBalanceRequest;

    body.balance -= 100;
    console.log(body);

    return new Response(JSON.stringify(body));
};
