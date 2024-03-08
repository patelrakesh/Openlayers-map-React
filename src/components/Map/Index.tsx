import React from 'react';
import MapComponent from './MapComponent';

const MapWrapper = () => {
	return (
		<div className='map-container'>
			<div className='map-inner-container'>
				<MapComponent />
			</div>
		</div>
	);
};

export default MapWrapper;
