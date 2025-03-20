import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const lat = 40.7128; // Example latitude
const lon = -74.006; // Example longitude

const MapComponent = () => {
  const tileUrl =
    "https://earthengine.googleapis.com/v1/projects/ee-final-year-project-2001/maps/5cacb8987e2a8c67c45931893809fefe-c0dd84a7a760b9b7141b419e454044f2/tiles/{z}/{x}/{y}.png";

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tileUrl}
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
