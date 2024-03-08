import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import MapWrapper from '@/components/Map/Index';

export default function Home() {
	return (
		<div className='parent-container'>
			<Header />
			<MapWrapper />
			<Footer />
		</div>
	);
}
