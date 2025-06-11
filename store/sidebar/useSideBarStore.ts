import { ISidebarItem } from "@/interfaces/SidebarInterface";
import { Building } from "@/ui/icon/general";
import { Overview } from "@/ui/icon/symbol";
import Users from "@/ui/icon/symbol/users";
import { Href } from "expo-router";
import { create } from "zustand";

interface ISidebarStore {
  sideBars: ISidebarItem[];

  setSidebar: (path: Href) => void;
}

export const useSidebarStore = create<ISidebarStore>((set) => ({
  sideBars: [
    { icon: Overview, label: "Tổng quan", path: "/dashboard", isActive: false },
    { icon: Users, label: "Người dùng", path: "/user", isActive: true },
    {
      icon: Building,
      label: "Nhà cho thuê",
      path: "/lodging",
      isActive: false,
    },
  ],

  setSidebar: (path) => {
    set((state) => ({
      sideBars: state.sideBars.map((item) => ({
        ...item,
        isActive: item.path === path,
      })),
    }));
  },
}));
