export const filterData = [
  { name: "Truck", image: require("../assets/ride.png"), id: "0" },
  { name: "Construction", image: require("../assets/food.png"), id: "1" },
  { name: "Package", image: require("../assets/package.png"), id: "2" },
  // { name: "Relocate", image: require("../../assets/reserve.png"), id: "3" },
];

export const rideData = [
  { street: "32 Olivia Rd", area: "Klipfontein 83-Ir,Boksburg", id: "0" },
  { street: "Hughes Industrial Park", area: "Hughes,Boksburg", id: "1" },
  {
    street: "32 Olivia Road",
    area: " East Rand,Ekurhuleni,Gauteng,1459",
    id: "2",
  },
  { street: "Total Boksburg", area: "35 Atlas Rd,Anderbolt,Boksburg", id: "3" },
  { street: "179 8th Ave", area: "Bezuidenhout Valley,Johannesburg", id: "4" },
];

export const carTypeData = [
  {
    title: "Popular",
    data: [
      {
        name: "Uber Go",
        group: 2,
        price: 7,
        image: require("../assets/uberGo.png"),
        note: "Affordable.compact rides",
        promotion: 5,
        time: "20:19",
        id: "0",
      },
      {
        name: "UberX",
        group: 3,
        price: 5.5,
        image: require("../assets/uberX.png"),
        note: "Affordable everyday trips",
        promotion: 0,
        time: "20:20",
        id: "1",
      },
      {
        name: "Connect",
        group: 0,
        price: 12.6,
        image: require("../assets/uberConnect.png"),
        note: "Send and receive packages",
        promotion: 10,
        time: "20:33",
        id: "2",
      },
    ],
  },

  {
    title: "Premium",
    data: [
      {
        name: "Black",
        group: 3,
        price: 17.4,
        image: require("../assets/uberBlack.png"),
        note: "Premium trips in luxury cars",
        promotion: 0,
        time: "20:31",
        id: "3",
      },
      {
        name: "Van",
        group: 6,
        price: 22.3,
        image: require("../assets/uberVan.png"),
        note: "Rides for groups up to 6",
        promotion: 12,
        time: "20:31",
        id: "4",
      },
    ],
  },

  {
    title: "More",
    data: [
      {
        name: "Assist",
        group: 3,
        price: 35.3,
        image: require("../assets/uberAssist.png"),
        note: "Special assistance from certified drivers",
        promotion: 26,
        time: "20:25",
        id: "5",
      },
    ],
  },
];

export const requestData = [
  {
    name: "For Me",
    id: 0,
  },
  {
    name: "For Someone",
    id: 1,
  },
];

export const rideOptions = [
  { name: "Personal", icon: "account", id: "0" },
  { name: "Business", icon: "briefcase", id: "1" },
];

export const paymentOptions = [
  { image: require("../assets/visaIcon.png"), text: "Visa ...0476" },
  { image: require("../assets/cashIcon.png"), text: "Cash" },
];

export const availableServices = [
  "Uber Go",
  "UberX",
  "Uber connect",
  "Uber Black",
  "Uber Van",
  "Uber Assist",
];

export const carsAround = [
  { latitude: 0.32365, longitude: 34.2851 },
  { latitude: 0.0737, longitude: 35.18519 },
  { latitude: 0.303665, longitude: 36.285188 },
  { latitude: 0.41369, longitude: 36.085178 },
  { latitude: 0.53368, longitude: 35.28515 },
  // { latitude: -6.186549, longitude: 106.780093 },
];
