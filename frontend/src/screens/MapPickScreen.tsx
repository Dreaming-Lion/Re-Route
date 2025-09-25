// src/screens/MapPickScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, ActivityIndicator, Platform, TextInput, Text, Pressable, Alert } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useRouter } from "expo-router";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

type KakaoNS = typeof window & { kakao?: any };

const extra =
  (Constants?.expoConfig?.extra as any) ??
  ((Constants as any)?.manifest?.extra as any) ??
  {};
const KAKAO_JS_KEY: string = extra?.KAKAO_JS_KEY || "";

const LAST_PICK_KEY = "@last_pick_v1";

export default function MapPickScreen() {
  const router = useRouter();
  const { styles } = useTheme();

  if (!KAKAO_JS_KEY) {
    console.warn("KAKAO_JS_KEY가 비어있습니다. .env / app.config 확인하세요.");
  }

  return (
    <View style={styles.screen}>
      <Header title="지도에서 선택" />
      {Platform.OS === "web" ? (
        <WebMap routerReplace={router.replace} />
      ) : (
        <NativeMap routerReplace={router.replace} />
      )}
    </View>
  );
}

/* =======================
   1) Web: RN Web + Kakao SDK 직접 로드
   ======================= */
function WebMap({ routerReplace }: { routerReplace: (url: string) => void }) {
  const containerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [addr, setAddr] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    let mounted = true;
    const w = window as KakaoNS;

    const loadSdk = () =>
      new Promise<void>((resolve, reject) => {
        if (w.kakao?.maps) {
          try { w.kakao.maps.load(() => resolve()); } catch { resolve(); }
          return;
        }
        const exist = document.getElementById("kakao-sdk") as HTMLScriptElement | null;
        if (exist) {
          exist.addEventListener("load", () => { w.kakao?.maps?.load ? w.kakao.maps.load(() => resolve()) : resolve(); });
          exist.addEventListener("error", () => reject(new Error("SDK script error")));
          return;
        }
        const s = document.createElement("script");
        s.id = "kakao-sdk";
        s.async = true;
        s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`;
        s.onload = () => { try { w.kakao.maps.load(() => resolve()); } catch (e) { reject(e); } };
        s.onerror = () => reject(new Error("SDK script error"));
        document.head.appendChild(s);
      });

    const initMap = () => {
      const kakao = (window as any).kakao;
      const center = new kakao.maps.LatLng(36.9910, 127.9250);
      const map = new kakao.maps.Map(containerRef.current, { center, level: 4 });
      const geocoder = new kakao.maps.services.Geocoder();
      const marker = new kakao.maps.Marker({ position: center });
      marker.setMap(map);

      mapRef.current = map;
      markerRef.current = marker;
      geocoderRef.current = geocoder;

      const reverse = (ll: any) => {
        geocoder.coord2Address(ll.getLng(), ll.getLat(), (result: any[], status: string) => {
          if (!mounted) return;
          if (status === kakao.maps.services.Status.OK) {
            const r = result[0];
            const road = r?.road_address?.address_name;
            const jibun = r?.address?.address_name;
            setAddr(road || jibun || "");
          } else {
            setAddr("");
          }
        });
      };

      reverse(center);

      kakao.maps.event.addListener(map, "click", (e: any) => {
        const ll = e.latLng;
        marker.setPosition(ll);
        reverse(ll);
      });
    };

    (async () => {
      try { await loadSdk(); initMap(); }
      catch (e) {
        console.error(e);
        Alert.alert("오류", "카카오 지도를 불러오지 못했습니다. 키/허용 도메인/차단 확장을 확인하세요.");
      }
      finally { if (mounted) setLoading(false); }
    })();

    return () => { mounted = false; };
  }, []);

  const saveAndGo = async () => {
    const payload = {
      name: name.trim() || "선택한 위치",
      address: addr || "",
      emoji: "📍",
      lat: markerRef.current?.getPosition?.().getLat?.() ?? null,
      lng: markerRef.current?.getPosition?.().getLng?.() ?? null,
      addedAt: Date.now(),
    };
    try {
      await AsyncStorage.setItem(LAST_PICK_KEY, JSON.stringify(payload));
    } catch {}
    routerReplace(`/(tabs)/favorites?addedAt=${payload.addedAt}`);
  };

  const searchByAddress = () => {
    const kakao = (window as any).kakao;
    if (!addr.trim() || !kakao || !geocoderRef.current) return;
    geocoderRef.current.addressSearch(addr.trim(), (result: any[], status: string) => {
      if (status !== kakao.maps.services.Status.OK || !result?.length) {
        Alert.alert("검색 실패", "주소를 찾을 수 없습니다. 더 정확히 입력해 주세요.");
        return;
      }
      const { x, y, address_name } = result[0];
      const ll = new kakao.maps.LatLng(Number(y), Number(x));
      markerRef.current.setPosition(ll);
      mapRef.current.setCenter(ll);
      setAddr(address_name || addr.trim());
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View ref={containerRef} style={{ flex: 1, borderRadius: 12, overflow: "hidden" }} />
      <View style={{ padding: 12, gap: 8 }}>
        <TextInput
          placeholder="장소명 (예: 집, 회사 등)"
          value={name}
          onChangeText={setName}
          style={{ height: 44, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingHorizontal: 12 }}
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            placeholder="주소를 입력하거나 지도에서 클릭하세요"
            value={addr}
            onChangeText={setAddr}
            style={{ flex: 1, height: 44, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingHorizontal: 12 }}
            onSubmitEditing={searchByAddress}
          />
          <Pressable
            onPress={searchByAddress}
            style={{ width: 110, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#CFEFFF", borderWidth: 1, borderColor: "#B7E3FF" }}
          >
            <Text style={{ fontWeight: "800", color: "#0f172a" }}>주소로 찾기</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={saveAndGo}
          style={{ height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#CFEFFF", borderWidth: 1, borderColor: "#B7E3FF" }}
        >
          <Text style={{ fontWeight: "800", color: "#0f172a" }}>이 위치 사용</Text>
        </Pressable>

        {loading && (
          <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 60, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
  );
}

/* =======================
   2) Native: WebView (주소 입력 + 검색 포함)
   ======================= */
function NativeMap({ routerReplace }: { routerReplace: (url: string) => void }) {
  const html = useMemo(
    () => `
<!doctype html><html lang="ko"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>
  html,body,#map{margin:0;padding:0;width:100%;height:100%}
  .panel{position:absolute;left:10px;right:10px;bottom:10px;background:rgba(255,255,255,.95);border-radius:12px;padding:10px;box-shadow:0 6px 16px rgba(0,0,0,.12);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif}
  .row{display:flex;gap:8px} .input{flex:1;height:38px;border:1px solid #E5E7EB;border-radius:10px;padding:0 10px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;border-radius:10px;padding:0 12px;background:#CFEFFF;border:1px solid #B7E3FF;font-weight:800;color:#0f172a;cursor:pointer}
  .addr{font-size:13px;color:#334155;margin:6px 0}
</style>
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services"></script>
</head><body>
<div id="map"></div>
<div class="panel">
  <div class="row" style="margin-bottom:6px"><input id="name" class="input" placeholder="장소명 (예: 집, 회사 등)"/></div>
  <div class="row" style="margin-bottom:6px"><input id="addrInput" class="input" placeholder="주소를 입력하거나 지도에서 클릭하세요"/><button id="search" class="btn">주소로 찾기</button></div>
  <div class="addr"><b>선택 주소</b>: <span id="addr">지도에서 위치를 탭해 주세요.</span></div>
  <div class="row"><button id="use" class="btn">이 위치 사용</button></div>
</div>
<script>
  const RN = window.ReactNativeWebView;
  const center = new kakao.maps.LatLng(36.9910,127.9250);
  const map = new kakao.maps.Map(document.getElementById('map'),{center,level:4});
  const geocoder = new kakao.maps.services.Geocoder();
  const marker = new kakao.maps.Marker({position:center}); marker.setMap(map);
  let selected = {address:"",lat:center.getLat(),lng:center.getLng()};
  function setAddrText(t){ document.getElementById('addr').innerText = t || "주소를 찾을 수 없습니다."; }
  function reverse(ll){
    geocoder.coord2Address(ll.getLng(),ll.getLat(),(result,status)=>{
      if(status===kakao.maps.services.Status.OK){
        const r=result[0]; const road=r.road_address&&r.road_address.address_name; const jibun=r.address&&r.address.address_name;
        const finalAddr=road||jibun||""; selected={address:finalAddr,lat:ll.getLat(),lng:ll.getLng()}; setAddrText(finalAddr);
      } else { selected.address=""; setAddrText(""); }
    });
  }
  function searchByAddress(q){
    if(!q) return;
    geocoder.addressSearch(q,(result,status)=>{
      if(status!==kakao.maps.services.Status.OK||!result?.length){ setAddrText(""); return; }
      const {x,y,address_name}=result[0]; const ll=new kakao.maps.LatLng(Number(y),Number(x));
      marker.setPosition(ll); map.setCenter(ll); selected={address:address_name||q,lat:ll.getLat(),lng:ll.getLng()}; setAddrText(selected.address);
    });
  }
  reverse(center);
  kakao.maps.event.addListener(map,'click',function(e){ const ll=e.latLng; marker.setPosition(ll); reverse(ll); });
  document.getElementById('search').addEventListener('click',function(){ const q=document.getElementById('addrInput').value; searchByAddress(q); });
  document.getElementById('addrInput').addEventListener('keydown',function(ev){ if(ev.key==='Enter'){ searchByAddress(ev.target.value); } });
  document.getElementById('use').addEventListener('click',function(){
    const payload={ name:document.getElementById('name').value||"선택한 위치", address:selected.address, emoji:"📍", lat:selected.lat, lng:selected.lng, addedAt:Date.now() };
    RN && RN.postMessage(JSON.stringify(payload));
  });
</script>
</body></html>`.trim(),
    []
  );

  const onMessage = async (e: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(e.nativeEvent.data);
      await AsyncStorage.setItem(LAST_PICK_KEY, JSON.stringify(data)); // ✅ 보존
      routerReplace(`/(tabs)/favorites?addedAt=${String(data.addedAt ?? Date.now())}`);
    } catch {}
  };

  return (
    <WebView
      originWhitelist={["*"]}
      onMessage={onMessage}
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      )}
      source={{ html, baseUrl: Platform.select({ android: "http://localhost", ios: "http://localhost" }) }}
      allowsBackForwardNavigationGestures
      style={{ flex: 1 }}
    />
  );
}
