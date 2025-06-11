module.exports = {
  expo: {
    "name": "Nestify Admin",
    "slug": "nestify_admin",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "icon": "./assets/images/app-icon.png",
    "scheme": "nestify-admin",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "This app needs access to your location to know where you are."
      },
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ],
      "package": "com.thanh18092003.nestify_admin"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-location",
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ],
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/BeVietnamPro-Bold.ttf",
            "./assets/fonts/BeVietnamPro-ExtraBold.ttf",
            "./assets/fonts/BeVietnamPro-Medium.ttf",
            "./assets/fonts/BeVietnamPro-Regular.ttf",
            "./assets/fonts/BeVietnamPro-SemiBold.ttf"
          ]
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    extra: {
      eas: {
        projectId: "dfc59d03-b1aa-4006-964e-bcf34bcf6752",
      },
      AES_IV: process.env.EXPO_PUBLIC_AES_IV,
      AES_KEY: process.env.EXPO_PUBLIC_AES_KEY,
      API_ADMIN_URL: process.env.EXPO_PUBLIC_API_ADMIN_URL,
      API_DATA_URL: process.env.EXPO_PUBLIC_API_DATA_URL,
      KEY_TOKEN: process.env.EXPO_PUBLIC_KEY_TOKEN,
      TIMEZONE: process.env.EXPO_PUBLIC_TIMEZONE,
    },
  },
};
