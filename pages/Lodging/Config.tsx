import Box from "@/ui/Box";
import { ScrollView, View } from "react-native";
import React from "react";
import { BoxPaymentTimeBill } from "@/ui/layout/BoxPaymentTimeBill";
import { BoxRetailInfo } from "./BoxRetailInfo";
import BoxOptions from "./BoxOptions";

const Config: React.FC<{
  areaRoom: string;
  priceRoom: string;
  setAreaRoom: (area: string) => void;
  setPriceRoom: (price: string) => void;
  paymentDate: number;
  lateDays: number;
  setPaymentDate: (paymentDate: number) => void;
  setLateDays: (lateDays: number) => void;
  isEnabled: boolean; 
  setIsEnabled: (isEnabled: boolean) => void; 
}> = ({
  areaRoom,
  priceRoom,
  setAreaRoom,
  setPriceRoom,
  lateDays,
  paymentDate,
  setLateDays,
  setPaymentDate,
  isEnabled,
  setIsEnabled,
}) => {
  return (
      <>
        <BoxRetailInfo
          {...{ areaRoom, priceRoom, setAreaRoom, setPriceRoom }}
        />
        <BoxPaymentTimeBill
          {...{ lateDays, paymentDate, setLateDays, setPaymentDate }}
        />

        <BoxOptions {...{isEnabled,setIsEnabled}}/>
      </>
  );
};

export default Config;
