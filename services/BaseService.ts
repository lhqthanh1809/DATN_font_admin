import { env } from "@/helper/helper";
import axios, { HttpStatusCode, AxiosError } from "axios";
import { LocalStorage } from "./LocalStorageService";
import { IError } from "@/interfaces/ErrorInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { apiRouter } from "@/assets/ApiRouter";
import { router } from "expo-router";

export default class BaseService {
  private _api = axios.create({
    baseURL: env("API_ADMIN_URL"),
  });

  constructor(useAlternateAPI: boolean = false) {

    if (useAlternateAPI) {
      this._api.defaults.baseURL = env("API_DATA_URL");
    }

    this._api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        const errData = error.response?.data as IResponse;
        if (
          (error.response?.status === HttpStatusCode.Unauthorized ||
            errData.errors?.[0]?.message === "Token has expired") 
            // && originalRequest.url != apiRouter.refreshToken
        ) {
          
          originalRequest._retry = true;
          const localStorage = new LocalStorage();
          try {
            // Gọi API refresh
            const refreshRes = await this._api.request({
              method: "GET",
              url: apiRouter.refreshToken,
              headers: {
                Authorization: `Bearer ${await localStorage.getItem(env("KEY_TOKEN"))}`,
                "Content-Type": "application/json",
              }
            })
            // console.log("refreshRes: ", refreshRes);

            if (refreshRes.status < 200 || refreshRes.status >= 300) {
              throw new Error(`Refresh token failed with status: ${refreshRes.status}`);
            }

            const newToken = refreshRes.data.body.access_token;
            await localStorage.setItem(env("KEY_TOKEN"), newToken);

            // Gắn lại token mới
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

            // Retry request cũ
            return this._api(originalRequest);
          } catch (e) {
            await localStorage.removeItem(env("KEY_TOKEN"));
            if (router.canDismiss()) {
              router.dismissAll();
            }
            router.replace("/login");
            return Promise.reject(e);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  protected async https({
    method = "GET",
    url,
    body,
    cancelToken,
    authentication_requested = false,
  }: {
    method?: "POST" | "PUT" | "GET" | "DELETE";
    url: string;
    body?: any;
    cancelToken?: any;
    formData_requested?: boolean;
    authentication_requested?: boolean;
  }) {
    try {
      const headers: Record<string, string> = {};

      if (authentication_requested) {
        const token = await new LocalStorage().getItem(env("KEY_TOKEN"));
        if (!token) {
          return this.returnError({
            message: "Unauthorized",
            code: HttpStatusCode.Unauthorized,
          });
        }
        headers["Authorization"] = `Bearer ${token}`;
      }
      console.log("📤 Sending request...");
      const response = await this._api.request({
        method,
        url,
        ...(method === "GET" ? { params: body } : { data: body }),
        cancelToken,
        headers,
      });

      console.log("response: ", response);

      if ((response.data as any).status >= HttpStatusCode.BadRequest) {
        return this.getErrorResponse(response.data as IResponse);
      }

      return response.data;
    } catch (error) {
      console.error("❌ Request failed:", error);
      return this.returnError(error);
    }
  }

  protected returnError(error: any): IError {
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.message || "Lỗi khi tải dữ liệu",
        code: error.response?.status || HttpStatusCode.InternalServerError,
        details: error.response?.data || null,
      };
    }

    return {
      message: error?.message || "Lỗi không xác định",
      code: error?.code || HttpStatusCode.InternalServerError,
      details: null,
    };
  }

  // Xử lý lỗi từ API trả về
  protected getErrorResponse(response: IResponse): IError {
    return {
      message: response.errors?.[0]?.message || "Lỗi không xác định",
      code: response.status,
    };
  }
}
