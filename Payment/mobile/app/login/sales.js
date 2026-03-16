import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Smartphone, ArrowLeft } from 'lucide-react-native';

export default function SalesLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Basic validation matching backend logic
    if (username === 'sales' && password === 'salespass') {
      router.replace('/dashboard/sales');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-900 p-6"
    >
      <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-8">
        <ArrowLeft size={24} color="#94a3b8" />
      </TouchableOpacity>

      <View className="items-center mb-10">
        <View className="bg-emerald-600/20 p-4 rounded-full mb-4">
          <Smartphone size={48} color="#10b981" />
        </View>
        <Text className="text-3xl font-bold text-white">Sales Portal</Text>
        <Text className="text-slate-400 mt-2">Process secure payments</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-slate-400 mb-2 ml-1">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Sales username"
            placeholderTextColor="#475569"
            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-emerald-500"
          />
        </View>

        <View>
          <Text className="text-slate-400 mb-2 ml-1 mt-4">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#475569"
            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 focus:border-emerald-500"
          />
        </View>

        <TouchableOpacity 
          onPress={handleLogin}
          className="bg-emerald-600 p-4 rounded-xl mt-8 shadow-lg shadow-emerald-500/30"
        >
          <Text className="text-white text-center text-lg font-bold">Login to Sales Panel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
