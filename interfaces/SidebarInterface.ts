import { IIcon } from "@/ui/Icon";
import { Href } from "expo-router";

export interface ISidebarItem{
    icon:  React.ElementType<IIcon>,
    label: string,
    path: Href,
    isActive: boolean
}