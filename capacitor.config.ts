import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.arnaud-drain.asc",
  appName: "asc-v2",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
