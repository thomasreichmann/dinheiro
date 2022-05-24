import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import connectToDatabase from '../lib/connectToDatabase';
import Header from '../shared/Header/Header';
import styles from '../styles/Home.module.scss';

interface Props {
	balance?: number;
}

const Home: NextPage = (props: Props) => {
	const { data: session } = useSession();

	let [gasto, setGasto] = useState<string>('');
	let [total, setTotal] = useState(props.balance ?? 0);

	// console.log(props);

	const updateGasto = (e: any) => {
		let value = e.target.value;

		if (isNaN(value) && value != '-') return setGasto('');

		return setGasto(value);
	};

	const handleConfirm = async (e: any) => {
		e.preventDefault();

		if (gasto === '' || gasto === '-') gasto = '0';

		fetch('api/user/balance/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ balance: total - parseInt(gasto) }),
		});

		console.log(gasto, parseInt(gasto));

		setTotal(total - parseInt(gasto));
		setGasto('');
	};

	return (
		<>
			{session ? (
				<div className={styles.main}>
					<h1>{total}</h1>
					<form className={styles.form} onSubmit={handleConfirm}>
						<input autoFocus name='value' value={gasto ?? ''} onChange={updateGasto} />
						<button onClick={handleConfirm}>confirm</button>
					</form>
				</div>
			) : (
				<></>
			)}
		</>
	);
};
interface User {
	_id: string;
	name: string;
	email: string;
	image: string;
	emailVerified: boolean;
	balance: number;
}

export async function getServerSideProps(context: any) {
	let session = await getSession(context);

	if (!session) return { props: {} };

	const db = await connectToDatabase();
	let users = db.collection('users');

	if (!session.user) return { props: {} };

	// Find user data using session email and return it
	let user = await users.findOne<User>({ email: session.user.email });

	console.log(user);
	if (!user) return { props: {} };

	if (!user.balance) {
		// set default user balance and send response
		users.updateOne({ email: user.email }, { $set: { balance: 0 } });
		return { props: { balance: 0 } };
	} else {
		return { props: { balance: user.balance } };
	}
}

export default Home;
