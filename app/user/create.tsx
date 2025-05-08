import BoxInfo from "@/pages/User/BoxInfo";
import BoxSecurity from "@/pages/User/BoxSecurity";
import BoxOptions from "@/pages/User/BoxOptions";
import useUserStore from "@/store/user/useUserStore";
import Button from "@/ui/Button";
import Layout from "@/ui/layout/Layout";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ICreateUser } from "@/interfaces/UserInterface";
import { encrypt, formatDateForRequest } from "@/helper/helper";

function Create() {
  const { create, loading, genders } = useUserStore();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<{name:string, value: boolean} | null>(genders[0]);
  const [birthDay, setBirthDay] = useState<Date | null>(new Date());
  const [address, setAddress] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleCreateUser = useCallback(async () => {
    const userData: ICreateUser = {
      full_name: name,
      phone,
      email,
      gender: gender ? gender.value : false,
      date_of_birth: birthDay ? formatDateForRequest(birthDay) : "",
      identity_card: identityCard,
      address,
      password: encrypt(password),
      is_active: isActive,
      is_completed: true
    };

    const result = await create(userData);

    if (result) {
      // Reset all values to default
      setName("");
      setPhone("");
      setEmail("");
      setGender(genders[0]);
      setBirthDay(new Date());
      setAddress("");
      setIdentityCard("");
      setPassword("");
      setIsActive(true);
    }
  }, [name, phone, email, gender, birthDay, address, identityCard, password, isActive, create]);

  return (
    <Layout title="Thêm người dùng">
      <ScrollView className="flex-1 p-3 bg-white-50">
        <View className="gap-2">
          <BoxInfo
            {...{
              name,
              phone,
              birthDay: birthDay, 
              address,
              identityCard,
              genders,
              gender,
              email,
              setName,
              setPhone,
              setBirthDay,
              setAddress,
              setIdentityCard,
              setGender,
              setEmail,
            }}
          />

          <BoxSecurity {...{ password, setPassword }} />
          
          <BoxOptions 
            active={isActive}
            setActive={setIsActive}
          />
        </View>
      </ScrollView>

      <View className="p-3 flex bg-white-50">
        <View className="flex-row">
          <Button
            disabled={loading}
            loading={loading}
            onPress={handleCreateUser}
            className="flex-1 bg-lime-400 py-4"
          >
            <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
              Hoàn thành
            </Text>
          </Button>
        </View>
      </View>
    </Layout>
  );
}

export default Create;
