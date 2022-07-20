import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";

function RequestDriver() {
  const [inputs, setInputs] = useState({
    lookingForPassengers: false,
    buttonText: "FIND PASSENGER",
    passengerFound: false,
  });

  mapRef = useRef(null);

  let socket = null;

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

    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, []);

  const lookForPassengers = async () => {
    if (lookingForPassengers) {
      setInputs({
        lookingForPassengers: false,
      });
      return;
    }

    setInputs({
      lookingForPassengers: true,
      buttonText: "FINDING PASSENGERS",
    });

    socket = io(socketIoURL);

    socket.on("connect", () => {
      socket.emit("lookingForPassengers");
    });

    socket.on("truckRequest", async (routeResponse) => {
      await this.props.getRouteDirections(
        routeResponse.geocoded_waypoints[0].place_id
      );
      this.map.fitToCoordinates(this.props.pointCoords, {
        edgePadding: { top: 20, bottom: 20, left: 80, right: 80 },
      });
      setInputs({
        buttonText: "PASSENGER FOUND! PRESS TO ACCEPT",
        lookingForPassengers: false,
        passengerFound: true,
      });
    });
  };

  const acceptPassengerRequest = () => {
    const passengerLocation = coordinates;

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
      this.socket.emit("driverLocation", {
        latitude: location.latitude,
        longitude: location.longitude,
      });
    });

    if (Platform.OS === "ios") {
      Linking.openURL(
        `http://maps.apple.com/?daddr=${passengerLocation.latitude},${passengerLocation.longitude}`
      );
    } else {
      Linking.openURL(
        `geo:0,0?q=${passengerLocation.latitude},${passengerLocation.longitude}(Passenger)`
      );
    }
  };

  let endMarker = null;
  let startMarker = null;
  let findingPassengerActIndicator = null;
  let bottomButtonFunction = lookForPassengers;

  if (latitude === null) {
    return null;
  }

  if (lookingForPassengers) {
    findingPassengerActIndicator = (
      <ActivityIndicator
        size="large"
        animating={lookingForPassengers}
        color="white"
      />
    );
  }

  if (passengerFound) {
    //passengerSearchText = 'FOUND PASSENGER! PRESS TO ACCEPT RIDE?';
    bottomButtonFunction = acceptPassengerRequest;
  }

  if (this.props.pointCoords.length > 1) {
    endMarker = (
      <Marker coordinate={coordinates}>
        <Image
          style={{ width: 40, height: 40 }}
          source={require("../images/person-marker.png")}
        />
      </Marker>
    );
  }

  return (
    <View style={styles.mapStyle}>
      <MapView
        ref={mapRef}
        style={styles.mapStyle}
        initialRegion={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        {endMarker}
        {startMarker}
      </MapView>

      <BottomButton
        onPressFunction={bottomButtonFunction}
        buttonText={this.state.buttonText}
      >
        {findingPassengerActIndicator}
      </BottomButton>
    </View>
  );
}

export default RequestDriver;

const styles = StyleSheet.create({});
