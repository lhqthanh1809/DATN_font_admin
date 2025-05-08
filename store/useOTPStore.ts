import AuthService from "@/services/Auth/AuthService";
import { create } from "zustand";
import useToastStore from "./toast/useToastStore";
import { constant } from "@/assets/constant";
import * as Yup from "yup";

const otpSchema = Yup.object().shape({
  email: Yup.string().required("Email là bắt buột").email("Email không hợp lệ"),
});

interface IOtpStore{
    email: string,
    token: string,

    setEmail: (value: string) => void,
    setToken: (value: string) => void,

    requestOtp: () => Promise<boolean>
    verifyOtp: (otp: string) => Promise<boolean>
}
const service = new AuthService()
export const useOTPStore = create<IOtpStore>((set, get) => ({
    email: "",
    token: "",
    setEmail: (value) => {
        set({email: value})
    },
    setToken: (value) => {
        set({token: value})
    },

    requestOtp: async() => {
        try {
            await otpSchema.validate({
                email: get().email
            }, { context: { isCreate: true } });
            const result = await service.requestOTP(get().email);

            if (typeof result !== "string") {
                throw new Error(result.message);
            }

            return true;
        } catch (err: any) {
            useToastStore.getState().addToast(constant.toast.type.error, err.message || "An error occurred");
            return false
        }
    },

    verifyOtp: async(otp: string) => {
        try {
            await otpSchema.validate({
                email: get().email
            }, { context: { isCreate: true } });
            const result = await service.verifyOTP(get().email, otp);

            if (typeof result !== "string") {
                throw new Error(result.message);
            }
            set({token: result})
            return true;
        } catch (err: any) {
            useToastStore.getState().addToast(constant.toast.type.error, err.message || "An error occurred");
            return false
        }
    },
}))