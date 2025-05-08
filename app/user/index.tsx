import { useSidebarStore } from "@/store/sidebar/useSideBarStore";
import useUserStore from "@/store/user/useUserStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import {
  Broom,
  Calender,
  CrossMedium,
  Email,
  FilterSearch,
  PersonalCard,
  User,
} from "@/ui/icon/symbol";
import { Pin } from "@/ui/icon/travel";
import ButtonOpenSidebar from "@/ui/layout/ButtonOpenSideBar";
import HeaderOpenSidebar from "@/ui/layout/HeaderOpenSidebar";
import ViewHasButtonAdd from "@/ui/layout/ViewHasButtonAdd";
import { Href, usePathname, router } from "expo-router";
import { useEffect, useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Skeleton } from "moti/skeleton";
import { IUser } from "@/interfaces/UserInterface";
import moment from "moment";
import {
  cn,
  formatDateForRequest,
  formatPhone,
  getTimezone,
} from "@/helper/helper";
import { useFocusEffect, useRouter } from "expo-router";
import Pagination from "@/ui/layout/Pagination";
import { useUI } from "@/hooks/useUI";
import DatePicker from "@/ui/Datepicker";
import Input from "@/ui/Input";
import Divide from "@/ui/Divide";
import Dropdown from "@/ui/Dropdown";

function UserCardSkeleton() {
  return (
    <View className="p-4 bg-white-100 rounded-xl flex-col gap-4">
      {/* Header */}
      <View className="w-full flex-row gap-4 items-center justify-between">
        <View className="gap-1 flex-1">
          <Skeleton colorMode="light" width="60%" height={20} radius={4} />
          <Skeleton colorMode="light" width="30%" height={16} radius={4} />
        </View>
        <Skeleton colorMode="light" width={60} height={24} radius={12} />
      </View>

      {/* Body */}
      <View className="flex-col gap-3 mt-2">
        {/* Email */}
        <View className="flex-row items-center gap-2">
          <Skeleton colorMode="light" width={24} height={24} radius={4} />
          <Skeleton colorMode="light" width="70%" height={16} radius={4} />
        </View>

        {/* Giới tính */}
        <View className="flex-row items-center gap-2">
          <Skeleton colorMode="light" width={24} height={24} radius={4} />
          <Skeleton colorMode="light" width="40%" height={16} radius={4} />
        </View>

        {/* Địa chỉ */}
        <View className="flex-row items-center gap-2">
          <Skeleton colorMode="light" width={24} height={24} radius={4} />
          <Skeleton colorMode="light" width="80%" height={16} radius={4} />
        </View>
      </View>
    </View>
  );
}

