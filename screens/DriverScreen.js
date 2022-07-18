import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import { colors, parameters } from "../global/styles";
import MapComponent from "../components/MapComponent";
import { Avatar, Icon } from "react-native-elements";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const DriverScreen = ({ navigation }) => {
  return (
    <>
      <View style={styles.container}>
        <MapComponent />
      </View>
    </>
  );
};

export default DriverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  view1: {
    position: "absolute",
    top: 25,
    left: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    zIndex: 8,
  },
});
