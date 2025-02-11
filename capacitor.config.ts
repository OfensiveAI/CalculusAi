import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicalculator.app',
  appName: 'AI Calculator',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'android.keystore',
      keystoreAlias: 'aicalculator',
      keystorePassword: 'your-keystore-password',
      packageName: 'com.aicalculator.app'
    }
  }
};

export default config;