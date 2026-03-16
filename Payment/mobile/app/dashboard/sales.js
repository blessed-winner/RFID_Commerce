import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LogOut, ShoppingCart, CreditCard, CheckCircle2, Package } from 'lucide-react-native';
import io from 'socket.io-client';
import axios from 'axios';

const BACKEND_URL = 'http://169.254.101.40:9224';

export default function SalesDashboard() {
  const router = useRouter();
  const [scannedCard, setScannedCard] = useState(null);
  const [product, setProduct] = useState('Service Payment');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('update_ui', (data) => {
      if (data.type === 'SCAN' || !data.type) {
        setScannedCard(data);
        setStatus({ type: 'info', msg: 'Card detected for payment' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
      }
    });

    return () => socket.disconnect();
  }, []);

  const handlePayment = async () => {
    if (!scannedCard || !amount) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/pay`, {
        uid: scannedCard.uid,
        amount: parseInt(amount),
        product_name: product
      });
      if (response.data.status === 'success') {
        setScannedCard(prev => ({ ...prev, balance: response.data.new_balance }));
        setAmount('');
        setStatus({ type: 'success', msg: `Payment successful! Receipt ID: ${response.data.receipt.transaction_id}` });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Payment failed';
      setStatus({ type: 'error', msg: errorMsg });
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
            <Text className="text-slate-400 text-sm font-medium uppercase tracking-wider">Sales Dashboard</Text>
            <Text className="text-white text-2xl font-bold">Terminal #01</Text>
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

        <View className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-500/40">
          <View className="flex-row justify-between items-start mb-4">
            <CreditCard size={32} color="white" />
            <Text className="text-emerald-200 font-bold">RFID DEBIT</Text>
          </View>
          <Text className="text-emerald-100 text-sm mb-1 uppercase tracking-widest">Active Card UID</Text>
          <Text className="text-white text-3xl font-mono mb-4">{scannedCard?.uid || "SCAN CARD TO PAY"}</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-emerald-100 text-xs">AVAIL. BALANCE</Text>
              <Text className="text-white text-xl font-bold">{scannedCard?.balance || 0} <Text className="text-sm">RWF</Text></Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold uppercase">{scannedCard ? 'Authenticated' : 'Offline'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="p-6">
        <Text className="text-white font-bold text-xl mb-4">Process Transaction</Text>
        <View className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
          <View className="mb-4">
            <Text className="text-slate-400 mb-2 ml-1">Product/Service</Text>
            <View className="bg-slate-900 flex-row items-center p-4 rounded-2xl border border-slate-700">
              <Package size={20} color="#94a3b8" />
              <TextInput
                value={product}
                onChangeText={setProduct}
                placeholder="Product Name"
                placeholderTextColor="#475569"
                className="flex-1 text-white ml-3 font-medium"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-slate-400 mb-2 ml-1">Amount to Charge (RWF)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#475569"
              keyboardType="numeric"
              className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 focus:border-emerald-500 text-lg font-bold"
            />
          </View>

          <TouchableOpacity 
            onPress={handlePayment}
            disabled={!scannedCard || loading}
            className={`p-4 rounded-2xl flex-row justify-center items-center shadow-lg ${!scannedCard || loading ? 'bg-slate-700' : 'bg-emerald-600 shadow-emerald-500/20'}`}
          >
            {loading ? <ActivityIndicator color="white" className="mr-2" /> : <ShoppingCart size={20} color="white" className="mr-2" />}
            <Text className="text-white font-bold text-lg">Process Payment</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-slate-500 text-center mt-6 italic text-sm">
          Payment will be deducted instantly from the UID balance.
        </Text>
      </View>
    </ScrollView>
  );
}
