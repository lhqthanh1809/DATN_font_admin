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
import { useRouter } from "expo-router";
import { ILodging, ILodgingType } from "@/interfaces/LodgingInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import Layout from "@/ui/layout/Layout";
import useLodgingStore from "@/store/lodging/useLodgingStore";
import { IUser } from "@/interfaces/UserInterface";

function CreateLodging() {
  //Initial
  const route = useRouter();
  const { create, loading } = useLodgingStore();
  const [lodgingType, setLodgingType] = useState<ILodgingType | null>(null);
  const [province, setProvince] = useState<LocationUnit | null>(null);
  const [district, setDistrict] = useState<LocationUnit | null>(null);
  const [ward, setWard] = useState<LocationUnit | null>(null);
  const [street, setStreet] = useState<string>("");
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState<IMap | null>(null); // Vị trí mặc định
  const [locationCurrent, setLocationCurrent] = useState<IMap | null>(null); // Vị trí hiện tại được chọn
  const [region, setRegion] = useState<IMap | null>(location);
  const [viewIndex, setViewIndex] = useState(0);
  const [name, setName] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState(5);
  const [lateDays, setLateDays] = useState(5);
  const [areaRoom, setAreaRoom] = useState<string>("");
  const [priceRoom, setPriceRoom] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [owner, setOwner] = useState<IUser | null>(null);
  const [phoneContact, setPhoneContact] = useState<string>("");
  const [emailContact, setEmailContact] = useState<string>("");

  // Callback
  const handleOpenMap = useCallback(
    (openMap: boolean) => {
      setOpenMap(openMap);
    },
    [openMap]
  );

  const handleSelectLocation = useCallback(() => {
    setLocationCurrent(location);
    setOpenMap(false);
  }, [location, locationCurrent]);

  // Xử lý tạo nhà trọ
  const handleCreateLodging = useCallback(async () => {
    const dataReq: ILodging = {
      name,
      type_id: lodgingType?.id ?? 0,
      province_id: province?.id ?? null,
      district_id: district?.id ?? null,
      ward_id: ward?.id ?? null,
      address: street ?? null,
      latitude: location?.latitude?.toString() ?? null,
      longitude: location?.longitude?.toString() ?? null,
      late_days: lateDays,
      payment_date: paymentDate,
      area_room_default: formatNumber(areaRoom, "float"),
      price_room_default: formatNumber(priceRoom, "float"),
      user_id: owner?.id ?? "",
      is_enabled: isEnabled,
      phone_contact: phoneContact || null,
      email_contact: emailContact || null,
    };

    const result = await create(dataReq);
    if(result){
      setName("")
      setPhoneContact(""),
      setEmailContact("")
      setIsEnabled(true),
      setLateDays(5),
      setPaymentDate(5),
      setStreet("")
      setPriceRoom("")
      setAreaRoom("")
    }

  }, [
    lodgingType,
    district,
    province,
    ward,
    street,
    location,
    name,
    lateDays,
    paymentDate,
    areaRoom,
    priceRoom,
    isEnabled,
    emailContact,
    phoneContact,
    owner,
  ]);

  const handleNextView = useCallback(() => {
    if (viewIndex < view.length - 1) {
      setViewIndex((prev) => ++prev);
      return;
    }

    handleCreateLodging();
  }, [viewIndex, handleCreateLodging]);

  const handleBackView = useCallback(() => {
    if (viewIndex)
      setViewIndex((prev) => {
        return --prev;
      });
    else route.back();
  }, [viewIndex]);

  // Effect
  useEffect(() => {
    const openMap = async () => {
      if (locationCurrent) {
        setLocation(locationCurrent);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Nếu không được cấp quyền truy cập vị trí đóng map
        setOpenMap(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    if (openMap) {
      openMap();
    }
  }, [openMap]);

  useEffect(() => {
    if (location) {
      setRegion(location);
    }
  }, [location]);

  //Memo
  const view = useMemo(
    () => [
      <InfoAndLocation
        {...{
          emailContact,phoneContact,setEmailContact,setPhoneContact,
          name,
          setName,
          province,
          district,
          ward,
          setOpenMap: handleOpenMap,
          location: locationCurrent,
          lodgingType,
          setLodgingType,
          setDistrict,
          setProvince,
          setStreet,
          setWard,
          street,
          owner,
          setOwner,


        }}
      />,
      <Config
        {...{
          isEnabled,
          setIsEnabled,
          areaRoom,
          priceRoom,
          setAreaRoom,
          setPriceRoom,
          lateDays,
          paymentDate,
          setLateDays,
          setPaymentDate,
        }}
      />,
    ],
    [
      province, district, ward, street,
      handleOpenMap,
      locationCurrent,
      lodgingType,
      setLodgingType, setDistrict, setProvince, setStreet, setWard,
      name,
      setName,
      paymentDate,
      setPaymentDate,
      lateDays,
      setLateDays,
      areaRoom,
      setAreaRoom,
      priceRoom,
      setPriceRoom,
      isEnabled,
      setIsEnabled,
      owner,
      setOwner,
      phoneContact, emailContact,
      setPhoneContact, setEmailContact
    ]
  );

  return (
    <View className="flex-1">
      <Layout title={"Thêm nhà cho thuê mới"}>
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
                  {viewIndex == view.length - 1 ? "Hoàn thành" : "Tiếp theo"}
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
