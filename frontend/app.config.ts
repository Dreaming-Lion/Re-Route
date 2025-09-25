// app.config.ts
import 'dotenv/config';
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,           // app.json 내용 포함
  extra: {
    ...config.extra,
    KAKAO_JS_KEY: process.env.KAKAO_JS_KEY, // .env에서 주입
  },
});
