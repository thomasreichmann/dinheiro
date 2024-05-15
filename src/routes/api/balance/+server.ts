import type { RequestHandler } from '@sveltejs/kit';
import type { UpdateBalanceRequest } from '$lib/types';

export const PUT: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as UpdateBalanceRequest;

	return new Response(JSON.stringify(body));
};
