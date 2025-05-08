import Button from "@/ui/Button";
import Input from "@/ui/Input";
import { Text, TextInput, View } from "react-native";
import BackView from "@/ui/BackView";
import { useCallback, useEffect, useState } from "react";
import { env, encrypt } from "@/helper/helper";
import { LocalStorage } from "@/services/LocalStorageService";
import { HttpStatusCode } from "axios";
import { useRouter } from "expo-router";
import UserService from "@/services/User/UserService";
import { IError } from "@/interfaces/ErrorInterface";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import * as Yup from "yup";
import AuthService from "@/services/Auth/AuthService";

const schema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string().required("Mật khẩu là bắt buột"),
});

function LoginScreen() {
  const { addToast } = useToastStore();
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeLogin, setActiveLogin] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const authServer = new AuthService();

  const handleInputPhone = useCallback((text: string) => setEmail(text), []);
  const handleInputPassword = useCallback(
    (text: string) => setPassword(text),
    [password]
  );

  const handleLogin = useCallback(async () => {
    const fields = {
      email,
      password: encrypt(password),
    };
    setLoading(true);
    setActiveLogin(false);
    try {
      await schema.validate(fields, { abortEarly: false });
      const dataLogin: IError | string = await authServer.login(fields);

      if (typeof dataLogin != "string" || !dataLogin) {
        addToast(constant.toast.type.error, (dataLogin as IError)?.message ??  "Đăng nhập thất bại.");
        return;
      }

      const token = dataLogin as string;
      if (token) {
        await new LocalStorage().setItem(env("KEY_TOKEN"), token);
        addToast(constant.toast.type.success, "Đăng nhập thành công!");
        route.push("/");
      }
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((e) => {
          addToast(constant.toast.type.error, e.message);
        });
      } else {
        addToast(
          constant.toast.type.error,
          err.message ?? "Đã có lỗi xảy ra, vui lòng thử lại"
        );
      }
    } finally {
      setLoading(false);
      setActiveLogin(true);
    }
  }, [password, email]);

  useEffect(() => {
    setActiveLogin(Boolean(email && password));
  }, [email, password]);

  return (
    <BackView>
      <View
        className="px-8 gap-11 flex-1 justify-center items-center"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="px-4 w-full ">
          <View className="py-4 bg-white-50 w-full flex items-center justify-center rounded-2xl border-1.5 border-mineShaft-200">
            <Text className="font-BeVietnamBold text-30 text-mineShaft-950">
              Đăng nhập
            </Text>
          </View>
        </View>
        <View className="w-full flex gap-3">
          <View className="gap-5">
            <Input
              className=""
              value={email}
              required
              onChange={handleInputPhone}
              label="Email"
              type="text"
            />
            <Input
              required
              value={password}
              onChange={handleInputPassword}
              label="Mật khẩu"
              type="password"
            />
          </View>
          <View className="flex items-end pr-5 mb-4">
            <Button onPress={() => {route.push("/auth/request_otp")}}>
              <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">
                Quên mật khẩu?
              </Text>
            </Button>
          </View>
          <Button
            disabled={!activeLogin}
            onPress={handleLogin}
            loading={loading}
            className="w-full min-h-16 bg-lime-400"
          >
            <Text className="text-mineShaft-900 text-20 font-BeVietnamSemiBold">
              Đăng nhập
            </Text>
          </Button>
        </View>
      </View>
    </BackView>
  );
}

export default LoginScreen;
