import { reference } from "@/assets/reference";
import { cn, formatPhone } from "@/helper/helper";
import { ILodging, ILodgingType } from "@/interfaces/LodgingInterface";
import { IMap } from "@/interfaces/MapInterface";
import useLodgingStore from "@/store/lodging/useLodgingStore";
import { useSidebarStore } from "@/store/sidebar/useSideBarStore";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import Phone from "@/ui/icon/active/phone";
import {
  Broom,
  CrossMedium,
  Email,
  FilterSearch,
  Home2,
  RotateLeft,
  Trash,
  User,
} from "@/ui/icon/symbol";
import { Pin, PinCircle, PinLarge, PinSmall } from "@/ui/icon/travel";
import ButtonOpenSidebar from "@/ui/layout/ButtonOpenSideBar";
import HeaderOpenSidebar from "@/ui/layout/HeaderOpenSidebar";
import Pagination from "@/ui/layout/Pagination";
import ViewHasButtonAdd from "@/ui/layout/ViewHasButtonAdd";
import Map from "@/ui/Map";
import { Href, router, useFocusEffect, usePathname } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { LocalStorage } from "@/services/LocalStorageService";
import LodgingService from "@/services/Lodging/LodgingService";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import { useUI } from "@/hooks/useUI";
import Input from "@/ui/Input";
import useLodgingTypeStore from "@/store/lodging/lodgingType/useLodgingTypeStore";
import Dropdown from "@/ui/Dropdown";

const LodgingCardSkeleton = () => {
  return (
    <Button className="p-4 bg-white-100 rounded-xl flex-col gap-4">
      <View className="gap-2">
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-1">
            <Skeleton colorMode="light" width="50%" height={22} radius={4} />
          </View>
        </View>

        <View className="w-full flex-row items-center gap-2">
          <View className="flex-1">
            <Skeleton colorMode="light" width="70%" height={24} radius={6} />
          </View>
        </View>
      </View>

      {/* Map */}
      <View className="w-full rounded-lg h-36 overflow-hidden">
        <View className="flex-1">
          <Skeleton
            colorMode="light"
            width={"100%"}
            height={"100%"}
            radius={2}
          />
        </View>
      </View>

      {/* Info contract  */}
      <View className="w-full gap-2">
        <View className="w-full flex-row items-center gap-2">
          <View className="flex-1">
            <Skeleton colorMode="light" width="50%" height={24} radius={6} />
          </View>
        </View>

        <View className="w-full flex-row items-center gap-2">
          <View className="flex-1">
            <Skeleton colorMode="light" width="70%" height={24} radius={6} />
          </View>
        </View>
      </View>
    </Button>
  );
};

