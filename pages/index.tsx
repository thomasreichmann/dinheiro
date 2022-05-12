import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '../shared/Header/Header';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
	const { data: session } = useSession();

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
				<Header />

				<h1>Welcome</h1>
			</main>
		</div>
	);
};

export default Home;
