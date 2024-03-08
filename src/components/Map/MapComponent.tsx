'use client';
import React, { useState, useEffect, useRef } from 'react';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import { Draw, Modify, Snap } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LineString, Polygon } from 'ol/geom';
import Overlay from 'ol/Overlay';
import { Icon, Style } from 'ol/style.js';

import Image from 'next/image';

//*Icons
////////
const LineStringIcon = require('@/assets/icons/Lines.png');
const PointIcon = require('@/assets/icons/location.png');
const PolygonIcon = require('@/assets/icons/Polygon.png');

const MapComponent = () => {
	const [geometryType, setGeometryType] = useState<any>('Polygon');
	const [loading, setLoading] = useState<any>(true);
	const mapRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<any>(null);
	const [isVisibleTooltip, setIsVisibleTooltip] = useState(true);

	//* temp Data for Map sections
	/////////////////////////////
	const buttonListItems = [
		{
			buttonItem: 'Polygon',
			buttonIcon: PolygonIcon,
			type: 'Polygon',
		},
		{
			buttonItem: 'Line',
			buttonIcon: LineStringIcon,
			type: 'LineString',
		},
		{
			buttonItem: 'Point',
			buttonIcon: PointIcon,
			type: 'Point',
		},
	];

	// * Function for Loading Map
	/////////////////////////////
	useEffect(() => {
		if (mapRef.current) {
			const source = new VectorSource();
			const vector = new VectorLayer({
				source: source,
			});

			const map = new Map({
				target: mapRef.current,
				layers: [
					new TileLayer({
						source: new OSM(),
					}),
					vector,
				],
				view: new View({
					center: [0, 0],
					zoom: 3,
				}),
			});
			setIsVisibleTooltip(false);
			const select = new Select({
				condition: click,
			});

			const overlay = new Overlay({
				element: tooltipRef.current,
				offset: [10, 0],
				positioning: 'bottom-left',
			});
			map.addOverlay(overlay);

			select.on('select', (event) => {
				if (event.selected.length > 0) {
					const feature = event.selected[0];
				}
			});

			map.addInteraction(select);

			const draw = new Draw({
				source: source,
				type: geometryType,
			});

			draw.on('drawstart', () => {
				overlay.setPosition(undefined);
			});

			draw.on('drawend', (event) => {
				const feature = event.feature;
				const geometry: any = feature.getGeometry();
				let measurement = '';

				if (geometry instanceof LineString) {
					const length = geometry.getLength();
					measurement = `Length: ${length.toFixed(2)} meters`;
					overlay.setPosition(geometry.getLastCoordinate());
				} else if (geometry instanceof Polygon) {
					const area = geometry.getArea();
					measurement = `Area: ${area.toFixed(2)} square meters`;
					const extent = geometry.getExtent();
					const center = [
						(extent[0] + extent[2]) / 2,
						(extent[1] + extent[3]) / 2,
					];
					overlay.setPosition(center);
				}

				if (measurement) {
					tooltipRef.current!.innerHTML = measurement;
					if (geometryType !== 'LineString') {
						overlay.setPosition(geometry?.getInteriorPoint().getCoordinates());
					}
				}
			});

			map.addInteraction(draw);

			const modify = new Modify({ source: source });
			const snap = new Snap({ source: source });

			map.addInteraction(modify);
			map.addInteraction(snap);

			const iconStyle = new Style({
				image: new Icon({
					src: '/assets/icons/location.png',
					scale: 0.5,
				}),
			});
			setLoading(false);

			return () => {
				map.setTarget(undefined as any);
			};
		}
	}, [geometryType]);

	return (
		<div className='map-component-container'>
			<p>
				GeoDrawMap is a versatile map marking application that provides the rich
				mapping capabilities of OpenLayers. This user-friendly tool allows you
				to effortlessly pinpoint locations, draw polygons, lines, or points on
				the map, and even calculate measurements such as area and length.
			</p>
			<div className='map-component-inner'>
				<div className='buttons-group'>
					{buttonListItems?.map((item, index) => (
						<button
							key={index}
							className={`bar ${geometryType === item.type && 'active'}`}
							onClick={() => {
								setGeometryType(item.type);
							}}>
							<Image
								src={item.buttonIcon}
								height={25}
								width={25}
								alt={item.buttonIcon}
								title='Lines'
							/>
							{item.buttonItem}
						</button>
					))}
				</div>

				<div
					ref={mapRef}
					className='map'
					style={{ width: '85%', height: '400px' }}>
					{/* Display loader while loading */}
					{loading && <div className='spinner-map'></div>}
				</div>
				<div
					ref={tooltipRef}
					className={`${tooltipRef.current ? 'tooltip' : ''}`}></div>
			</div>
		</div>
	);
};

export default MapComponent;
