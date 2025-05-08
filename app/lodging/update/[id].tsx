import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Location from "expo-location";
import MapEdit from "@/pages/Lodging/MapEdit";
import InfoAndLocation from "@/pages/Lodging/InfoAndLocation";
import Config from "@/pages/Lodging/Config";
import { IMap } from "@/interfaces/MapInterface";
import { cn, formatNumber } from "@/helper/helper";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { ILodging, ILodgingType } from "@/interfaces/LodgingInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import Layout from "@/ui/layout/Layout";
import useLodgingStore from "@/store/lodging/useLodgingStore";
import { IUser } from "@/interfaces/UserInterface";

function CreateLodging() {
  //Initial
  const { id } = useLocalSearchParams();
  const { update, loading, lodgings } = useLodgingStore();
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const [lodgingType, setLodgingType] = useState<ILodgingType | null>(null);
  const [province, setProvince] = useState<LocationUnit | null>(null);
  const [district, setDistrict] = useState<LocationUnit | null>(null);
  const [ward, setWard] = useState<LocationUnit | null>(null);

  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState<IMap | null>(null); // The selected location
  const [locationCurrent, setLocationCurrent] = useState<IMap | null>(null); // The area displayed when editing the location
  const [region, setRegion] = useState<IMap | null>(location);

  const [viewIndex, setViewIndex] = useState(0);
  const [owner, setOwner] = useState<IUser | null>(null);

  // Callback
  const handleOpenMap = useCallback(
    (openMap: boolean) => {
      setOpenMap(openMap);
    },
    [openMap]
  );

  // This function handles the selection of a location and updates the current location state.
  const handleSelectLocation = useCallback(() => {
    setLocationCurrent(location);
    setOpenMap(false);
  }, [location, locationCurrent]);

  // Xử lý tạo nhà trọ
  const handleUpdateLodging = useCallback(async () => {
    if (!lodging) return;
    const dataReq: ILodging = {
      ...lodging,
      type_id: lodgingType?.id ?? 0,
      province_id: province?.id ?? null,
      district_id: district?.id ?? null,
      ward_id: ward?.id ?? null,
      latitude: location?.latitude?.toString() ?? null,
      longitude: location?.longitude?.toString() ?? null,
      user_id: owner?.id ?? "",
    };

    const result = await update(dataReq);

    if (!result) {
      const newLodging = lodgings.find((item) => item.id == id) ?? null;
      setLodging(newLodging ? { ...newLodging } : null);
    }
  }, [lodgingType, district, province, ward, location, owner, lodging]);

  const handleNextView = useCallback(() => {
    if (viewIndex < view.length - 1) {
      setViewIndex((prev) => ++prev);
      return;
    }

    handleUpdateLodging();
  }, [viewIndex, handleUpdateLodging]);

  const handleBackView = useCallback(() => {
    if (viewIndex){
      setViewIndex((prev) => {
        return --prev;
      });
      return;
    }

      
    router.back();
  }, [viewIndex]);

  const setFieldLodging = useCallback(
    (field: keyof ILodging, value: ILodging[keyof ILodging]) => {
      setLodging((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    []
  );

  // Effect
  useEffect(() => {
    setLodging(lodgings.find((item) => item.id == id) ?? null);
  }, [id, lodgings]);

  useEffect(() => {
    const openMap = async () => {
      if (locationCurrent) {
        setLocation(locationCurrent);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // If permission to access location is not granted, close the map
        setOpenMap(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    // Open the map if the openMap state is true
    if (openMap) {
      openMap();
    }
  }, [openMap]);

  useEffect(() => {
    if (location) {
      setRegion(location);
    }
  }, [location]);

  useEffect(() => {
    if (!lodging) return;

    setOwner(lodging.user ?? owner);
    setLodgingType(lodging.type ?? lodgingType);
    setProvince(lodging.province ?? province);
    setDistrict(lodging.district ?? district);
    setWard(lodging.ward ?? ward);

    if (lodging.latitude && lodging.longitude) {
      const location: IMap = {
        latitude: parseFloat(lodging.latitude),
        longitude: parseFloat(lodging.longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(location);
      setLocationCurrent(location);
    }
  }, [lodging]);

  //Memo
  const view = useMemo(
    () => [
      <InfoAndLocation
        {...{
          province,
          district,
          ward,
          owner,
          lodgingType,
          setLodgingType,
          setDistrict,
          setProvince,
          setWard,
          setOwner,

          setOpenMap: handleOpenMap,
          location: location,

          emailContact: lodging?.email_contact ?? "",
          phoneContact: lodging?.phone_contact ?? "",
          name: lodging?.name ?? "",
          street: lodging?.address ?? "",

          setEmailContact: (value) => setFieldLodging("email_contact", value),
          setPhoneContact: (value) => setFieldLodging("phone_contact", value),
          setName: (value) => setFieldLodging("name", value),
          setStreet: (value) => setFieldLodging("address", value),
        }}
      />,
      <Config
        {...{
          priceRoom: String(lodging?.price_room_default ?? ""),
          areaRoom: String(lodging?.area_room_default ?? ""),
          isEnabled: lodging?.is_enabled ?? true,
          lateDays: lodging?.late_days ?? 5,
          paymentDate: lodging?.payment_date ?? 5,

          setAreaRoom: (value) => setFieldLodging("area_room_default", value),
          setPriceRoom: (value) => setFieldLodging("price_room_default", value),
          setIsEnabled: (value) => setFieldLodging("is_enabled", value),
          setLateDays: (value) => setFieldLodging("late_days", value),
          setPaymentDate: (value) => setFieldLodging("payment_date", value),
        }}
      />,
    ],
    [province, district, ward, locationCurrent, lodgingType, owner, lodging]
  );

  return (
    <View className="flex-1">
      <Layout title={"Cập nhật thông tin nhà cho thuê"}>
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            {view[viewIndex]}
          </View>
        </ScrollView>

        <View className="bg-white-50 relative">
          <View className="p-3 gap-2 ">
            <View className="flex-row flex gap-1">
              {view.map((_, index) => {
                return (
                  <Divide
                    key={index}
                    direction="horizontal"
                    className={cn(
                      "h-2 flex-1 border-1",
                      index <= viewIndex
                        ? "border-transparent bg-lime-400"
                        : "bg-white-50 border-mineShaft-200"
                    )}
                  />
                );
              })}
            </View>
            <View className="flex-row flex gap-1 ">
              <Button
                disabled={loading}
                onPress={handleBackView}
                className="flex-1 bg-white-50 border-1 border-mineShaft-200 py-4"
              >
                <Text className="text-mineShaft-950 text-16 font-BeVietnamSemiBold">
                  {viewIndex == view.length - 1 ? "Quay lại" : "Đóng trang"}
                </Text>
              </Button>
              <Button
                disabled={loading}
                loading={loading}
                onPress={handleNextView}
                className="flex-1 bg-mineShaft-950 py-4"
                classNameLoading="text-white-50"
              >
                <Text className="text-white-50 text-16 font-BeVietnamSemiBold">
                  {viewIndex == view.length - 1 ? "Cập nhật" : "Tiếp theo"}
                </Text>
              </Button>
            </View>
          </View>
          <View className="bg-white-50 h-5 w-5 absolute bottom-full">
            <View className="absolute h-5 w-5 rounded-bl-full bg-mineShaft-50"></View>
          </View>
          <View className="bg-white-50 h-5 w-5 absolute bottom-full right-0">
            <View className="absolute h-5 w-5 rounded-br-full bg-mineShaft-50"></View>
          </View>
        </View>
      </Layout>
      {location && region && openMap && (
        <MapEdit
          {...{
            location,
            region,
            handleSelectLocation,
            setRegion,
            setLocation,
            setOpenMap,
          }}
        />
      )}
    </View>
  );
}

export default CreateLodging;
