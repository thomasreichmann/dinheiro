import prisma from '$lib/db';

export async function load({ cookies }) {
    let sessionId = cookies.get('sessionId');

    if (!sessionId) {
        const idThatWillBeGeneratedLaterWhenWeImplementIt = '123';
        cookies.set('sessionId', idThatWillBeGeneratedLaterWhenWeImplementIt, { path: '/' });

        sessionId = idThatWillBeGeneratedLaterWhenWeImplementIt;
    }

    const user = await prisma.user.findUnique({
        where: {
            sessionId
        }
    });

    return { user };
}
