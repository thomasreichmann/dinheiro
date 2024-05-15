import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { userId } = params;

	return new Response(JSON.stringify({ userId }));
};
