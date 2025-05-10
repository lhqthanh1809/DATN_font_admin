require("dotenv").config();

module.exports = {
  expo: {
    "name": "Nestify_Admin",
    "slug": "nestify_admin",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "icon": "./assets/images/app-icon.png",
    "scheme": "nestify_admin",
    extra: {
      eas: {
        projectId: "8a28811c-8afc-4d3b-b465-baffc79b0367",
      },
      AES_IV: process.env.AES_IV,
      AES_KEY: process.env.AES_KEY,
      API_ADMIN_URL: process.env.API_ADMIN_URL,
      API_DATA_URL: process.env.API_DATA_URL,
      KEY_TOKEN: process.env.KEY_TOKEN,
      TIMEZONE: process.env.TIMEZONE,
    },
  },
};
