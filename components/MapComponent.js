import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Avatar, Icon, PricingCard } from "react-native-elements";
import { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { io } from "socket.io-client";
import Geocoder from "react-native-geocoding";
import { GOOGLE_PLACES_APIKEY } from "@env";

import { PlacesAutocomplete } from "./PlacesAutocomplete";
import MapView from "./MapView";
import MapDirections from "./MapDirections";
import { currentLocation } from "../screens/HomeScreen";
import Button from "./Button";
import { socketIoURL } from "../baseUrl";

export default function MapComponent() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [inputs, setInputs] = useState({
    lookingForClients: false,
    buttonText: "FIND CLIENT",
    clientFound: false,
  });
  const mapRef = useRef(null);

  Geocoder.init(GOOGLE_PLACES_APIKEY);

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

  const lookForClients = async () => {
    if (inputs.lookingForClients) {
      setInputs({
        lookingForClients: false,
      });
      return;
    }

    setInputs({
      lookingForClients: true,
      buttonText: "FINDING CLIENTS",
    });

    socket = io(socketIoURL);

    socket.on("connect", () => {
      socket.emit("lookingForClients", "Hello there client");
    });

    let clientOrigin;
    let clientDest;

    socket.on("truckRequest", async (routeResponse) => {
      console.log(`Route response from client ${routeResponse}`);
      clientOrigin = co = routeResponse[0];
      clientDest = cd = routeResponse[1];

      Geocoder.from(clientOrigin)
        .then((json) => {
          const address = json.results[0].address_components[1].short_name;
          console.log(`Client address ${address}`);
        })
        .catch((err) => console.log(err));

      console.log(clientOrigin);
      console.log(clientDest);

      // setOrigin(clientOrigin);
      // setDestination(clientDest);

      setInputs({
        buttonText: "CLIENT FOUND! PRESS TO ACCEPT",
        lookingForClients: false,
        clientFound: true,
      });
      acceptPassengerRequest();
    });
  };

  const acceptPassengerRequest = () => {
    socket.on("driverLocation", (driverLocation) => {
      driverLocation = currentLocation;
      socket.emit("driverLocation", driverLocation);
    });

    setOrigin(currentLocation);
    setDestination(clientOrigin);
  };

  return (
    <>
      <MapView reference={mapRef}>
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {origin && destination && traceRoute()}
        <MapDirections
          placeOrigin={origin}
          placeDest={destination}
          trackRouteOnReady={traceRouteOnReady}
        />
      </MapView>
      <View style={styles.searchContainer}>
        <PlacesAutocomplete
          placeholder="Origin"
          onPlaceSelected={(details = null) => {
            onPlaceSelected(details, "origin");
          }}
        />
        <View style={styles.compContainer}>
          <PlacesAutocomplete
            placeholder="Destination"
            onPlaceSelected={(details = null) => {
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
      </View>
      <View style={styles.bottomButton}>
        <Button>{inputs.buttonText}</Button>
        {inputs.clientFound && (
          <View style={styles.detailCard}>
            <PricingCard
              containerStyle={{ width: "80%" }}
              color="#63cb72"
              title="New Customer"
              price="ksh 10000"
              info={["From : Eldoret", "To: Nakuru"]}
              button={{ title: "Accept Request" }}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  compContainer: {
    marginVertical: 10,
  },
  button: {},
  buttonText: {},
  searchContainer: {
    position: "absolute",
    width: "90%",
    marginTop: 40,
    marginLeft: 20,
    top: Constants.statusBarHeight,
  },
  searchContainerBelow: {
    position: "absolute",
    width: "90%",
    marginTop: 40,
    backgroundColor: "white",
    elevation: 6,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  bottomButton: {
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 650,
  },
  detailCard: {
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 400,
  },
  requestButton: {
    padding: 60,
    fontSize: 24,
  },
});
