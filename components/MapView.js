import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";

function MapViewComponent({ children, reference }) {
  const INITIAL_POSITION = {
    latitude: 0.5143,
    longitude: 35.2698,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={reference}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_POSITION}
        showsUserLocation={true}
        followUserLocation={true}
        rotateEnabled={true}
        zoomEnabled={true}
      >
        {children}
      </MapView>
    </View>
  );
}

export default MapViewComponent;

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignItems: "center",
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
