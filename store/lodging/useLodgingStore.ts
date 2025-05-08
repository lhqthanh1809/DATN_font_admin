import { create } from "zustand";
import { IFilterLodging, ILodging } from "@/interfaces/LodgingInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useToastStore from "../toast/useToastStore";
import { constant } from "@/assets/constant";
import * as Yup from "yup";

const lodgingSchema = Yup.object().shape({
  name: Yup.string().required("Tên nhà cho thuê là bắt buột"),
  phone_contact: Yup.string()
    .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
    .nullable(),
  email_contact: Yup.string().email("Email không hợp lệ").nullable(),
  type_id: Yup.number().min(1).required("Loại hình cho thuê là bắt buộc"),
  user_id: Yup.string().required("Chủ sở hữu là bắt buộc"),
  payment_date: Yup.number()
    .max(28)
    .min(1)
    .required("Ngày thanh toán là bắt buột"),
  late_days: Yup.number().min(0).required("Hạn thanh toán là bắt buột"),
});

interface LodgingState {
  lodgings: ILodging[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  limit: number;
  isTrash: boolean;
  filterLodging: IFilterLodging;

  setFilterLodging: (field: keyof IFilterLodging, value: string) => void;

  changePage: (page: number) => void;
  list: (page?: number) => void;
  update: (lodging: ILodging) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
  create: (lodging: ILodging) => Promise<boolean>;
  switchTrash: (value: boolean) => void;
  filter: () => void;
  resetFilter: () => void;
}

const lodgingService = new LodgingService();

const useLodgingStore = create<LodgingState>((set, get) => ({
  loading: false,
  currentPage: 1,
  totalPages: 1,
  limit: 6,
  isTrash: false,
  lodgings: [],
  filterLodging: {
    name: "",
    address: "",
  },

  setFilterLodging: (field: keyof IFilterLodging, value: string) => {
    set({ filterLodging: { ...get().filterLodging, [field]: value } });
  },

  list: async (page: number = 1) => {
    set({ loading: true });
    try {
      const offset = (page - 1) * get().limit;
      const response = await lodgingService.list({
        limit: get().limit,
        offset,
        is_trash: get().isTrash,
        filters: get().filterLodging,
      });

      if ("message" in response) {
        useToastStore
          .getState()
          .addToast(
            constant.toast.type.error,
            "Lỗi khi tải danh sách nơi cư trú"
          );
        return;
      }

      set({
        lodgings: response.data,
        currentPage: page,
        totalPages: Math.ceil(response.total / get().limit),
      });
    } catch (error) {
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.error,
          "Lỗi khi tải danh sách nơi cư trú"
        );
    } finally {
      set({ loading: false });
    }
  },

  changePage: async (page: number) => {
    if (page < 1 || page > get().totalPages) return;
    await get().list(page);
  },

  update: async (lodging: ILodging) => {
    set({ loading: true });
    try {
      await lodgingSchema.validate(lodging, { context: { isCreate: false } });

      const response = await lodgingService.update(lodging);
      if ("message" in response) {
        useToastStore
          .getState()
          .addToast(
            constant.toast.type.error,
            "Lỗi khi cập nhật thông tin nơi cư trú"
          );
        return false;
      }

      set((state) => ({
        lodgings: state.lodgings.map((l) =>
          l.id === lodging.id ? lodging : l
        ),
      }));
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.success,
          "Cập nhật thông tin nơi cư trú thành công"
        );

      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        useToastStore
          .getState()
          .addToast(constant.toast.type.error, error.message);
      } else {
        useToastStore
          .getState()
          .addToast(
            constant.toast.type.error,
            "Lỗi khi cập nhật thông tin nơi cư trú"
          );
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },

  delete: async (lodgingId: string) => {
    try {
      const response = await lodgingService.delete(lodgingId);
      if (typeof response === "object" && "message" in response) {
        useToastStore
          .getState()
          .addToast(constant.toast.type.error, "Lỗi khi xóa nhà cho thuê");
        return false;
      }

      // If response is a string (success case)
      if (typeof response === "string") {
        set((state) => ({
          lodgings: state.lodgings.filter((l) => l.id !== lodgingId),
        }));
        useToastStore
          .getState()
          .addToast(constant.toast.type.success, "Xóa nhà cho thuê thành công");
      }
      return true;
    } catch (error) {
      useToastStore
        .getState()
        .addToast(constant.toast.type.error, "Lỗi khi xóa nhà cho thuê");
      return false;
    }
  },

  create: async (lodging: ILodging) => {
    set({ loading: true });
    try {
      await lodgingSchema.validate(lodging, { context: { isCreate: true } });

      const response = await lodgingService.create(lodging);
      if ("message" in response) {
        useToastStore
          .getState()
          .addToast(constant.toast.type.error, "Lỗi khi tạo nhà cho thuê mới");
        return false;
      }

      set((state) => ({
        lodgings: [...state.lodgings, response],
      }));
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.success,
          "Tạo nhà cho thuê mới thành công"
        );
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        useToastStore
          .getState()
          .addToast(constant.toast.type.error, error.message);
      } else {
        useToastStore
          .getState()
          .addToast(constant.toast.type.error, "Lỗi khi tạo nhà cho thuê mới");
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },

  filter: async () => {
    await get().list(1);
  },

  switchTrash: (value) => {
    if (value != get().isTrash) {
      set({ isTrash: value });
      get().list(1);
    }
  },
  resetFilter: () => {
    const filter = get().filterLodging;
    const cleanedFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, value]) => Boolean(value))
    );

    const isEmpty = Object.keys(cleanedFilter).length === 0;
    if (!isEmpty) {
      set({ filterLodging: {} });
      get().list(1);
    }
  },
}));

export default useLodgingStore;
