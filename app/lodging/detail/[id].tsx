import { reference } from "@/assets/reference";
import { cn, formatPhone } from "@/helper/helper";
import { ILodging } from "@/interfaces/LodgingInterface";
import useLodgingStore from "@/store/lodging/useLodgingStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import Phone from "@/ui/icon/active/phone";
import { Email, User } from "@/ui/icon/symbol";
import { PinLarge } from "@/ui/icon/travel";
import Layout from "@/ui/layout/Layout";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import BoxInfo from "@/pages/Lodging/Detail/BoxInfo";
import TabsLine from "@/ui/layout/TabsLine";
import BoxConfig from "@/pages/Lodging/Detail/BoxConfig";
import { useUI } from "@/hooks/useUI";
import ModalDelete from "@/ui/layout/ModalDelete";

function Detail() {
  const { id } = useLocalSearchParams();
  const { showModal, hideModal } = useUI();
  const { lodgings, loading, delete: deleteLodging } = useLodgingStore();

  const [lodging, setLodging] = useState<ILodging | null>(null);

  const handleDeleteLodging = useCallback(async () => {
    const result = await deleteLodging(id as string);
    await hideModal()
    if (result) {
      router.back();
    }
  }, [deleteLodging, id]);

  const openDeleteModal = useCallback(() => {
    showModal(
      <ModalDelete
        handleConfirmDelete={handleDeleteLodging}
        title="Xác nhận xoá nhà cho thuê?"
        subTitle="Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn. Tiếp tục?"
      />
    );
  }, [lodging, id, handleDeleteLodging]);

  useEffect(() => {
    setLodging(lodgings.find((item) => item.id == id) ?? null);
  }, [lodgings, id]);

  const tabs = useMemo(() => {
    return [
      {
        name: "Chi tiết",
        view: <BoxInfo lodging={lodging} />,
      },
      {
        name: "Cấu hình",
        view: <BoxConfig lodging={lodging} />,
      },
    ];
  }, [lodging]);
  const [tab, setTab] = useState(tabs[0]);

  useEffect(() => {
    if (tabs.length > 0) {
      setTab(tabs[0]);
    }
  }, [tabs]);

  return (
    <Layout title="Chi tiết nhà cho thuê">
      <View className="bg-mineShaft-50 flex-1">
        {/* Header */}
        <View className="p-4">
          <View className="rounded-xl items-start bg-white-50 shadow-soft-xs p-4 gap-2">
            <View className="flex-row justify-between items-center gap-4">
              <View className="flex-1">
                <Text className="font-BeVietnamBold text-16">
                  {lodging?.name}
                </Text>
              </View>

              <View
                className={cn(
                  "rounded-full p-2",
                  lodging?.is_enabled ? "bg-lime-400" : "bg-lime-200"
                )}
              >
                <Text className="text-12">
                  <Text
                    className={cn(
                      "font-BeVietnamMedium",
                      lodging?.is_enabled
                        ? "text-white-50"
                        : "text-mineShaft-950 "
                    )}
                  >
                    {lodging?.is_enabled ? "Hoạt động" : "Không hoạt động"}
                  </Text>
                </Text>
              </View>
            </View>

            <View className="p-2 bg-white-100 rounded-md">
              <Text className="text-12 font-BeVietnamMedium text-mineShaft-950">
                {lodging?.type?.name ?? reference.undefined.name}
              </Text>
            </View>
            <View className="w-full flex-row items-center gap-2">
              <Icon icon={PinLarge} className="text-white-500" />

              <View className="flex-1">
                <Text className="font-BeVietnamRegular text-white-700">
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
            </View>
          </View>
        </View>

        <TabsLine
          tabs={tabs}
          active={tab}
          onChange={(tab) => setTab(tab)}
          gap={0}
        />

        <ScrollView className="flex-1 px-4">
          <View className="gap-3 py-3">{tab.view}</View>
        </ScrollView>

        <View className="p-3 flex bg-white-50">
          <View className="flex-row gap-1">
            <Button
              disabled={loading}
              loading={loading}
              onPress={openDeleteModal}
              className="flex-1 bg-redPower-600 py-4"
            >
              <Text className="text-redPower-100 text-16 font-BeVietnamSemiBold">
                Xoá
              </Text>
            </Button>
            <Button
              disabled={loading}
              loading={loading}
              onPress={() => {
                router.replace(`/lodging/update/${id}`);
              }}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Chỉnh sửa
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Layout>
  );
}

export default Detail;
