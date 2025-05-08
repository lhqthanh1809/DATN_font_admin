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
  isEnabled: boolean; 
  setIsEnabled: (isEnabled: boolean) => void; 
}

const BoxOptions = ({
  isEnabled,
  setIsEnabled,
}: BoxOptionsProps) => {
  return (
    <Box title="Tuỳ chọn" icon={Candle}>
      <Input
        suffixTitle={<Switch value={isEnabled} toggle={(value) => {setIsEnabled(value)}} />}
        label="Trạng thái"
        placeHolder="Chọn trạng thái"
        value={isEnabled ? "Đang hoạt động" : "Không hoạt động"}
        disabled
      />
    </Box>
  );
};

export default BoxOptions;
