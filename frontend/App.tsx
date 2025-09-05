// App.tsx
import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable, ScrollView } from 'react-native';

function Box({ label }: { label: string }) {
  return (
    <View className="p-4 rounded-2xl bg-gray-100 mb-3">
      <Text className="text-base font-semibold text-gray-800">{label}</Text>
      <Text className="text-sm text-gray-500">Expo + NativeWind is working 🎉</Text>
    </View>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center px-6 bg-white">
        <Text className="text-3xl font-extrabold mb-2">Re-Route</Text>
        <Text className="text-gray-500 mb-6">Django API + React Native(Expo)</Text>

        <Box label="Tailwind classes applied" />

        <Pressable
          onPress={() => console.log('button pressed')}
          className="mt-2 px-5 py-3 rounded-2xl bg-black"
        >
          <Text className="text-white font-semibold">Ping</Text>
        </Pressable>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}
