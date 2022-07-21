import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { io } from "socket.io-client";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";

import { PlacesAutocomplete } from "./PlacesAutocomplete";
import MapView from "./MapView";
import MapDirections from "./MapDirections";
// import { currentLocation } from "../Screens/HomeScreen";
import Button from "./Button";

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

  useEffect(() => {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on("authorization", (status) => {
      console.log(
        "[INFO] BackgroundGeolocation authorization status: " + status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              "App requires location tracking permission",
              "Would you like to open app settings?",
              [
                {
                  text: "Yes",
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: "No",
                  onPress: () => console.log("No Pressed"),
                  style: "cancel",
                },
                ,
              ]
            ),
          1000
        );
      }
    });

    // return () => {
    //   BackgroundGeolocation.removeAllListeners();
    // };
  }, []);

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
    if (lookingForClients) {
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
      socket.emit("lookingForClients");
    });

    let clientOrigin;
    let clientDest;

    socket.on("truckRequest", async (routeResponse) => {
      clientOrigin = co = routeResponse[0];
      clientDest = cd = routeResponse[1];

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
    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        "[INFO] BackgroundGeolocation service is running",
        status.isRunning
      );
      console.log(
        "[INFO] BackgroundGeolocation services enabled",
        status.locationServicesEnabled
      );
      console.log(
        "[INFO] BackgroundGeolocation auth status: " + status.authorization
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        console.log("start", status.isRunning);
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
    BackgroundGeolocation.on("location", (location) => {
      //Send driver location to paseenger socket io backend
      const driverLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      this.socket.emit("driverLocation", driverLocation);
      setOrigin(driverLocation);
    });

    setDestination(clientOrigin);

    if (Platform.OS === "ios") {
      Linking.openURL(
        `http://maps.apple.com/?daddr=${origin.latitude},${origin.longitude}`
      );
    } else {
      Linking.openURL(
        `geo:0,0?q=${origin.latitude},${origin.longitude}(Passenger)`
      );
    }
  };

  let indicator = (
    <ActivityIndicator
      size="large"
      animating={lookingForClients}
      color="white"
    />
  );

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
      <View style={styles.mapStyle}>
        <Button onPress={lookForClients}>
          {lookingForClients && indicator}
          {inputs.buttonText}
        </Button>
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
    // alignItems: "center",
    // justifyContent: "center",
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
});
