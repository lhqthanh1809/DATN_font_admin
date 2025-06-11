import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";

export default class AuthService extends BaseService {
  public async login(data: {
    email: string;
    password: string;
  }): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.loginUser,
        method: "POST",
        body: data,
      });

      console.log(res)
      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.access_token || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async refreshToken() {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.refreshToken,
        authentication_requested: true
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.access_token || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async logout(): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.logoutUser,
        authentication_requested: true
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async requestOTP(email: string): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.requestOtp,
        method: "POST",
        body: {email}
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async verifyOTP(email: string, otp: string): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.verifyOtp,
        method: "POST",
        body: {email, otp}
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async resetPassword(email: string, token: string, password: string): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.resetPassword,
        method: "POST",
        body: {email, token, password}
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }
} 