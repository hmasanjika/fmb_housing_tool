import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import location from "../assets/icons/location_filled.png";

type MapsProps = {
  title?: string;
  lat: number;
  lng: number;
  width?: string;
  height?: string;
};
const Maps = ({
  title,
  lat,
  lng,
  width = "400px",
  height = "300px",
}: MapsProps) => {
  const center = {
    lat: lat,
    lng: lng,
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB-DDSMVD0rYKzP8e-ueH_6HGXBrHCDUzA",
    // OLD googleMapsApiKey: "AIzaSyB__EtBVr1pwPt3gTKBgp83NocjBZ9lj8o",
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: width, height: height }}
      center={center}
      zoom={16}
      options={{
        styles: [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      <Marker
        title={title}
        key={"location"}
        icon={location}
        position={center}
        zIndex={999}
      />
    </GoogleMap>
  ) : null;
};

export default React.memo(Maps);
