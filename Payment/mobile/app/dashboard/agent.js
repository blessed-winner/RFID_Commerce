import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LogOut, Scan, PlusCircle, CreditCard, History, CheckCircle2 } from 'lucide-react-native';
import io from 'socket.io-client';
import axios from 'axios';

const BACKEND_URL = 'http://169.254.101.40:9224'; // Adjust to your machine's local IP

export default function AgentDashboard() {
  const router = useRouter();
  const [scannedCard, setScannedCard] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('update_ui', (data) => {
      if (data.type === 'SCAN' || !data.type) {
        setScannedCard(data);
        setStatus({ type: 'info', msg: 'New card detected!' });
        // Clear message after 3 seconds
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
      }
    });

    return () => socket.disconnect();
  }, []);

  const handleTopup = async () => {
    if (!scannedCard || !amount) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/topup`, {
        uid: scannedCard.uid,
        amount: parseInt(amount)
      });
      if (response.data.status === 'success') {
        setScannedCard(prev => ({ ...prev, balance: response.data.new_balance }));
        setAmount('');
        setStatus({ type: 'success', msg: `Top-up successful! New balance: ${response.data.new_balance} RWF` });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Top-up failed. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="bg-slate-800 p-6 pt-12 rounded-b-[40px] shadow-xl">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-slate-400 text-sm font-medium uppercase tracking-wider">Agent Dashboard</Text>
            <Text className="text-white text-2xl font-bold">Welcome Back</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/')} className="bg-slate-700/50 p-3 rounded-2xl">
            <LogOut size={20} color="#f87171" />
          </TouchableOpacity>
        </View>

        {status.msg ? (
          <View className={`p-4 rounded-2xl mb-4 flex-row items-center ${
            status.type === 'success' ? 'bg-emerald-500/20' : 
            status.type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
          }`}>
            <CheckCircle2 size={20} color={status.type === 'success' ? '#10b981' : status.type === 'error' ? '#ef4444' : '#3b82f6'} />
            <Text className={`ml-3 font-medium ${
              status.type === 'success' ? 'text-emerald-400' : 
              status.type === 'error' ? 'text-red-400' : 'text-blue-400'
            }`}>{status.msg}</Text>
          </View>
        ) : null}

        <View className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-500/40">
          <View className="flex-row justify-between items-start mb-4">
            <CreditCard size={32} color="white" />
            <Text className="text-blue-200 font-bold">RFID DEBIT</Text>
          </View>
          <Text className="text-blue-100 text-sm mb-1 uppercase tracking-widest">Active Card UID</Text>
          <Text className="text-white text-3xl font-mono mb-4">{scannedCard?.uid || "WAITING FOR SCAN..."}</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-blue-100 text-xs">CURRENT BALANCE</Text>
              <Text className="text-white text-xl font-bold">{scannedCard?.balance || 0} <Text className="text-sm">RWF</Text></Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold uppercase">{scannedCard ? 'Ready' : 'Waiting'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="p-6">
        <Text className="text-white font-bold text-xl mb-4">Top-Up Card</Text>
        <View className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
          <View className="mb-4">
            <Text className="text-slate-400 mb-2 ml-1">Amount (RWF)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 5000"
              placeholderTextColor="#475569"
              keyboardType="numeric"
              className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 focus:border-blue-500 text-lg font-bold"
            />
          </View>
          <TouchableOpacity 
            onPress={handleTopup}
            disabled={!scannedCard || loading}
            className={`p-4 rounded-2xl flex-row justify-center items-center ${!scannedCard || loading ? 'bg-slate-700' : 'bg-blue-600'}`}
          >
            {loading ? <ActivityIndicator color="white" className="mr-2" /> : <PlusCircle size={20} color="white" className="mr-2" />}
            <Text className="text-white font-bold text-lg">Confirm Top-Up</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-xl">Quick Actions</Text>
          </View>
          <View className="flex-row space-x-4">
            <TouchableOpacity className="flex-1 bg-slate-800 p-4 rounded-2xl items-center border border-slate-700">
              <History size={24} color="#3b82f6" />
              <Text className="text-slate-300 mt-2 font-medium">History</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-slate-800 p-4 rounded-2xl items-center border border-slate-700">
              <Scan size={24} color="#3b82f6" />
              <Text className="text-slate-300 mt-2 font-medium">Scan Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
