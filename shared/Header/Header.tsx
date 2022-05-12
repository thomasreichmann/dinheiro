import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './Header.module.scss';

export default function Header() {
	const { data: session } = useSession();

	console.log(session?.user?.image!);

	return (
		<header>
			<div className={styles.wrapper}>
				<span>LOGO</span>
				<div className={styles.buttonsWrapper}>
					<div className={styles.mainButtons}>
						<>
							<a href='https://discord.gg/Hu69Ds2vse' target='_blank' rel='noreferrer'>
								Support Server
							</a>
						</>
					</div>
					{session ? (
						// <img src={session.user?.image!} />
						<button
							onClick={() => {
								signOut();
							}}
						>
							SignOut
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
