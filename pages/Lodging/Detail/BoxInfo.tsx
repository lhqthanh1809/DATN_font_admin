import { reference } from "@/assets/reference";
import { formatPhone } from "@/helper/helper";
import { ILodging } from "@/interfaces/LodgingInterface";
import { IMap } from "@/interfaces/MapInterface";
import { LocalStorage } from "@/services/LocalStorageService";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import Copy from "@/ui/icon/active/copy";
import Phone from "@/ui/icon/active/phone";
import { Email, User } from "@/ui/icon/symbol";
import Map from "@/ui/Map";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";

const BoxInfo: React.FC<{
  lodging: ILodging | null;
}> = ({ lodging }) => {
  const localStorage = new LocalStorage();

  const {addToast} = useToastStore()
  const [errorAvatar, setErrorAvatar] = useState(false);
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null);

  const location: IMap = useMemo(() => {
    return {
      latitude: Number(lodging?.latitude) || 0,
      longitude: Number(lodging?.longitude) || 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [lodging]);

  const copyToClipboard = useCallback(async (value: string) => {
    await Clipboard.setStringAsync(value);
    addToast(
      constant.toast.type.success,
      "Đã copy vào clipboard!"
    );
  }, []);

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
      {/* Info_contact */}
      <Button className="rounded-xl bg-white-50 shadow-soft-xs p-4 gap-4 items-start flex-col">
        <View className="flex-1">
          <Text className="font-BeVietnamSemiBold text-14">
            Thông tin liên lạc
          </Text>
        </View>

        <View className="w-full flex-row items-center gap-2">
          <Icon icon={Phone} className="text-white-500" />

          <View className="flex-1 gap-1">
            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-500 text-12"
            >
              Số điện thoại
            </Text>
            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamMedium text-mineShaft-950"
            >
              {lodging?.phone_contact
                ? formatPhone(lodging.phone_contact)
                : reference.undefined.name}
            </Text>
          </View>
        </View>

        <View className="w-full flex-row items-center gap-2">
          <Icon icon={Email} className="text-white-500" />

          <View className="flex-1 gap-1">
            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-500 text-12"
            >
              Email
            </Text>
            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamMedium text-mineShaft-950"
            >
              {lodging?.email_contact ?? reference.undefined.name}
            </Text>
          </View>
        </View>
      </Button>

      {/* Vị trí */}
      <Button className="rounded-xl bg-white-50 shadow-soft-xs p-4 gap-4 items-start flex-col">
        <View className="flex-1">
          <Text className="font-BeVietnamSemiBold text-14">Vị trí</Text>
        </View>

        {lodging?.latitude &&
          lodging?.longitude &&
          status &&
          status == "granted" && (
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

        <View className="w-full flex-row items-center gap-2">
          <View className="flex-1 gap-1">
            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-500 text-12"
            >
              Vị trí
            </Text>
            <View className="flex-row items-start">
              <View className="flex-1">
                <Text className="truncate font-BeVietnamMedium text-mineShaft-950">
                  {[
                    lodging?.address,
                    lodging?.ward?.prefix
                      ? `${lodging.ward.prefix} ${lodging.ward.name}`
                      : lodging?.ward?.name,
                    lodging?.district?.name,
                    lodging?.province?.name,
                  ]
                    .filter(Boolean)
                    .join(", ") || reference.undefined.name}
                </Text>
              </View>
              <Button
                onPress={() => {
                  copyToClipboard(
                    [
                      lodging?.address,
                      lodging?.ward?.prefix
                        ? `${lodging.ward.prefix} ${lodging.ward.name}`
                        : lodging?.ward?.name,
                      lodging?.district?.name,
                      lodging?.province?.name,
                    ]
                      .filter(Boolean)
                      .join(", ") || reference.undefined.name
                  );
                }}
              >
                <Icon icon={Copy} className="text-lime-400" />
              </Button>
            </View>
          </View>
        </View>
      </Button>

      {/* Chủ sở hữu */}
      <Button className="rounded-xl bg-white-50 shadow-soft-xs p-4 gap-4 items-start flex-col">
        <View className="flex-1">
          <Text className="font-BeVietnamSemiBold text-14">
            Thông tin chủ sở hữu
          </Text>
        </View>

        <View className="gap-4 items-center flex-row">
          {errorAvatar ? (
            <View className="bg-white-200 p-2 rounded-full">
              <Icon icon={User} className="text-white-500" />
            </View>
          ) : (
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${lodging?.user?.full_name}&background=random&color=random`,
              }}
              onError={() => setErrorAvatar(true)}
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
          )}
          <Text
            numberOfLines={1}
            className="font-BeVietnamSemiBold text-mineShaft-950 truncate"
          >
            {lodging?.user?.full_name ?? reference.undefined.name}
          </Text>
        </View>

        {lodging?.user?.phone && (
          <View className="w-full flex-row items-center gap-2">
            <Icon icon={Phone} className="text-white-500" />

            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-700"
            >
              {formatPhone(lodging?.user?.phone)}
            </Text>
          </View>
        )}

        {lodging?.user?.email && (
          <View className="w-full flex-row items-center gap-2">
            <Icon icon={Email} className="text-white-500" />

            <Text
              numberOfLines={1}
              className="truncate font-BeVietnamRegular text-white-700"
            >
              {lodging?.user?.email}
            </Text>
          </View>
        )}
      </Button>
    </>
  );
};

export default BoxInfo;
