import { Text, StyleSheet, View, TouchableOpacity, Button } from "react-native";
import React, { useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import GOOGLE_PLACES_APIKEY from "@env";
import Constants from "expo-constants";
import { mapStyle } from "../global/mapStyle";

import { carsAround } from "../global/data";

// export const GooglePlacesInput = ({ placeholder, onPlaceSelected }) => {
//   return (
//     <GooglePlacesAutocomplete
//       placeholder={placeholder}
//       fetchDetails
//       styles={{ textInput: styles.inputText }}
//       onPress={(data, details = null) => {
//         onPlaceSelected(details);
//       }}
//       query={{
//         key: GOOGLE_PLACES_APIKEY,
//         language: "en",
//       }}
//       currentLocation={true}
//     />
//   );
// };

export default function MapComponent() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef(null);

  const moveTo = async (position) => {
    const camera = await mapRef.current.getCamera();

    if (camera) {
      camera.center = position;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 60;

  const edgePadding = {
    top: edgePaddingValue,
    bottom: edgePaddingValue,
    right: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRoute = () => {
    if (origin && destination) {
      mapRef.current.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat,
      longitude: details?.geometry.location.lng,
    };

    set(position);
    moveTo(position);
  };

  const INITIAL_POSITION = {
    latitude: 0.5143,
    longitude: 35.2698,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    // latitudeDelta: 5.9,
    // longitudeDelta: 2.0,
  };

  const coordinates = [
    {
      latitude: 0.5142774999999999,
      longitude: 35.2697802,
    },
    {
      latitude: -1.2920659,
      longitude: 36.8219462,
    },
  ];
  console.log(origin);
  console.log(destination);
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_POSITION}
        // customMapStyle={mapStyle}
        showsUserLocation={true}
        followUserLocation={true}
        rotateEnabled={true}
        zoomEnabled={true}
      >
        {origin && <Marker coordinate={coordinates[0]} />}
        {destination && <Marker coordinate={coordinates[1]} />}
        {origin && destination && traceRoute()}

        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[1]}
          apikey={GOOGLE_PLACES_APIKEY}
          strokeColor="#6644ff"
          strokeWidth={8}
          onReady={traceRouteOnReady}
        />
      </MapView>
      {/* <View style={styles.searchContainer}>
        <GooglePlacesInput
          placeholder="Origin"
          onPlaceSelected={(details = null) => {
            onPlaceSelected(details, "origin");
            // 'details' is provided when fetchDetails = true
          }}
        />
        <View style={styles.compContainer}>
          <GooglePlacesInput
            placeholder="Destination"
            onPlaceSelected={(details = null) => {
              // 'details' is provided when fetchDetails = true
              onPlaceSelected(details, "destination");
            }}
          />
        </View>
        {duration && distance ? (
          <View>
            <Text>Distance : {distance.toFixed(2)} km</Text>
            <Text>Duration : {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
      </View> */}
      <View style={styles.searchContainer}>
        <Button title="Get a Jobo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignItems: "center",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  compContainer: {
    marginVertical: 10,
  },
  button: {},
  buttonText: {},
  searchContainer: {
    position: "absolute",
    width: "90%",
    top: Constants.statusBarHeight,
  },
  searchContainerBelow: {
    position: "absolute",
    width: "90%",
    marginTop: 20,
    backgroundColor: "white",
    elevation: 6,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  inputText: {
    // borderWidth: 1,
    borderRadius: 6,
    elevation: 16,
  },
});
