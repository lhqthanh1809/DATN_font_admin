import { constant } from "@/assets/constant";
import { encrypt, formatDateForRequest } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { useUI } from "@/hooks/useUI";
import { IError } from "@/interfaces/ErrorInterface";
import { IUser } from "@/interfaces/UserInterface";
import BoxInfo from "@/pages/User/BoxInfo";
import BoxOptions from "@/pages/User/BoxOptions";
import BoxSecurity from "@/pages/User/BoxSecurity";
import UserService from "@/services/User/UserService";
import useToastStore from "@/store/toast/useToastStore";
import useUserStore from "@/store/user/useUserStore";
import Button from "@/ui/Button";
import HeaderBack from "@/ui/layout/HeaderBack";
import Layout from "@/ui/layout/Layout";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

const genders = [
  {
    name: "Nam",
    value: false,
  },
  {
    name: "Nữ",
    value: true,
  },
];

function UpdateUser() {
  const { addToast } = useToastStore();
  const { id } = useLocalSearchParams();
  const { showModal, hideModal } = useUI();
  const { users, loading, genders, update } = useUserStore();
  const [user, setUser] = useState<IUser | null>(null);
  const [gender, setGender] = useState<{ name: string; value: boolean } | null>(
    null
  );
  const [birthDay, setBirthDay] = useState<Date | null>(null);
  const [password, setPassword] = useState("");

  const updateField = useCallback((field: string, value: any) => {
    setUser((prev) => (prev ? { ...prev, [field]: value } : null));
  }, []);

  const handleUpdateUser = useCallback(() => {
    if (!user) return;

    const data: IUser = {
      ...user,
      ...(birthDay && { date_of_birth: formatDateForRequest(birthDay) }),
      ...(gender && { gender: gender.value }),
      ...(password && { password: encrypt(password) }),
    };

    update(data);
  }, [user, birthDay, gender, password]);

  useEffect(() => {
    setUser(users.find((item) => item.id == id) ?? null);
  }, [users, id]);

  useEffect(() => {
    setGender(genders.find((item) => item.value == user?.gender) ?? null);
    setBirthDay(user?.date_of_birth ? new Date(user?.date_of_birth) : null);
  }, [user?.date_of_birth, user?.gender]);

  return (
    <View className="flex-1 bg-white-50">
      <Layout title="Cập nhật thông tin người dùng">
        <ScrollView className="flex-1 p-3">
          <View className="gap-2">
            <BoxInfo
              {...{
                name: user?.full_name ?? "",
                phone: user?.phone ?? "",
                birthDay: birthDay,
                setBirthDay,
                address: user?.address ?? "",
                identityCard: user?.identity_card ?? "",
                genders,
                gender,
                setGender,
                email: user?.email ?? "",

                setName: (value) => updateField("full_name", value),
                setPhone: (value) => updateField("phone", value),
                setAddress: (value) => updateField("address", value),
                setEmail: (value) => updateField("email", value),
                setIdentityCard: (value) => updateField("identity_card", value),
              }}
            />

            <BoxSecurity {...{ password, setPassword }} />

            <BoxOptions
              active={user?.is_active ?? false}
              completed={user?.is_completed ?? false}
              setActive={(value) => updateField("is_active", value)}
              setCompleted={(value) => updateField("is_completed", value)}
            />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              disabled={loading}
              loading={loading}
              onPress={handleUpdateUser}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Cập nhật
              </Text>
            </Button>
          </View>
        </View>
      </Layout>
    </View>
  );
}

export default UpdateUser;
