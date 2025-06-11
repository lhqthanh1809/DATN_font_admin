import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GeneralProvider } from "@/providers/GeneralProvider";
import { useGeneral } from "@/hooks/useGeneral";

import { UIProvider } from "@/providers/UIProvider";

export default function RootLayout() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    BeVietnamProBold: require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    BeVietnamProExtraBold: require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    BeVietnamProMedium: require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    BeVietnamProRegular: require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProSemiBold: require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Hiển thị màn hình chờ khi chưa load xong
  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-white-50 items-center justify-center gap-4">
        <Image
          style={{ width: 180, height: 250 }}
          source={require("../assets/images/icon_text.png")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white-50"
      style={
        Platform.OS === "android" && {
          paddingTop: StatusBar.currentHeight,
        }
      }
    >
      <GeneralProvider>
        <UIProvider>
          <GestureHandlerRootView>
            <Container />
          </GestureHandlerRootView>
        </UIProvider>
      </GeneralProvider>
    </SafeAreaView>
  );
}

const Container = () => {
  const containerRef = useRef(null);
  const { clickRef } = useGeneral();
  return (
    <TouchableWithoutFeedback
      className="flex-1 bg-white-50"
      onPress={() => {
        clickRef(containerRef, () => {});
      }}
    >
      <View className="flex-1 bg-white-50 relative" ref={containerRef}>
        <StatusBar barStyle={"dark-content"} backgroundColor={"transparent"} />
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            freezeOnBlur: false,
          }}
        />
        {/* <View className="w-screen h-screen absolute bg-black"></View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};
