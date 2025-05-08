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
import { User } from "@/ui/icon/symbol";
import { Shield } from "@/ui/icon/security/shield";

interface BoxInfoProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const BoxSecurity = ({
  password,
  setPassword,
}: BoxInfoProps) => {

  return (
    <Box title="Bảo mật" icon={Shield}>

      <Input
        label="Mật khẩu"
        placeHolder="Mật khẩu"
        value={password}
        onChange={(value) => setPassword(value)}
        type="password"
      />
    </Box>
  );
};

export default BoxSecurity;
