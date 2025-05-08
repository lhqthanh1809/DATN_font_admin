import BoxInfo from "@/pages/User/BoxInfo";
import BoxSecurity from "@/pages/User/BoxSecurity";
import BoxOptions from "@/pages/User/BoxOptions";
import useUserStore from "@/store/user/useUserStore";
import Button from "@/ui/Button";
import Layout from "@/ui/layout/Layout";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ICreateUser, IUser } from "@/interfaces/UserInterface";
import { encrypt, formatDateForRequest } from "@/helper/helper";
import { router, useLocalSearchParams } from "expo-router";
import { useUI } from "@/hooks/useUI";
import ModalDelete from "@/ui/layout/ModalDelete";
import UserService from "@/services/User/UserService";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import { BlurView } from "expo-blur";
import LoadingAnimation from "@/ui/LoadingAnimation";
import LoadingScreen from "@/ui/layout/LoadingScreen";

function Detail() {
  const { id } = useLocalSearchParams();
  const { addToast } = useToastStore();
  const { showModal, hideModal } = useUI();
  const { users, loading, genders, delete: deleteUser } = useUserStore();
  const [loadingUser, setLoadingUser] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [gender, setGender] = useState<{ name: string; value: boolean } | null>(
    null
  );
  const [birthDay, setBirthDay] = useState<Date | null>(null);

  const handleDeleteUser = useCallback(async () => {
    const result = await deleteUser(id as string);
    if (result) {
      router.back();
    }
  }, [deleteUser, id]);

  const openDeleteModal = useCallback(() => {
    showModal(
      <ModalDelete
        handleConfirmDelete={handleDeleteUser}
        title="Xác nhận xoá người dùng?"
        subTitle="Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn. Tiếp tục?"
      />
    );
  }, [user, id, handleDeleteUser]);

  const fetchUser = useCallback(async () => {
    setLoadingUser(true);
    try {
      const result = await new UserService().detail(id as string);
      if (result && "message" in result) {
        throw new Error(result.message);
      }

      setUser(result);
    } catch (err: any) {
      addToast(constant.toast.type.error, err.message || "An error occurred");
    } finally {
      setLoadingUser(false);
    }
  }, [id]);

  useEffect(() => {
    const user = users.find((item) => item.id == id);
    if (user) {
      setUser(user);
    } else {
      fetchUser();
    }
  }, [users, id]);

  useEffect(() => {
    setGender(genders.find((item) => item.value == user?.gender) ?? null);
    setBirthDay(user?.date_of_birth ? new Date(user?.date_of_birth) : birthDay);
  }, [user]);

  return (
    <Layout title="Chi tiết người dùng">
      {loading && <LoadingScreen />}
      <ScrollView className="flex-1 p-3 bg-white-50">
        <View className="gap-2">
          <BoxInfo
            {...{
              name: user?.full_name ?? "",
              phone: user?.phone ?? "",
              birthDay: birthDay,
              address: user?.address ?? "",
              identityCard: user?.identity_card ?? "",
              genders,
              gender,
              email: user?.email ?? "",
              disabled: [
                "address",
                "birthday",
                "email",
                "gender",
                "id_card",
                "name",
                "phone",
              ],
            }}
          />

          <BoxOptions
            active={user?.is_active ?? false}
            completed={user?.is_completed ?? false}
          />
        </View>
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
              Xoá người dùng
            </Text>
          </Button>
          <Button
            disabled={loading}
            loading={loading}
            onPress={() => {
              router.replace(`/user/update/${id}`);
            }}
            className="flex-1 bg-lime-400 py-4"
          >
            <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
              Chỉnh sửa
            </Text>
          </Button>
        </View>
      </View>
    </Layout>
  );
}

export default Detail;
