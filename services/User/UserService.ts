import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "../BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";
import { IUnit } from "@/interfaces/UnitInterface";
import { ICreateUser, IListUser, IUser } from "@/interfaces/UserInterface";
import { IListResponse } from "@/interfaces/GeneralInterface";

export default class UserService extends BaseService {
  public async update(data: IUser): Promise<IUser | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.updateUser,
        method: "POST",
        body: data,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async list(data: IListUser, cancelToken?: any): Promise<IListResponse<IUser> | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listUser,
        method: "POST",
        ...{cancelToken},
        body: data,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return ((res as IResponse).body as IListResponse<IUser>) || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }
  public async delete(userId: string): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.deleteUser.replace(":id", userId),
        method: "DELETE",
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async detail(userId: string): Promise<IUser | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.detailUser.replace(":id", userId),
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }


  public async create(data: ICreateUser): Promise<IUser | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.createUser,
        method: "POST",
        body: data,
        authentication_requested: true,
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
