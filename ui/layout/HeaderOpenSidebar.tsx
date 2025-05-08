import { Text, View } from "react-native";
import Icon from "../Icon";
import { Home2 } from "../icon/symbol";
import { useSidebarStore } from "@/store/sidebar/useSideBarStore";
import Button from "../Button";
import { cn, getStatusBarHeight } from "@/helper/helper";
import { MotiView } from "moti";
import { router } from "expo-router";
import { Logout } from "../icon/active";
import { useUI } from "@/hooks/useUI";
import ButtonOpenSidebar from "./ButtonOpenSideBar";

const HeaderOpenSidebar:React.FC<{
  title?: string
}> = ({title}) => {
  return (
    <View className="p-5 flex-row justify-between items-center">
    <Text className="font-BeVietnamBold text-18">{title}</Text>
    <ButtonOpenSidebar/>
  </View>
  );
}


export default HeaderOpenSidebar;
