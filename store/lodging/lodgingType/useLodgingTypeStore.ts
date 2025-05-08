import { create } from "zustand";
import { ILodgingType } from "@/interfaces/LodgingInterface";
import LodgingTypeService from "@/services/LodgingType/LogingTypeService";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import { isArray } from "lodash";

interface LodgingTypeState {
  lodgingTypes: ILodgingType[];
  loading: boolean;
  list: () => void;
}

const lodgingTypeService = new LodgingTypeService();

const useLodgingTypeStore = create<LodgingTypeState>((set) => ({
  lodgingTypes: [],
  loading: false,

  list: async () => {
    set({ loading: true });
    try {
      const response = await lodgingTypeService.list();


      if (!isArray(response)) {
        useToastStore
          .getState()
          .addToast(
            constant.toast.type.error,
            "Lỗi khi tải danh sách loại nhà"
          );
        return;
      }
      set({ lodgingTypes: response });
    } catch (error) {
      useToastStore
        .getState()
        .addToast(constant.toast.type.error, "Lỗi khi tải danh sách loại nhà");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useLodgingTypeStore;
