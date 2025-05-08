import { IError } from "@/interfaces/ErrorInterface";
import BaseService from "../BaseService";
import { IUser } from "@/interfaces/UserInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";

export default class DashboardService extends BaseService{
    public async overview(
        section: "total" | "latest_users",
        quantity?: number
      ): Promise<any | IError | IUser[]> {
        try {
          const res: IResponse | IError = await this.https({
            method: "POST",
            authentication_requested: true,
            body: {
                section,
                ...(quantity ? { quantity } : {})
            },
            url: apiRouter.overviewDashboard,
          });
    
          if (res.hasOwnProperty("message")) {
            return res as IError;
          }
    
          return (res as IResponse).body?.data || null;
        } catch (err: any) {
          return this.returnError(err);
        }
      }
}