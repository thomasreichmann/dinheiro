import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import connectToDatabase from '../../../../lib/connectToDatabase';

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

export default async function (req: NextApiRequest, res: NextApiResponse<Data | any>) {
	if (req.method != 'POST') return res.status(405);

	if (typeof req.body.balance != 'number') return res.status(400).json({ error: 'Invalid request body' });

	let session = await getSession({ req });

	if (!session || !session.user) return res.status(401).json({ error: 'Session not found' });

	const db = await connectToDatabase();
	let users = db.collection('users');

	// Find user data using session email and return it
	let user = await users.findOne<User>({ email: session.user.email });

	if (!user) return res.status(500).json({ error: 'User not found error' });

	users.updateOne({ email: user.email }, { $set: { balance: req.body.balance } });

	return res.status(200).send({ balance: req.body.balance });
}