function UserCard({ user }: { user: IUser }) {
  return (
    <Button
      onPress={() => router.push(`/user/detail/${user.id}` as Href)}
      className="p-4 shadow-soft-xs border-1 border-white-100 bg-white-50 rounded-xl flex-col gap-4"
    >
      {/* Header */}
      <View className="w-full flex-row gap-4 items-center justify-between">
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <Text
              numberOfLines={1}
              className="font-BeVietnamSemiBold text-16 text-mineShaft-950 truncate"
            >
              {user.full_name}
            </Text>

            <View
              className={cn(
                `w-2 h-2 rounded-full`,
                user.is_active ? "bg-lime-400" : "bg-white-300"
              )}
            />
          </View>

          <Text className="font-BeVietnamRegular text-white-500">
            {formatPhone(user.phone)}
          </Text>
        </View>

        <View
          className={`px-4 py-2 ${
            user.is_completed ? "bg-blue-100" : "bg-red-100"
          } rounded-full`}
        >
          <Text
            className={`text-12 font-BeVietnamMedium ${
              user.is_completed ? "text-blue-600" : "text-red-600"
            }`}
          >
            {user.is_completed ? "Hoàn thành" : "Chưa hoàn thành"}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View className="flex-row flex-wrap gap-4">
        {/* Email */}
        <View className="flex-row items-center gap-2 flex-1 basis-1/3">
          <Icon icon={Email} className="text-white-400" />
          <Text
            className="font-BeVietnamRegular text-white-700 flex-1"
            numberOfLines={1}
          >
            {user.email || "Chưa cập nhật"}
          </Text>
        </View>

        {/* Giới tính */}
        <View className="flex-row items-center gap-2 flex-1 basis-1/3">
          <Icon icon={User} className="text-white-400" />
          <Text
            className="font-BeVietnamRegular text-white-700 flex-1"
            numberOfLines={1}
          >
            {user.gender ? "Nữ" : "Nam"}
          </Text>
        </View>

        {/* Ngày sinh */}
        <View className="flex-row items-center gap-2 flex-1 basis-1/3">
          <Icon icon={Calender} className="text-white-400" />
          <Text
            className="font-BeVietnamRegular text-white-700 flex-1"
            numberOfLines={1}
          >
            {moment(new Date(user.date_of_birth))
              .tz(getTimezone())
              .format("DD/MM/YYYY") || "Chưa cập nhật"}
          </Text>
        </View>

        {/* CCCD */}
        <View className="flex-row items-center gap-2 flex-1 basis-1/3">
          <Icon icon={PersonalCard} className="text-white-400" />
          <Text
            className="font-BeVietnamRegular text-white-700 flex-1"
            numberOfLines={1}
          >
            {user.identity_card || "Chưa cập nhật"}
          </Text>
        </View>

        {/* Địa chỉ */}
        <View className="flex-row items-center gap-2 flex-1 basis-full">
          <Icon icon={Pin} className="text-white-400" />
          <Text
            className="font-BeVietnamRegular text-white-700 flex-1"
            numberOfLines={1}
          >
            {user.address || "Chưa cập nhật"}
          </Text>
        </View>
      </View>
    </Button>
  );
}

const UserEmpty = () => {
  return (
    <View className="items-center gap-9">
      <View className="p-6 bg-white-50 rounded-full shadow-md shadow-black/10">
        <View className="p-9 rounded-full bg-mineShaft-50 border-4 border-mineShaft-100">
          <View className="p-9 bg-white-50 rounded-full shadow-md shadow-black/10">
            <View className="bg-mineShaft-950 p-4 rounded-full">
              <Icon icon={User} strokeWidth={2} />
            </View>
          </View>
        </View>
      </View>
      <View className="items-center gap-2 px-8">
        <Text className="font-BeVietnamBold text-16 text-mineShaft-900">
          Không tìm thấy người dùng phù hợp
        </Text>
        <Text className="font-BeVietnamRegular text-14 text-center text-mineShaft-400">
          Hãy thử thay đổi bộ lọc hoặc kiểm tra lại kết nối mạng.
        </Text>
      </View>
    </View>
  );
};

