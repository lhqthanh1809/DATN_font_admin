require("dotenv").config();

module.exports = {
  expo: {
    name: "YourApp",
    slug: "your-app",
    version: "1.0.0",
    extra: {
      AES_IV: process.env.AES_IV,
      AES_KEY: process.env.AES_KEY,
      API_ADMIN_URL: process.env.API_ADMIN_URL,
      API_DATA_URL: process.env.API_DATA_URL,
      KEY_TOKEN: process.env.KEY_TOKEN,
      TIMEZONE: process.env.TIMEZONE,
    },
  },
};