const LodgingCard: React.FC<{
  lodging: ILodging;
  status: Promise<Location.PermissionStatus>;
}> = ({ lodging, status }) => {
  const location: IMap = useMemo(() => {
    return {
      latitude: Number(lodging.latitude) || 0,
      longitude: Number(lodging.longitude) || 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [lodging]);

  const [errorAvatar, setErrorAvatar] = useState(false);
  const [permission, setPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastStore();
  const { lodgings } = useLodgingStore();

  useEffect(() => {
    status.then(setPermission);
  }, [status]);

  const restore = useCallback(async () => {
    setLoading(true);

    try {
      const result = await new LodgingService().restore(lodging.id ?? "");
      if (typeof result != "string") {
        addToast(constant.toast.type.error, result.message);
        return;
      }

      addToast(constant.toast.type.success, "Khôi phục thành công");
      useLodgingStore.setState((state) => ({
        lodgings: state.lodgings.filter((item) => item.id !== lodging.id),
      }));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [lodging]);

  return (
    <Button
      onPress={() => router.push(`/lodging/detail/${lodging.id}` as Href)}
      className="p-4 shadow-soft-xs border-1 border-white-100 bg-white-50 rounded-xl flex-col gap-4"
    >
      <View className="gap-2">
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-2 flex-1">
            <Text
              numberOfLines={1}
              className="font-BeVietnamSemiBold text-16 text-mineShaft-950 truncate"
            >
              {lodging.name}
            </Text>

            <View
              className={cn(
                `w-2 h-2 rounded-full`,
                lodging.is_enabled ? "bg-lime-400" : "bg-white-300"
              )}
            />
          </View>

          <View className="bg-lime-400 rounded-full p-2">
            <Text className="text-12 font-BeVietnamMedium text-white-50">
              {lodging.type?.name ?? reference.undefined.name}
            </Text>
          </View>
        </View>

        <View className="w-full flex-row items-center gap-2">
          <Icon icon={PinLarge} className="text-white-500" />

          <View className="flex-1">
            <Text className="font-BeVietnamRegular text-white-700">
              {[
                lodging.address,
                lodging.ward?.prefix
                  ? `${lodging.ward.prefix} ${lodging.ward.name}`
                  : lodging.ward?.name,
                lodging.district?.name,
                lodging.province?.name,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
        </View>
      </View>

      {/* Map */}
      {lodging.latitude && lodging.longitude && permission === "granted" && (
        <View className="w-full rounded-lg h-36 bg-black overflow-hidden">
          <View className="flex-1">
            <Map location={location} region={location} />
          </View>

          <View className="absolute left-2 bottom-2 bg-white-50 rounded p-2">
            <Text className="text-12 font-BeVietnamRegular text-mineShaft-950">
              {parseFloat(lodging.latitude).toFixed(7)},{" "}
              {parseFloat(lodging.longitude).toFixed(7)}
            </Text>
          </View>
        </View>
      )}

      {/* Info contract  */}
      <View className="w-full gap-2">
        <View className="w-full flex-row items-center gap-2">
          <Icon icon={Phone} className="text-white-500" />

          <Text
            numberOfLines={1}
            className="truncate font-BeVietnamRegular text-white-700"
          >
            {lodging.phone_contact
              ? formatPhone(lodging.phone_contact)
              : reference.undefined.name}
          </Text>
        </View>

        <View className="w-full flex-row items-center gap-2">
          <Icon icon={Email} className="text-white-500" />

          <Text
            numberOfLines={1}
            className="truncate font-BeVietnamRegular text-white-700"
          >
            {lodging.email_contact ?? reference.undefined.name}
          </Text>
        </View>
      </View>

      <Divide className="h-0.25 bg-white-100" />

      {/* Info Owner */}
      <View className="flex-row gap-3 items-center">
        {errorAvatar ? (
          <View className="bg-white-200 p-2 rounded-full">
            <Icon icon={User} className="text-white-500" />
          </View>
        ) : (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${lodging.user?.full_name}&background=random&color=random`,
            }}
            onError={() => setErrorAvatar(true)}
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
        )}

        <View className="flex-1 gap-1">
          <Text
            numberOfLines={1}
            className="font-BeVietnamMedium text-mineShaft-950 truncate"
          >
            {lodging.user?.full_name ?? reference.undefined.name}
          </Text>
          {lodging.user?.email && (
            <Text
              numberOfLines={1}
              className="truncate text-12 font-BeVietnamRegular text-white-700"
            >
              {lodging.user?.email}
            </Text>
          )}

          {lodging.user?.phone && (
            <Text
              numberOfLines={1}
              className="truncate text-12 font-BeVietnamRegular text-white-700"
            >
              {formatPhone(lodging.user?.phone)}
            </Text>
          )}
        </View>
      </View>

      {lodging.deleted_at && (
        <Button
          onPress={restore}
          disabled={loading}
          loading={loading}
          className="border-1 w-full rounded-lg border-lime-300 gap-2 py-2"
        >
          <View>
            <Icon icon={RotateLeft} className="text-lime-600" />
          </View>
          <Text className="font-BeVietnamRegular text-lime-600">Khôi phục</Text>
        </Button>
      )}
    </Button>
  );
};

const LodgingEmpty = () => {
  return (
    <View className="items-center gap-9">
      <View className="p-6 bg-white-50 rounded-full shadow-md shadow-black/10">
        <View className="p-9 rounded-full bg-mineShaft-50 border-4 border-mineShaft-100">
          <View className="p-9 bg-white-50 rounded-full shadow-md shadow-black/10">
            <View className="bg-mineShaft-950 p-4 rounded-full">
              <Icon icon={Home2} strokeWidth={2} />
            </View>
          </View>
        </View>
      </View>
      <View className="items-center gap-2 px-8">
        <Text className="font-BeVietnamBold text-16 text-mineShaft-900">
          Không tìm thấy nhà trọ phù hợp
        </Text>
        <Text className="font-BeVietnamRegular text-14 text-center text-mineShaft-400">
          Hãy thử thay đổi bộ lọc hoặc kiểm tra lại kết nối mạng.
        </Text>
      </View>
    </View>
  );
};

function FilterModal() {
  const { setFilterLodging, filterLodging, filter, resetFilter } =
    useLodgingStore();
  const { hideModal } = useUI();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [lodgingType, setLodgingType] = useState<ILodgingType | null>(null);
  const { lodgingTypes, list } = useLodgingTypeStore();

  useEffect(() => {
    if (lodgingTypes.length <= 0) {
      list();
    }
  }, []);

  const handleFilter = useCallback(async () => {
    setLoading(true);
    if (name) {
      setFilterLodging("name", name);
    }
    if (address) {
      setFilterLodging("address", address);
    }

    await filter();
    setLoading(false);
    hideModal();
  }, [filterLodging, address, name]);

  useEffect(() => {
    setAddress(filterLodging.address ?? "");
    setName(filterLodging.name ?? "");
  }, [filterLodging]);

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
          {/* <Dropdown
            required
            options={lodgingTypes}
            value={lodgingType}
            optionKey="name"
            placeHolder="Chọn loại hình cho thuê"
            label="Loại hình cho thuê"
            onChange={(option) => setLodgingType(option)}
            loading={loading}
            compareKey="id"
          /> */}

          <Input
            label="Tên nhà cho thuê"
            value={name}
            onChange={(value) => setName(value)}
            type="text"
          />

          <Input
            label="Địa chỉ"
            value={address}
            onChange={(value) => setAddress(value)}
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
          disabled={loading}
          className="bg-white-50 border-1 border-redPower-300 p-2"
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
  const {
    lodgings,
    totalPages,
    currentPage,
    changePage,
    switchTrash,
    isTrash,
  } = useLodgingStore();
  const list = useLodgingStore.getState().list;
  const [loading, setLoading] = useState(false);
  const localStorage = new LocalStorage();
  const path = usePathname();
  const status = useMemo(async () => {
    let permission = await localStorage.getItem("permissionMap");

    if (!permission) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      await localStorage.setItem("permissionMap", status);
      return status;
    } else {
      return permission as Location.PermissionStatus;
    }
  }, []);

  useEffect(() => {
    setSidebar(path as Href);
  }, [path]);

  const handleListLodging = useCallback(() => {
    setLoading(true);
    list();
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleListLodging();
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
        <HeaderOpenSidebar title="Nhà cho thuê" />

        <View className="px-3 py-2 flex-row  justify-between">
          <Button
            className="bg-lime-500 py-1 px-3 rounded-xl gap-2"
            onPress={openFilter}
          >
            <Icon icon={FilterSearch} className="text-white-50" />
            <Text className="font-BeVietnamRegular text-white-50">Bộ lọc</Text>
          </Button>

          <Button
            className="bg-white-50 border-1 border-redPower-300 py-1 px-3  rounded-xl gap-2"
            onPress={() => switchTrash(!isTrash)}
          >
            <Icon icon={Trash} className="text-redPower-600" />
            <Text className="font-BeVietnamRegular text-redPower-600">
              Thùng rác
            </Text>
          </Button>
        </View>

        <ViewHasButtonAdd
          onPressAdd={() => router.push("/lodging/create" as Href)}
          className=""
        >
          {!loading && lodgings.length <= 0 ? (
            <View className="flex-1 items-center justify-center">
              <LodgingEmpty />
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
                  ? Array(2)
                      .fill(0)
                      .map((_, index) => <LodgingCardSkeleton key={index} />)
                  : lodgings.length > 0 &&
                    lodgings.map((lodging) => (
                      <LodgingCard
                        status={status}
                        key={lodging.id}
                        lodging={lodging}
                      />
                    ))}
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
