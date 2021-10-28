import React, { useState } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Asset } from "expo-asset";
import AppLoading from "expo-app-loading";
import { Provider, useSelector } from "react-redux";

import OnboardScreen from "./screens/OnboardScreen";
import LoginScreen from "./screens/LoginScreen";
import Tabs from "./navigation/Tabs";
import { images } from "./constants";
import store from "./redux";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [loaded] = useFonts({
    RobotoBlack: require("./assets/fonts/Roboto-Black.ttf"),
    RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
    RobotoMedium: require("./assets/fonts/Roboto-Medium.ttf"),
    Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
    RobotoLight: require("./assets/fonts/Roboto-Light.ttf"),
  });

  const _cacheResourcesAsync = async () => {
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_cacheResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }
  if (!loaded) return null;

  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

const AppWrapper = () => {
  const loginStatus = useSelector((state) => state.auth.loginStatus);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Onboard"
      >
        {false ? (
          <Stack.Group>
            <Stack.Screen name="Onboard" component={OnboardScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Tabs" component={Tabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

LogBox.ignoreLogs(["Setting a timer"]);
