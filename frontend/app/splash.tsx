// app/splash.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import SplashView from "../src/screens/SplashScreen"; 
const NEXT = "/(tabs)/home"; 

export default function SplashRoute() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(NEXT);
    }, 1500); 
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashView />;
}
