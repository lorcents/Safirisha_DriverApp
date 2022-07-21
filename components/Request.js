import React, { useEffect,  useState } from "react";
import { Alert, StyleSheet } from "react-native";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";

function ClientRequest() {
  const [inputs, setInputs] = useState({
    lookingForClients: false,
    buttonText: "FIND CLIENT",
    clientFound: false,
  });

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

    // return () => {
    //   BackgroundGeolocation.removeAllListeners();
    // };
  }, []);

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

    socket.on("truckRequest", async (routeResponse) => {
      const clientOrigin = routeResponse[0];
      const clientDest = routeResponse[1];

      setOrigin(clientOrigin);
      setDestination(clientDest);

      setInputs({
        buttonText: "CLIENT FOUND! PRESS TO ACCEPT",
        lookingForClients: false,
        clientFound: true,
      });
    });
  };

  const acceptPassengerRequest = () => {
    const clientLocation = coordinates;

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
        `http://maps.apple.com/?daddr=${origin.latitude},${origin.longitude}`
      );
    } else {
      Linking.openURL(
        `geo:0,0?q=${origin.latitude},${origin.longitude}(Passenger)`
      );
    }
  };

  let endMarker = null;
  let startMarker = null;
  let findingPassengerActIndicator = null;
  let bottomButtonFunction = lookForClients;

  if (latitude === null) {
    return null;
  }

  if (lookingForClients) {
    findingPassengerActIndicator = (
      <ActivityIndicator
        size="large"
        animating={lookingForClients}
        color="white"
      />
    );
  }

  if (clientFound) {
    //clientSearchText = 'FOUND PASSENGER! PRESS TO ACCEPT RIDE?';
    bottomButtonFunction = acceptPassengerRequest;
  }

  return (
    <View style={styles.mapStyle}>
      <BottomButton
        onPressFunction={bottomButtonFunction}
        buttonText={inputs.buttonText}
      >
        {findingPassengerActIndicator}
      </BottomButton>
    </View>
  );
}

export default ClientRequest;

const styles = StyleSheet.create({});
