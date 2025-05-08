import { IError } from "@/interfaces/ErrorInterface";
import { IListLodging, ILodging, ILodgingStatistical, IOverviewLodging, IOverviewRoom } from "@/interfaces/LodgingInterface";
import { BaseHttpService } from "../BaseHttpService";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import BaseService from "../BaseService";
import { IListResponse } from "@/interfaces/GeneralInterface";

export default class LodgingService extends BaseService {
  private _userId: string;

  public constructor(userId?: string) {
    super();
    this._userId = userId ?? "";
  }

  public async listByUser(): Promise<ILodging[] | IError> {
    try {
      const res: IResponse = await this.https({
        url: apiRouter.listLodgingByUser,
        authentication_requested: true,
      });

      return res.body?.data ?? [];
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async list(data: IListLodging): Promise<IListResponse<ILodging> | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.listLodging,
        method: "POST",
        body: data,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return ((res as IResponse).body as IListResponse<ILodging>) || null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async create(data: ILodging): Promise<ILodging | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.createLodging,
        body: data,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async overview(data: IOverviewLodging): Promise<ILodgingStatistical | IOverviewRoom | IError> {
    try {
      const res: IResponse | IError = await this.https({
        method: "POST",
        url: apiRouter.overviewLodging,
        body: data,
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }


  public async detail(lodgingId:string): Promise<ILodging | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.detailLodging.replace(":id", lodgingId),
        authentication_requested: true
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async update(data:ILodging): Promise<ILodging | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.updateLodging,
        authentication_requested: true,
        method: "POST",
        body: data
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async delete(lodgingId:string): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.deleteLodging.replace(":id", lodgingId),
        method: "DELETE",
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }

  public async restore(lodgingId:string): Promise<string | IError> {
    try {
      const res: IResponse | IError = await this.https({
        url: apiRouter.restoreLodging.replace(":id", lodgingId),
        method: "PUT",
        authentication_requested: true,
      });

      if (res.hasOwnProperty("message")) {
        return res as IError;
      }
      return (res as IResponse).body?.data ?? null;
    } catch (error: any) {
      return this.returnError(error);
    }
  }


}
