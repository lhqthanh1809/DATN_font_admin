import { ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import ILocation from "@/interfaces/LocationInterface";
import { ILodgingType } from "@/interfaces/LodgingInterface";
import { BoxInfo } from "./BoxInfo";
import { BoxLocation } from "./BoxLocation";
import { BoxOwner } from "./BoxOwner";
import { IUser } from "@/interfaces/UserInterface";

const InfoAndLocation: React.FC<
  ILocation & {
    lodgingType: ILodgingType | null;
    setLodgingType: (type: ILodgingType | null) => void;
    setOpenMap: (openMap: boolean) => void;
    name: string;
    setName: (name: string) => void;

    owner: IUser | null;
    setOwner: (user: IUser) => void;
    phoneContact: string; 
    setPhoneContact: (phone: string) => void;
    emailContact: string; 
    setEmailContact: (email: string) => void; 
  }
> = ({
  setLodgingType,
  lodgingType,
  setOpenMap,
  province,
  district,
  ward,
  location,
  setDistrict,
  setProvince,
  setStreet,
  setWard,
  street,
  name,
  setName,
  owner,
  setOwner,
  phoneContact, 
  setPhoneContact,
  emailContact, 
  setEmailContact, 
}) => {
  
  return (
      <>
        <BoxInfo
          {...{
            emailContact,phoneContact,setEmailContact,setPhoneContact,
            name,
            setName,
            setLodgingType,
            lodgingType,
          }}
        />

        <BoxOwner {...{owner,setOwner}}/>
        <BoxLocation
          {...{
            setDistrict,
            setProvince,
            setWard,
            setStreet,
            district,
            province,
            ward,
            street,
            setOpenMap,
            location,
          }}
        />
      </>
  );
};

export default InfoAndLocation;
