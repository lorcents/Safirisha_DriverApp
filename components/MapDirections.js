import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_PLACES_APIKEY } from "@env";

function MapDirectionsComponent({ placeOrigin, placeDest, trackRouteOnReady }) {
  return (
    <MapViewDirections
      origin={placeOrigin}
      destination={placeDest}
      apikey={GOOGLE_PLACES_APIKEY}
      strokeColor="#6644ff"
      strokeWidth={6}
      onReady={trackRouteOnReady}
    />
  );
}

export default MapDirectionsComponent;
