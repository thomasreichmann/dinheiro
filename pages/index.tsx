import type { NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useState } from 'react';
import connectToDatabase from '../lib/connectToDatabase';
import styles from '../styles/Home.module.scss';

interface Props {
	balance?: number;
	allowance?: number;
}

const Home: NextPage = (props: Props) => {
	const { data: session } = useSession();

	let [gasto, setGasto] = useState<string>('');
	let [total, setTotal] = useState(props.balance ?? 0);

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

	const handleInvert = async (e: any) => {
		e.preventDefault();
		if (gasto.charAt(0) != '-') setGasto('-' + gasto);
		else setGasto(gasto.substring(1));
	};

	return (
		<>
			{session ? (
				<div className={styles.main}>
					<h1>{total}</h1>
					<form className={styles.form} onSubmit={handleConfirm}>
						<button type='submit' className={styles.confirmButton} onClick={handleConfirm}>
							confirm
						</button>
						<button onClick={handleInvert} onTouchEnd={handleInvert}>
							-
						</button>
						<input autoFocus inputMode='numeric' name='value' value={gasto ?? ''} onChange={updateGasto} />
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
	balance?: number;
	allowance?: number;
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

	if (!user.balance) users.updateOne({ email: user.email }, { $set: { balance: 0 } });

	if (!user.allowance) users.updateOne({ email: user.email }, { $set: { allowance: 0 } });

	return { props: { balance: user.balance, allowance: user.allowance } };
}

export default Home;
