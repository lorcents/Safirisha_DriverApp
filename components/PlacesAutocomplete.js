import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_PLACES_APIKEY } from "@env";
import { StyleSheet } from "react-native";

export const PlacesAutocomplete = ({ placeholder, onPlaceSelected }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      fetchDetails
      styles={{ textInput: styles.inputText }}
      onPress={(data, details = null) => {
        onPlaceSelected(details);
      }}
      query={{
        key: GOOGLE_PLACES_APIKEY,
        language: "en",
      }}
      currentLocation={true}
    />
  );
};

const styles = StyleSheet.create({
  inputText: {
    borderRadius: 6,
    elevation: 16,
  },
});
