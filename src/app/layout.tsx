import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Open Layers Demo Application',
	description:
		'The OpenLayers Demo Application is a powerful tool for showcasing the capabilities of the OpenLayers library. It provides an intuitive interface for exploring interactive maps, enabling users to visualize geographic data with ease and precision.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<main>{children}</main>
			</body>
		</html>
	);
}
