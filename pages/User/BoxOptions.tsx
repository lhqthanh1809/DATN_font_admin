import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import { View } from "react-native";
import React, { useCallback, useEffect } from "react";
import Input from "@/ui/Input";
import Divide from "@/ui/Divide";
import Label from "@/ui/Label";
import Dropdown from "@/ui/Dropdown";
import Scan from "@/ui/Scan";
import { convertStringToDate } from "@/helper/helper";
import { Candle, User } from "@/ui/icon/symbol";
import { Shield } from "@/ui/icon/security/shield";
import { MotiView } from "moti";
import Button from "@/ui/Button";
import Switch from "@/ui/Switch";

interface BoxOptionsProps {
  active: boolean;
  setActive?: (value: boolean) => void;

  completed?: boolean;
  setCompleted?: (value: boolean) => void;
}

const BoxOptions = ({
  active,
  setActive,

  completed,
  setCompleted,
}: BoxOptionsProps) => {
  return (
    <Box title="Tuỳ chọn" icon={Candle}>
      <Input
        suffixTitle={<Switch value={active} toggle={(value) => {setActive && setActive(value)}} />}
        label="Trạng thái"
        placeHolder="Chọn trạng thái"
        value={active ? "Đang hoạt động" : "Không hoạt động"}
        disabled
      />

      {typeof completed === "boolean" && (
        <Input
          suffixTitle={<Switch value={completed} toggle={(value) => {setCompleted && setCompleted(value)}} />}
          label="Tình trạng thông tin"
          placeHolder="Chọn trạng thái"
          value={completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
          disabled
        />
      )}
    </Box>
  );
};

export default BoxOptions;
