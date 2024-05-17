import type { RequestHandler } from '@sveltejs/kit';
import type { GetBalanceResponse } from '$lib/types';

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const { userId } = params;
    const balance = 123;

    return new Response(JSON.stringify({ userId, balance }));
};
