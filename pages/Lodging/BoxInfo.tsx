import { ILodgingType } from "@/interfaces/LodgingInterface";
import useLodgingTypeStore from "@/store/lodging/lodgingType/useLodgingTypeStore";
import Box from "@/ui/Box";
import Dropdown from "@/ui/Dropdown";
import { Home } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import { useEffect } from "react";
import React from "react";

const BoxInfo: React.FC<{
  lodgingType: ILodgingType | null;
  setLodgingType: (type: ILodgingType | null) => void;
  name: string;
  setName: (name: string) => void;
  phoneContact: string;
  setPhoneContact: (phone: string) => void;
  emailContact: string;
  setEmailContact: (email: string) => void;
}> = ({
  setLodgingType,
  lodgingType,
  name,
  setName,
  phoneContact,
  setPhoneContact,
  emailContact,
  setEmailContact,
}) => {
  const { lodgingTypes, list, loading } = useLodgingTypeStore();

  useEffect(() => {
    if (lodgingTypes.length <= 0) {
      list();
    }
  }, []);

  useEffect(() => {
    if (lodgingTypes.length > 0) {
      setLodgingType(
        lodgingTypes.find((type) => type.id === lodgingType?.id) ||
          lodgingTypes[0]
      );
    } else {
      setLodgingType(null);
    }
  }, [lodgingTypes]);

  return (
    <Box
      title="Thông tin nhà cho thuê"
      description="Thông tin cơ bản tên, loại hình,..."
      icon={Home}
      className="z-10"
    >
      <Dropdown
        required
        options={lodgingTypes}
        value={lodgingType}
        optionKey="name"
        placeHolder="Chọn loại hình cho thuê"
        label="Loại hình cho thuê"
        onChange={(option) => setLodgingType(option)}
        loading={loading}
        compareKey="id"
      />
      {!loading && lodgingType && (
        <Input
          required
          value={name}
          onChange={setName}
          label={`Tên ${lodgingType?.name.toLocaleLowerCase()}`}
        />
      )}

      <Input
        value={phoneContact}
        onChange={setPhoneContact}
        label={`Số điện thoại nhà cho thuê`}
      />
      <Input
        value={emailContact}
        onChange={setEmailContact}
        label={`Email nhà cho thuê`}
      />
    </Box>
  );
};

export { BoxInfo };
