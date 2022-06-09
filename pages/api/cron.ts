// pages/api/cron.ts

import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/connectToDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		let db = await connectToDatabase();
		let collection = db.collection('users');
		let users = await collection.find().toArray();

		for (let user of users) {
			if (!user.balance) user.balance = 0;
			if (!user.allowance) user.allowance = 0;

			user.balance += user.allowance;
			collection.updateOne({ email: user.email }, { $set: { balance: user.balance } });
		}

		res.status(200).end();
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
