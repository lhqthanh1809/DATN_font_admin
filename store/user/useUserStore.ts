import { IFilterUser, IUser, ICreateUser } from "@/interfaces/UserInterface";
import { create } from "zustand";
import UserService from "@/services/User/UserService";
import useToastStore from "../toast/useToastStore";
import { constant } from "@/assets/constant";
import * as Yup from "yup";

const userSchema = Yup.object().shape({
  full_name: Yup.string().required("Họ tên là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").nullable(),
  identity_card: Yup.string().required("Căn cước công dân là bắt buộc"),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  password: Yup.string().when('$isCreate', {
    is: true,
    then: (schema) => schema.required("Mật khẩu là bắt buộc"),
    otherwise: (schema) => schema.optional(),
  }),
  gender: Yup.boolean().required("Giới tính là bắt buộc"),
  date_of_birth: Yup.string().required("Ngày sinh là bắt buộc"),
});

interface IUserStore {
  user: IUser | null;
  genders: {value: boolean, name: string}[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  limit: number;
  filterUser: IFilterUser;
  setFilterUser: (field : keyof IFilterUser, value : any) => void
  users: IUser[];
  setUser: (user: IUser) => void;
  fetchUsers: (page?: number) => Promise<void>;
  changePage: (page: number) => Promise<void>;
  update: (user: IUser) => Promise<void>;
  delete: (userId: string) => Promise<boolean>;
  create: (user: ICreateUser) => Promise<boolean>;
  filter: () => void;
  resetFilter: () => void;
}

const userService = new UserService();

const useUserStore = create<IUserStore>((set, get) => ({
  user: null,
  loading: false,
  currentPage: 1,
  totalPages: 1,
  limit: 6,
  genders: [
    {
      name: "Nam",
      value: false,
    },
    {
      name: "Nữ",
      value: true,
    },
  ],
  filterUser: {
    name: "",
    email: "",
    phone: "",
    identity_card: "",
    date_of_birth: null,
    address: "",
  },
  users: [],

  setUser: (user: IUser) => {
    set({ user });
  },
  
  setFilterUser: (field: keyof IFilterUser, value: any) => {
    set({ filterUser: { ...get().filterUser, [field]: value } });
  },

  fetchUsers: async (page: number = 1) => {
    try {
      const offset = (page - 1) * get().limit;
      const response = await userService.list({
        limit: get().limit,
        offset,
        filters: get().filterUser,
      });

      if ("message" in response) {
        useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi tải danh sách người dùng");
        return;
      }

      set({
        users: response.data,
        currentPage: page,
        totalPages: Math.ceil(response.total / get().limit),
      });

    } catch (error) {
      useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi tải danh sách người dùng");
    }
  },

  changePage: async (page: number) => {
    if (page < 1 || page > get().totalPages) return;
    await get().fetchUsers(page);
  },

  update: async (user: IUser) => {
    set({ loading: true });
    try {
      await userSchema.validate(user, { context: { isCreate: false } });
      
      const response = await userService.update(user);
      if ("message" in response) {
        useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi cập nhật thông tin người dùng");
        return;
      }

      set((state) => ({
        users: state.users.map((u) => (u.id === user.id ? user : u)),
        user: state.user?.id === user.id ? user : state.user,
      }));
      useToastStore.getState().addToast(constant.toast.type.success, "Cập nhật thông tin người dùng thành công");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        useToastStore.getState().addToast(constant.toast.type.error, error.message);
      } else {
        useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi cập nhật thông tin người dùng");
      }
    } finally {
      set({ loading: false });
    }
  },

  delete: async (userId: string) => {
    try {
      const response = await userService.delete(userId);
      if (typeof response === "object" && "message" in response) {
        useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi xóa người dùng");
        return false;
      }

      // If response is a string (success case)
      if (typeof response === "string") {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
          user: state.user?.id === userId ? null : state.user,
        }));
        useToastStore.getState().addToast(constant.toast.type.success, "Xóa người dùng thành công");
      }
      return true;
    } catch (error) {
      useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi xóa người dùng");
      return false
    }
  },

  create: async (user: ICreateUser) => {
    set({ loading: true });
    try {
      await userSchema.validate(user, { context: { isCreate: true } });
      
      const response = await userService.create(user);
      if ("message" in response) {
        useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi tạo người dùng mới");
        return false;
      }

      set((state) => ({
        users: [...state.users, response],
      }));
      useToastStore.getState().addToast(constant.toast.type.success, "Tạo người dùng mới thành công");
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        useToastStore.getState().addToast(constant.toast.type.error, error.message);
      } else {
        useToastStore.getState().addToast(constant.toast.type.error, "Lỗi khi tạo người dùng mới");
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },

  filter: () => {
    get().fetchUsers(1)
  },

  resetFilter:() => {
    const filter = get().filterUser;
    const cleanedFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, value]) => Boolean(value))
    );

    const isEmpty = Object.keys(cleanedFilter).length === 0;
    if(!isEmpty){
      set({filterUser: {}});
      get().fetchUsers(1)
    }
  },
}));

export default useUserStore;