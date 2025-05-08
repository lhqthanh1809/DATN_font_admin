import { create } from "zustand";
import { IUser } from "@/interfaces/UserInterface";
import UserService from "@/services/User/UserService";
import { constant } from "@/assets/constant";
import useToastStore from "../toast/useToastStore";

interface ListUserParams {
  search?: string;
  cancelToken?: any;
}

interface UserState {
  options: IUser[];
  limit: number;
  offset: number;
  total: number;
  loadingMore: boolean;
  loading: boolean;
  searchValue: string;

  setOptions: (options: IUser[]) => void;
  appendOptions: (options: IUser[]) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  setTotal: (total: number) => void;
  setLoadingMore: (loading: boolean) => void;
  setSearchValue: (value: string) => void;
  resetUsers: () => void;

  listUser: ({ search, cancelToken }: ListUserParams) => Promise<void>;
  loadMore: (cancelToken?: any) => Promise<void>;
}

export const useUserLoadMoreStore = create<UserState>((set, get) => ({
  options: [],
  limit: 10,
  offset: 0,
  total: 0,
  loadingMore: false,
  loading: false,
  searchValue: "",

  setOptions: (options) => set({ options }),
  appendOptions: (newOptions) =>
    set((state) => ({ options: [...state.options, ...newOptions] })),
  setLimit: (limit) => set({ limit }),
  setOffset: (offset) => set({ offset }),
  setTotal: (total) => set({ total }),
  setLoadingMore: (loading) => set({ loadingMore: loading }),
  setSearchValue: (value) => set({ searchValue: value }),
  resetUsers: () =>
    set({
      options: [],
      offset: 0,
      total: 0,
      loadingMore: false,
      searchValue: "",
    }),

  listUser: async ({ search = "", cancelToken }) => {
    const {
      limit,
      offset,
      searchValue,
      setOptions,
      appendOptions,
      setOffset,
      setTotal,
      setLoadingMore,
      setSearchValue,
    } = get();

    let newOffset = offset;
    const isNewSearch = search !== searchValue;

    if (isNewSearch) {
      newOffset = 0;
      set({ options: [], offset: 0 });
      setSearchValue(search);
    }

    set({ loading: true });

    try {
      const result = await new UserService().list(
        {
          limit,
          offset: newOffset,
          filters: { name: search },
        },
        cancelToken
      );

      if ("message" in result) {
        return;
      }

      const users = result.data;
      const total = result.total;

      if (isNewSearch) {
        setOptions(users);
      } else {
        appendOptions(users);
      }

      setTotal(total);
      setOffset(newOffset + limit);
    } catch (error) {
        useToastStore
        .getState()
        .addToast(
          constant.toast.type.error,
          "Lỗi khi tải danh sách người dùng"
        );
    } finally {
      set({ loading: false });
    }
  },

  loadMore: async (cancelToken) => {
    const {
      limit,
      offset,
      total,
      searchValue,
      appendOptions,
      setOffset,
      setLoadingMore,
    } = get();

    if (offset >= total) return;
    setLoadingMore(true);

    try {
      const result = await new UserService().list(
        {
          limit,
          offset,
          filters: { name: searchValue },
        },
        cancelToken
      );

      if ("message" in result) {
        return;
      }

      appendOptions(result.data);
      setOffset(offset + limit);
    } catch (error) {
    } finally {
      setLoadingMore(false);
    }
  },
}));
