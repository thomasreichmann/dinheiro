import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from '../shared/Header/Header';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
	const router = useRouter();
	const { data: session } = useSession();

	console.log(session);

	useEffect(() => {
		console.log('useEffect running');
		if (session) {
			console.log('LOGGED IN');
			router.push('/dashboard');
		}
	}, []);

	if (session) {
	}

	const renderUserData = () => {
		if (!session) return <></>;

		return (
			<article>
				<img src={session.user?.image ?? ''} />
				<p>{session.user?.name}</p>
				<p>{session.user?.email}</p>
			</article>
		);
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Tracker</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className={styles.main}>
				<h1>Welcome</h1>
			</main>
		</div>
	);
};

export default Home;
