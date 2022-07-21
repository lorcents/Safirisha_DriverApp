import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { colors, parameters } from "../global/styles";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { filterData, carsAround } from "../global/data";
import { mapStyle } from "../global/mapStyle";
// import * as Location from "expo-location";

const SCREEN_WIDTH = Dimensions.get("window").width;

let position;
const HomeScreen = ({ navigation }) => {
  const [latlng, setLatlng] = useState({});
  position = latlng;

  const checkPermissions = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === "granted") {
      const permission = await askPermission();
      return permission;
    }
    return true;
  };

  const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.status === "granted";
  };

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      console.log(`checking location ${latitude}, ${longitude}`);
      setLatlng({ latitude: latitude, longitude: longitude });
    } catch (e) {}
  };

  const _map = useRef(1);

  useEffect(() => {
    checkPermissions();
    getLocation();
    console.log(latlng);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon1}></View>
      </View>
      <ScrollView bounces={false}>
        <View style={styles.home}>
          {/* <Text style={styles.text1}>Select your destination</Text> */}
          <View style={styles.view1}>
            <View style={styles.view8}>
              <Text style={styles.text22}>Welcome to Freight</Text>
              <Text style={styles.text2}>Pata kazi ya kubeba mzigo</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("Login")}
              >
                <View style={styles.button1}>
                  <Text style={styles.button1Text}>Get Started</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <Image
                style={styles.image1}
                source={require("../assets/uberCar.png")}
              />
            </View>
          </View>
        </View>
        <View>
          <FlatList
            numRows={3}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filterData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.view2}>
                  <Image style={styles.image2} source={item.image} />
                </View>
                <View>
                  <Text style={styles.title}>{item.name}</Text>
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.view3}>
          <Text style={styles.text3}>Where to ? </Text>
          <View style={styles.view4}>
            <Icon
              type="material-community"
              name="clock-time-four" //animate
              color={colors.primary1}
              size={26}
            />
            <Text style={{ marginLeft: 5, marginTop: 2 }}>Now</Text>
            <Icon
              type="material-community"
              name="chevron-down"
              color={colors.primary1}
              size={26}
            />
          </View>
        </View>
        <View style={styles.view5}>
          <View style={styles.view6}>
            <View style={styles.view7}>
              <Icon
                type="material-community"
                name="map-marker"
                color={colors.black}
                size={22}
              />
            </View>
            <View>
              <Text style={{ fontSize: 18, color: colors.black }}>
                32 Olivia Rd
              </Text>
              <Text style={{ color: colors.primary3 }}>
                Klipfontein 83-Ir, Bokburg
              </Text>
            </View>
          </View>
          <View>
            <Icon
              type="material-community"
              name="chevron-right"
              color={colors.primary}
              size={26}
            />
          </View>
        </View>

        <Text style={styles.text4}> Trucks nearby </Text>
        <View style={{ alignContent: "center", justifyContent: "center" }}>
          {/* <MapView
            ref={_map}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            // customMapStyle={mapStyle}
            showsUserLocation={true}
            followUserLocation={true}
            rotateEnabled={true}
            zoomEnabled={true}
            initialregion={{
              ...carsAround[0],
              latitudeDelta: 5.9,
              longitudeDelta: 2.0,
            }}
          >
            {carsAround.map((item, index) => (
              <MapView.Marker coordinate={item} key={index.toString()}>
                <Image
                  resizeMode="cover"
                  style={styles.carsAround}
                  source={require("../../assets/carMarker.png")}
                />
              </MapView.Marker>
            ))}
          </MapView> */}
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="#2058c0" translucent={true} />
    </View>
  );
};

export default HomeScreen;

export const currentLocation = position;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 30,
  },

  header: {
    backgroundColor: colors.blue,
    height: parameters.headerHeight,
    alignItems: "flex-start",
  },

  image1: {
    height: 100,
    width: 100,
  },
  image2: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  home: {
    backgroundColor: "#63cb72",
    paddingLeft: 20,
  },

  text1: {
    color: colors.white,
    fontSize: 21,
    paddingBottom: 20,
    paddingTop: 10,
  },
  text2: {
    color: colors.white,
    fontSize: 16,
  },
  text22: {
    color: "gold",
    fontSize: 18,
  },

  view1: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 30,
  },

  button1: {
    height: 40,
    width: 150,
    backgroundColor: colors.black,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  button1Text: {
    color: colors.white,
    fontSize: 17,
    marginTop: -2,
  },

  card: {
    alignItems: "center",
    margin: SCREEN_WIDTH / 22,
  },

  view2: {
    marginBottom: 5,
    borderRadius: 15,
    backgroundColor: colors.primary6,
  },

  title: {
    color: colors.black,
    fontSize: 16,
  },
  view3: {
    flexDirection: "row",
    marginTop: 5,
    height: 50,
    backgroundColor: colors.primary6,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  text3: {
    marginLeft: 15,
    fontSize: 20,
    color: colors.black,
  },

  view4: {
    flexDirection: "row",
    marginRight: 15,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },

  view5: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 25,
    justifyContent: "space-between",
    marginHorizontal: 15,
    borderBottomColor: colors.primary4,
    borderBottomWidth: 1,
    flex: 1,
  },
  view6: {
    alignItems: "center",
    flex: 5,
    flexDirection: "row",
  },
  view7: {
    backgroundColor: colors.primary6,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  map: {
    height: 200,
    marginHorizontal: 10,
    width: SCREEN_WIDTH * 0.95,
  },

  text4: {
    fontSize: 20,
    color: colors.black,
    marginLeft: 20,
    marginVertical: 20,
  },

  icon1: {
    marginLeft: 10,
    marginTop: 5,
  },
  view8: {
    flex: 4,
    marginTop: -25,
  },
  carsAround: {
    width: 28,
    height: 14,
  },
  location: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },

  view9: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "white",
  },
});
