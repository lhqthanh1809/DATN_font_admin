import { Text, View } from "react-native";
import Icon from "../Icon";
import { Home2 } from "../icon/symbol";
import { useSidebarStore } from "@/store/sidebar/useSideBarStore";
import Button from "../Button";
import { cn, env, getStatusBarHeight } from "@/helper/helper";
import { MotiView } from "moti";
import { router, usePathname } from "expo-router";
import { Logout } from "../icon/active";
import { useUI } from "@/hooks/useUI";
import { useCallback, useState } from "react";
import useToastStore from "@/store/toast/useToastStore";
import LoadingAnimation from "../LoadingAnimation";
import { constant } from "@/assets/constant";
import AuthService from "@/services/Auth/AuthService";
import { LocalStorage } from "@/services/LocalStorageService";

function ButtonOpenSidebar() {
  const { showModal } = useUI();
  return (
    <View>
      <Button
        onPress={() => {
          showModal(<ModalSidebar />);
        }}
      >
        <View className="w-6 h-6 justify-center">
          <View className="gap-1">
            <View
              style={{ height: 2, backgroundColor: "black" }}
              className="w-4/5 rounded-full"
            />
            <View
              style={{ height: 2, backgroundColor: "black" }}
              className="rounded-full"
            />
            <View
              style={{ height: 2, backgroundColor: "black" }}
              className="w-4/5 rounded-full"
            />
          </View>
        </View>
      </Button>
    </View>
  );
}

const ModalSidebar = () => {
  const { sideBars, setSidebar } = useSidebarStore();
  const { hideModal } = useUI();
  const { addToast } = useToastStore();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const localStorage = new LocalStorage();

  const logout = useCallback(async () => {
    setLoadingLogout(true);
    try {
      const result = await new AuthService().logout();
      if (typeof result != "string") {
        addToast(constant.toast.type.error, "Đăng xuất thất bại");
        return;
      }
      
      await localStorage.removeItem(env("KEY_TOKEN"));
      if (router.canDismiss()) {
        router.dismissAll();
      }
      hideModal()
      router.replace("/login");
    } catch (err) {
      addToast(constant.toast.type.error, "Đăng xuất thất bại");
    } finally {
      setLoadingLogout(false);
    }
  }, []);

  return (
    <Button
      onPress={() => {}}
      className="absolute h-full min-w-72 px-3 pb-6 gap-2"
      style={{
        paddingTop: getStatusBarHeight() + 2,
      }}
    >
      <MotiView
        from={{ translateX: -100, opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
        exit={{ translateX: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="h-full min-w-72 bg-[#F9FAFD] px-3 py-6 gap-2 rounded-xl"
      >
        <View className="bg-white-50 shadow-xl p-3 rounded-xl flex-1 gap-1">
          {sideBars.map((sidebar, index) => (
            <Button
              key={index}
              onPress={() => {
                if (!sidebar.isActive) {
                  router.replace(sidebar.path);

                }
              }}
              className={cn(
                "justify-start flex-row gap-2 items-center p-2 rounded-md",
                sidebar.isActive && "bg-lime-400"
              )}
            >
              <Icon
                icon={sidebar.icon}
                className={cn(sidebar.isActive && "text-white-50")}
              />
              <Text
                className={cn(
                  "font-BeVietnamMedium",
                  sidebar.isActive && "text-white-50"
                )}
              >
                {sidebar.label}
              </Text>
            </Button>
          ))}
        </View>

        <Button
          onPress={logout}
          disabled={loadingLogout}
          className="bg-white-50 shadow-md p-3 rounded-xl flex-row items-center justify-between"
        >
          <Text className="font-BeVietnamMedium">Đăng xuất</Text>

          {loadingLogout ? <LoadingAnimation /> : <Icon icon={Logout} />}
        </Button>
      </MotiView>
    </Button>
  );
};

export default ButtonOpenSidebar;
