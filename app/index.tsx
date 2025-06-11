import { useGeneral } from "@/hooks/useGeneral";
import Icon from "@/ui/Icon";
import { Bell } from "@/ui/icon/symbol";
import { Image, InteractionManager, Text, View } from "react-native";
import { Building } from "@/ui/icon/general";
import { Fingerprint } from "@/ui/icon/security";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ItemMenu,
  ManagementScreen,
  MenuHome,
  PersonScreen,
} from "@/pages/User/Home/components";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import { router, useFocusEffect } from "expo-router";
import { env, getJWTPayload } from "@/helper/helper";
import AuthService from "@/services/Auth/AuthService";
import { LocalStorage } from "@/services/LocalStorageService";

function Index() {
  useEffect(() => {
    const navigateRouter = async () => {
      try {
        const token = await new LocalStorage().getItem(env("KEY_TOKEN"));
        if (!token) {
          router.replace("/login");
          return;
        }

        const payload = getJWTPayload(token);

        if (payload.exp < Date.now()) {
          router.replace("/dashboard");
          return;
        }

        const data = await new AuthService().refreshToken();

        if (!data || data.hasOwnProperty("message")) {
          await localStorage.removeItem(env("KEY_TOKEN"));
          router.replace("/login");
          return;
        }
        await localStorage.setItem(env("KEY_TOKEN"), data);
        router.replace("/dashboard");
      } catch (error) {
        router.replace("/login");
      }
    };
    navigateRouter();
  }, []);

  return (
    <View className="flex-1 bg-white-50 items-center justify-center gap-4">
      <Image
        style={{ width: 150, height: 150 }}
        source={require("../assets/images/icon512.png")}
      />

      <Text className="font-BeVietnamBold text-5xl text-mineShaft-950">
        Nestify
      </Text>
    </View>
  );
}

export default Index;