function FilterModal() {
  const { filterUser, setFilterUser, filter, genders, resetFilter } =
    useUserStore();
  const { hideModal } = useUI();

  const [loading, setLoading] = useState(false);
  const [birthDay, setBirthDay] = useState<Date | null>(null);
  const [gender, setGender] = useState<{ name: string; value: boolean } | null>(
    null
  );

  const handleFilter = useCallback(async () => {
    setLoading(true);
    if (gender) {
      setFilterUser("gender", gender.value);
    }
    if (birthDay) {
      setFilterUser("date_of_birth", formatDateForRequest(birthDay));
    }

    await filter();

    setLoading(false);
    hideModal();
  }, [filterUser, birthDay, gender]);

  useEffect(() => {
    setGender(genders.find((item) => item.value == filterUser?.gender) ?? null);
    setBirthDay(
      filterUser?.date_of_birth ? new Date(filterUser?.date_of_birth) : null
    );
  }, [filterUser?.date_of_birth, filterUser?.gender]);

  return (
    <Button
      onPress={() => {}}
      className="absolute bottom-0 bg-white-50 rounded-t-xl py-4 gap-4 w-full flex-col max-h-96"
    >
      <View className="px-4 flex-row items-center justify-between w-full">
        <View className="gap-3 flex-row items-center">
          <View className="bg-lime-500 p-2 rounded-full">
            <Icon icon={FilterSearch} className="text-white-50" />
          </View>
        </View>
        <Button className="bg-mineShaft-400 p-2" onPress={hideModal}>
          <Icon icon={CrossMedium} className="text-white-50" />
        </Button>
      </View>

      <Divide direction="horizontal" className="h-[1]" />
      <ScrollView className="px-2 w-full">
        <Button className="flex-col items-stretch gap-3 w-full">
          <Input
            label="Họ tên"
            value={filterUser.name ?? ""}
            onChange={(value) => setFilterUser("name", value)}
            type="text"
          />
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Input
                label="Số điện thoại"
                value={filterUser.phone ?? ""}
                onChange={(value) => setFilterUser("phone", value)}
                type="text"
              />
            </View>
            <DatePicker
              label="Ngày sinh"
              value={birthDay}
              onChange={setBirthDay}
              prefix={<Icon icon={Calender} />}
            />
          </View>

          <Dropdown
            value={gender}
            onChange={(option) => {
              if (setGender) setGender(option);
            }}
            hasSearch={false}
            className="z-20"
            options={genders}
            optionKey="name"
            label="Giới tính"
          />

          <Input
            label="Email"
            value={filterUser.email ?? ""}
            onChange={(value) => setFilterUser("email", value)}
            type="text"
          />

          <Input
            label="Địa chỉ"
            value={filterUser.address ?? ""}
            onChange={(value) => setFilterUser("address", value)}
            type="text"
          />
        </Button>
      </ScrollView>
      <View className="px-2 w-full flex-row gap-2">
        <Button
          disabled={loading}
          loading={loading}
          onPress={handleFilter}
          className="bg-lime-400 py-3 flex-1"
        >
          <Text className="font-BeVietnamSemiBold text-14 text-mineShaft-900">
            Tìm kiếm
          </Text>
        </Button>
        <Button
          className="bg-white-50 border-1 border-redPower-300 p-2"
          disabled={loading}
          onPress={resetFilter}
        >
          <Icon icon={Broom} className="text-redPower-600" />
        </Button>
      </View>
    </Button>
  );
}

function Index() {
  const { setSidebar } = useSidebarStore();
  const { showModal } = useUI();
  const { users, currentPage, totalPages, fetchUsers, changePage } =
    useUserStore();

  const [loading, setLoading] = useState(false);

  const path = usePathname();

  const handleFetchUser = useCallback(async () => {
    setLoading(true);
    fetchUsers();
    setLoading(false);
  }, []);

  useEffect(() => {
    setSidebar(path as Href);
  }, [path]);

  useFocusEffect(
    useCallback(() => {
      handleFetchUser();
    }, [])
  );

  const openFilter = useCallback(() => showModal(<FilterModal />), []);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View className="flex-1 bg-white-50">
        <HeaderOpenSidebar title="Người dùng" />
        <View className="px-3 py-1">
          <Button className="bg-lime-500 p-2 rounded-xl" onPress={openFilter}>
            <Icon icon={FilterSearch} className="text-white-50" />
          </Button>
        </View>

        <ViewHasButtonAdd
          onPressAdd={() => router.push("/user/create" as Href)}
        >
          {!loading && users.length <= 0 ? (
            <View className="flex-1 items-center justify-center">
              <UserEmpty />
            </View>
          ) : (
            <ScrollView
              className="px-3 flex-1"
              contentContainerStyle={{
                paddingBottom: 12,
              }}
            >
              <View className="flex-1 gap-3">
                {loading
                  ? // Show 4 skeletons while loading
                    Array(3)
                      .fill(0)
                      .map((_, index) => <UserCardSkeleton key={index} />)
                  : users.length > 0 &&
                    users.map((user) => <UserCard key={user.id} user={user} />)}
              </View>
            </ScrollView>
          )}
        </ViewHasButtonAdd>
        {!loading && totalPages > 1 && (
          <View className="pb-4">
            <Pagination {...{ totalPages, currentPage, changePage }} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default Index;
