import AuthService from "@/services/Auth/AuthService";
import { useOTPStore } from "@/store/useOTPStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronLeft } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import HeaderBack from "@/ui/layout/HeaderBack";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

function RequestOTP() {
  const [height, setHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email, setEmail, requestOtp } = useOTPStore();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleRequestOtp = useCallback(async () => {
    setLoading(true);
    try {
      const result = await requestOtp();

      if (result) {
        router.push("/auth/verify_otp");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View className="flex-1 bg-white-50">
        <View className="px-6 bg-white-50 py-4 flex-row items-center gap-3">
          <Pressable
            onPress={() => {
              router.back();
            }}
            className="flex items-center justify-center absolute left-6 z-10 p-1 rounded-full"
          >
            <Icon icon={ChevronLeft} className="text-mineShaft-950" />
          </Pressable>
          <Text className="font-BeVietnamBold text-2xl text-mineShaft-950 w-full text-center">
            Quên mật khẩu
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          onLayout={(event) => {
            setHeight(event.nativeEvent.layout.height);
          }}
        >
          <View
            className="flex-1 justify-center gap-16 py-3"
            style={
              !keyboardVisible && {
                height: height,
              }
            }
          >
            <SvgUri
              width={"100%"}
              uri={
                "https://qqmdkbculairrumaowaj.supabase.co/storage/v1/object/public/lodging_management/asset/get_otp.svg"
              }
            />

            <View className="px-6 gap-4">
              <View className="gap-2">
                <Text className="font-BeVietnamBold text-20 text-center text-mineShaft-950">
                  Quên mật khẩu?
                </Text>

                <View className="px-9">
                  <Text className="text-center font-BeVietnamRegular text-mineShaft-800">
                    Đừng lo, chuyện này bình thường mà! Vui lòng nhập email liên
                    kết với tài khoản của bạn.
                  </Text>
                </View>
              </View>

              <View className="pb-2">
                <Input
                  value={email}
                  onChange={(value) => setEmail(value)}
                  placeHolder="Nhập email của bạn"
                  label="Email"
                />
              </View>

              <Button
                disabled={loading}
                loading={loading}
                onPress={handleRequestOtp}
                className="w-full py-4 bg-lime-400"
              >
                <Text className="text-mineShaft-950 text-18 font-BeVietnamSemiBold">
                  Lấy OTP
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default RequestOTP;
