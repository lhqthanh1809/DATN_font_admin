import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import { View } from "react-native";
import React, { useCallback } from "react";
import Input from "@/ui/Input";
import Dropdown from "@/ui/Dropdown";
import Scan from "@/ui/Scan";
import { convertStringToDate } from "@/helper/helper";
import { User } from "@/ui/icon/symbol";

interface BoxInfoProps {
  name: string;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone?: React.Dispatch<React.SetStateAction<string>>;
  birthDay: Date | null;
  setBirthDay?: React.Dispatch<React.SetStateAction<Date | null>>;
  address: string;
  setAddress?: React.Dispatch<React.SetStateAction<string>>;
  identityCard: string;
  setIdentityCard?: React.Dispatch<React.SetStateAction<string>>;
  genders: { name: string; value: boolean }[];
  gender: { name: string; value: boolean } | null; 
  setGender?: React.Dispatch<
    React.SetStateAction<{ name: string; value: boolean } | null> 
  >;

  email: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;

  disabled?: (
    | "address"
    | "name"
    | "phone"
    | "birthday"
    | "id_card"
    | "gender"
    | "email"
  )[];
}

const BoxInfo = ({
  name,
  phone,
  birthDay,
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
  disabled = [],
}: BoxInfoProps) => {
  const handleDataScanner = useCallback((dataScanner: string) => {
    if (dataScanner) {
      const data = dataScanner.split("|");
      if (setIdentityCard) setIdentityCard((prev) => (data[0] !== prev ? data[0] : prev));
      if (setName) setName((prev) => (data[2] !== prev ? data[2] : prev));
      if (setAddress) setAddress((prev) => (data[5] !== prev ? data[5] : prev));
      if (setBirthDay) {
        const newDate = convertStringToDate(data[3]);
        setBirthDay((prev) => newDate && newDate !== prev ? newDate : prev);
      }
      if (setGender) {
        setGender((prev) => genders.find((item) => item.name === data[4]) ?? prev);
      }
    }
  }, [genders, setBirthDay, setGender, setIdentityCard, setName, setAddress]);

  return (
    <Box title="Thông tin cá nhân" icon={User}>
      <Input
        value={identityCard}
        disabled={disabled.includes("id_card")}
        onChange={(value) => setIdentityCard && setIdentityCard(value)}
        required
        label="Căn cước công dân"
        type="code"
        suffix={<Scan onChange={handleDataScanner} />}
      />

      <Input
        required
        disabled={disabled.includes("name")}
        label="Họ tên người dùng"
        placeHolder="Nhập họ tên người dùng"
        value={name}
        onChange={(value) => setName && setName(value)}
      />

      <Input
        required
        disabled={disabled.includes("phone")}
        label="Số điện thoại"
        placeHolder="Số điện thoại"
        value={phone}
        onChange={(value) => setPhone && setPhone(value)}
        type="phone"
      />

      <Input
        disabled={disabled.includes("email")}
        label="Email"
        placeHolder="Email"
        value={email}
        onChange={(value) => setEmail && setEmail(value)}
        type="text"
      />

      <Dropdown
        value={gender}
        disabled={disabled.includes("gender")}
        onChange={(option) => {
          if (setGender) setGender(option);
        }}
        hasSearch={false}
        className="z-20"
        options={genders}
        optionKey="name"
        label="Giới tính"
      />

      <DatePicker
        value={birthDay}
        disabled={disabled.includes("birthday")}
        onChange={(date) => setBirthDay && setBirthDay(date)}
        label="Ngày sinh"
      />

      <Input
        disabled={disabled.includes("address")}
        value={address}
        onChange={(value) => setAddress && setAddress(value)}
        label="Địa chỉ"
      />
    </Box>
  );
};

export default BoxInfo;
