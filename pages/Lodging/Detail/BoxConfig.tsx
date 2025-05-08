import { reference } from "@/assets/reference";
import { convertToNumber, formatNumber, formatPhone } from "@/helper/helper";
import { ILodging } from "@/interfaces/LodgingInterface";
import { IMap } from "@/interfaces/MapInterface";
import { LocalStorage } from "@/services/LocalStorageService";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import Phone from "@/ui/icon/active/phone";
import { Money } from "@/ui/icon/finance";
import { Calender, Email, FormatSquare, Time, User } from "@/ui/icon/symbol";
import Map from "@/ui/Map";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

const BoxConfig: React.FC<{
  lodging: ILodging | null;
}> = ({ lodging }) => {
  const localStorage = new LocalStorage();
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null);

  const location: IMap = useMemo(() => {
    return {
      latitude: Number(lodging?.latitude) || 0,
      longitude: Number(lodging?.longitude) || 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [lodging]);

  useEffect(() => {
    const getStatus = async () => {
      let permission = await localStorage.getItem("permissionMap");
      if (!permission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        await localStorage.setItem("permissionMap", status);
        setStatus(status);
      } else {
        setStatus(permission as Location.PermissionStatus);
      }
    };

    getStatus();
  }, []);
  return (
    <>
      {/* Payment info */}
      <Button className="rounded-xl bg-white-50 shadow-soft-xs p-4 gap-4 items-start flex-col">
        <View className="flex-1">
          <Text className="font-BeVietnamSemiBold text-14">
            Thông tin thanh toán định kì
          </Text>
        </View>

        <View className="flex-row gap-2 items-center">
          <View className="flex-1 flex-row items-center gap-2">
            <Icon icon={Calender} className="text-white-800" />

            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-800"
            >
              Ngày thanh toán
            </Text>
          </View>

          <Text
            numberOfLines={1}
            className="truncate font-BeVietnamMedium text-mineShaft-950"
          >
           {`Ngày ${lodging?.payment_date} hằng tháng`}
          </Text>
        </View>

        <View className="flex-row gap-2 items-center">
          <View className="flex-1 flex-row items-center gap-2">
            <Icon icon={Time} className="text-white-800" />

            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-800"
            >
              Hạn thanh toán
            </Text>
          </View>

          <Text
            numberOfLines={1}
            className="truncate font-BeVietnamMedium text-lime-600"
          >
           {`${lodging?.late_days} ngày`}
          </Text>
        </View>
      </Button>

      {/* Chủ sở hữu */}
      <Button className="rounded-xl bg-white-50 shadow-soft-xs p-4 gap-4 items-start flex-col">
        <View className="flex-1">
          <Text className="font-BeVietnamSemiBold text-14 text-mineShaft-950">
            Cấu hình phòng mặc định
          </Text>
        </View>

        <View className="flex-row gap-2 items-center">
          <View className="flex-1 flex-row items-center gap-2">
            <Icon icon={FormatSquare} className="text-white-800" />

            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-800"
            >
              Diện tích phòng
            </Text>
          </View>

          <Text
            numberOfLines={1}
            className="truncate font-BeVietnamMedium text-mineShaft-950"
          >
           {`${convertToNumber((lodging?.area_room_default ?? 0).toString())} m\u00B2`}
          </Text>
        </View>

        <View className="flex-row gap-2 items-center">
          <View className="flex-1 flex-row items-center gap-2">
            <Icon icon={Money} className="text-white-800" />

            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-800"
            >
              Giá phòng
            </Text>
          </View>

          <Text
            numberOfLines={1}
            className="truncate font-BeVietnamMedium text-lime-600"
          >
           {`${convertToNumber((lodging?.price_room_default ?? 0).toString())} đ`}
          </Text>
        </View>
      </Button>
    </>
  );
};

export default BoxConfig;
