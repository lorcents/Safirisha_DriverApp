import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import { colors, parameters } from "../global/styles";

import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

function HomeScreen({ navigation }) {
  function loginHandler() {
    navigation.navigate("Login");
  }
  function signUpHandler() {
    navigation.navigate("Signup");
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/homeBg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.text}>Welcome to Safirisha Drive App</Text>

          <View style={styles.buttons}>
            <Button onPress={loginHandler}>Login</Button>
            <Button onPress={signUpHandler}>Sign Up</Button>
          </View>
        </View>
      </ImageBackground>
      <StatusBar style="dark" />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: "#63cb72",
    height: SCREEN_HEIGHT / 2,
    width: "100%",
    marginTop: "100%",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "40%",
  },

  image: {
    marginTop: 40,
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    marginTop: 20,

    fontWeight: "bold",
  },
});
