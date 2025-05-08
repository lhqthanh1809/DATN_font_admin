import { ILodgingType } from "@/interfaces/LodgingInterface";
import BaseService from "../BaseService";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";

export default class LodgingTypeService extends BaseService {

    constructor() {
        super(true);
    }

    public async list(): Promise<ILodgingType[] | IError> {
        try {
          const res: IResponse | IError = await this.https({
            url: apiRouter.listTypeLodging,
          });
    
          if (res.hasOwnProperty("message")) {
            return res as IError;
          }
          return (res as IResponse).body?.data || [];
        } catch (error: any) {
          return this.returnError(error);
        }
      }
}  