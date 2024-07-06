import { type RequestHandler } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    const { sessionId } = params;

    if (!sessionId) return new Response('Missing session id', { status: 400 });

    let user = await prisma.user.findUnique({
        where: {
            sessionId
        }
    });

    if (!user) {
        user = await prisma.user.create({ data: { sessionId } });
    }

    return new Response(JSON.stringify(user));
};

export const PUT: RequestHandler = async ({ request, params }): Promise<Response> => {
    const { sessionId } = params;
    let user = (await request.json()) as Prisma.UserUpdateInput;
    if (!user.sessionId || !sessionId)
        return new Response('Missing sessionasd id', { status: 400 });

    if (user.sessionId == sessionId) {
        user = await prisma.user.update({
            where: {
                sessionId: user.sessionId as string
            },
            data: user
        });
    } else {
        const foundUser = await prisma.user.findUnique({
            where: {
                sessionId: user.sessionId as string
            }
        });

        if (!foundUser) {
            user = await prisma.user.create({
                data: {
                    sessionId: user.sessionId as string
                }
            });
        } else {
            user = foundUser;
        }
    }

    return new Response(JSON.stringify(user));
};
