import Constants from "expo-constants";

export const envData = {
  AES_IV: Constants.expoConfig?.extra?.AES_IV || "",
  AES_KEY: Constants.expoConfig?.extra?.AES_KEY || "",
  API_ADMIN_URL: Constants.expoConfig?.extra?.API_ADMIN_URL || "http://default-api/admin",
  API_DATA_URL: Constants.expoConfig?.extra?.API_DATA_URL || "http://default-api/api",
  KEY_TOKEN: Constants.expoConfig?.extra?.KEY_TOKEN || "default_token",
  TIMEZONE: Constants.expoConfig?.extra?.TIMEZONE || "Asia/Ho_Chi_Minh",
};