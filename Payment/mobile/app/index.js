import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Smartphone } from 'lucide-react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-slate-900">
      <View className="mb-12 items-center">
        <Text className="text-4xl font-bold text-white mb-2">RFID Commerce</Text>
        <Text className="text-slate-400 text-lg">Select your portal</Text>
      </View>

      <TouchableOpacity 
        onPress={() => router.push('/login/agent')}
        className="w-full bg-blue-600 p-6 rounded-2xl flex-row items-center mb-4 shadow-lg shadow-blue-500/20"
      >
        <Shield size={32} color="white" />
        <View className="ml-4">
          <Text className="text-white text-xl font-bold">Agent Portal</Text>
          <Text className="text-blue-100 italic">Top-up card balances</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/login/sales')}
        className="w-full bg-emerald-600 p-6 rounded-2xl flex-row items-center shadow-lg shadow-emerald-500/20"
      >
        <Smartphone size={32} color="white" />
        <View className="ml-4">
          <Text className="text-white text-xl font-bold">Sales Portal</Text>
          <Text className="text-emerald-100 italic">Process card payments</Text>
        </View>
      </TouchableOpacity>

      <View className="absolute bottom-10">
        <Text className="text-slate-500 font-medium">Team Zephyr © 2026</Text>
      </View>
    </View>
  );
}
