import React from 'react';
import Header from '../shared/Header/Header';

interface Props {
	children: any;
}

export default function Layout(props: Props) {
	return (
		<>
			<Header />
			<main>{props.children}</main>
		</>
	);
}
