import { Href, SplashScreen, Stack, usePathname, useRouter } from "expo-router";
import "../global.css";
import {
  AppState,
  AppStateStatus,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { env, getDeviceID, getJWTPayload } from "@/helper/helper";
import { LocalStorage } from "@/services/LocalStorageService";
import { GeneralProvider } from "@/providers/GeneralProvider";
import { useGeneral } from "@/hooks/useGeneral";
import UserService from "@/services/User/UserService";
import { UIProvider } from "@/providers/UIProvider";
import { IUser } from "@/interfaces/UserInterface";
import AuthService from "@/services/Auth/AuthService";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const localStorage = new LocalStorage();
  const route = useRouter();
  const [page, setPage] = useState<Href | null>(null);
  const pathName = usePathname();
  const [hasHandledPush, setHasHandledPush] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    BeVietnamProBold: require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    BeVietnamProExtraBold: require("../assets/fonts/BeVietnamPro-ExtraBold.ttf"),
    BeVietnamProMedium: require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    BeVietnamProRegular: require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    BeVietnamProSemiBold: require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  useEffect(() => {
    const navigateRouter = async () => {
      try {
        const token = await localStorage.getItem(env("KEY_TOKEN"));
        if (!token) {
          setPage("/login");
          return;
        }

        const payload = getJWTPayload(token);

        if (payload.exp < Date.now()) {
          setPage("/");
          return;
        }

        const data = await new AuthService().refreshToken();

        if (!data || data.hasOwnProperty("message")) {
          await localStorage.removeItem(env("KEY_TOKEN"));
          setPage("/login");
          return;
        }
        await localStorage.setItem(env("KEY_TOKEN"), data);
        setPage("/");
      } catch (error) {
        setPage("/login");
      } finally {
        setLoading(false);
      }
    };

    SplashScreen.preventAutoHideAsync();
    navigateRouter();
  }, []);

  useEffect(() => {
    if (!loading && fontsLoaded && page) {
      route.replace(page);
      SplashScreen.hideAsync();
    }
  }, [loading, fontsLoaded, page]);

  // Hiển thị màn hình chờ khi chưa load xong
  if (!fontsLoaded || loading || !page) {
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
    <SafeAreaView className="flex-1 bg-white-50">
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
        <StatusBar barStyle="dark-content" translucent />
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
