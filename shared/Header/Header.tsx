import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from './Header.module.scss';

export default function Header() {
	const router = useRouter();
	const { data: session } = useSession();

	console.log(session?.user?.image!);

	return (
		<header>
			<div className={styles.wrapper}>
				<span></span>
				<div className={styles.buttonsWrapper}>
					<div className={styles.mainButtons}>
						<></>
					</div>
					{session ? (
						// <img src={session.user?.image!} />
						<button
							onClick={() => {
								signOut();
							}}
						>
							Logout
						</button>
					) : (
						<button
							onClick={() => {
								signIn();
							}}
						>
							Login
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
