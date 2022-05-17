import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import connectToDatabase from '../../../lib/connectToDatabase';

type Data = {
	balance: number;
};

interface User {
	_id: string;
	name: string;
	email: string;
	image: string;
	emailVerified: boolean;
	balance: number;
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
	// TODO: update this to send entire user back & use shared interfaces between front & back
	let session = await getSession({ req });

	if (!session) return res.status(401);

	const db = await connectToDatabase();
	let users = db.collection('users');

	if (!session.user) return res.status(400);

	// Find user data using session email and return it
	let user = await users.findOne<User>({ email: session.user.email });

	if (!user) return res.status(404);

	if (!user.balance) {
		// set default user balance and send response
		users.updateOne({ email: user.email }, { $set: { balance: 0 } });
		return res.status(200).json({ balance: user.balance });
	} else {
		return res.status(200).json({ balance: user.balance });
	}
}
