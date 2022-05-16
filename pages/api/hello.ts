// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/connectToDatabase';

type Data = {
	movies: Movie[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	// let client = await clientPromise;
	// let db = client.db('sample_mflix');
	// let movies = await db.collection<Movie>('movies').find().limit(20).toArray();

	let db = await connectToDatabase();
	const movies = await db.collection<Movie>('movies').find({}).limit(3).toArray();

	res.status(200).json({ movies });
}

interface Movie {
	_id: {
		$oid: string;
	};
	plot: string;
	genres: Array<string>;
	runtime: number;
	cast: Array<string>;
	num_mflix_comments: number;
	title: string;
	fullplot: string;
	countries: Array<string>;
	released: {
		$date: string;
	};
	directors: Array<string>;
	rated: string;
	awards: {
		wins: number;
		nominations: number;
		text: string;
	};
	lastupdated: string;
	year: number;
	imdb: {
		rating: number;
		votes: number;
		id: number;
	};
	type: string;
	tomatoes: {
		viewer: {
			rating: number;
			numReviews: number;
			meter: number;
		};
		lastUpdated: {
			$date: string;
		};
	};
}
