
import { Text, View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [balance, setBalance] = useState(0.00125); // Saldo exemplo em BTC
  const [balanceUSD, setBalanceUSD] = useState(0);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  useEffect(() => {
    loadBalance();
    checkBluetoothStatus();
    // Simular preço do Bitcoin (em produção seria uma API)
    const btcPrice = 45000; // USD
    setBalanceUSD(balance * btcPrice);
  }, [balance]);

  const loadBalance = async () => {
    try {
      const savedBalance = await AsyncStorage.getItem('btc_balance');
      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
      }
    } catch (error) {
      console.log('Erro ao carregar saldo:', error);
    }
  };

  const checkBluetoothStatus = () => {
    // Simulação do status do Bluetooth
    // Em produção, usaria react-native-bluetooth-classic
    setIsBluetoothEnabled(true);
  };

  const handleSend = () => {
    if (!isBluetoothEnabled) {
      Alert.alert('Bluetooth Desabilitado', 'Por favor, habilite o Bluetooth para enviar Bitcoin.');
      return;
    }
    router.push('/send');
  };

  const handleReceive = () => {
    if (!isBluetoothEnabled) {
      Alert.alert('Bluetooth Desabilitado', 'Por favor, habilite o Bluetooth para receber Bitcoin.');
      return;
    }
    router.push('/receive');
  };

  const handleBluetooth = () => {
    router.push('/bluetooth');
  };

  const handleTransactions = () => {
    router.push('/transactions');
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Bitcoin Wallet</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon 
            name="bluetooth" 
            size={24} 
            style={{ 
              color: isBluetoothEnabled ? colors.success : colors.error,
              marginRight: 10 
            }} 
          />
          <Text style={isBluetoothEnabled ? commonStyles.statusConnected : commonStyles.statusDisconnected}>
            {isBluetoothEnabled ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Saldo */}
        <View style={commonStyles.balanceContainer}>
          <Text style={commonStyles.balanceLabel}>Saldo Total</Text>
          <Text style={commonStyles.balanceAmount}>
            ₿ {balance.toFixed(8)}
          </Text>
          <Text style={commonStyles.balanceUSD}>
            ${balanceUSD.toFixed(2)} USD
          </Text>
        </View>

        {/* Botões de Ação */}
        <View style={commonStyles.actionButtons}>
          <View style={commonStyles.actionButton}>
            <Button
              text="Enviar"
              onPress={handleSend}
              style={buttonStyles.primary}
            />
          </View>
          <View style={commonStyles.actionButton}>
            <Button
              text="Receber"
              onPress={handleReceive}
              style={buttonStyles.secondary}
            />
          </View>
        </View>

        {/* Menu de Opções */}
        <View style={commonStyles.buttonContainer}>
          <Button
            text="Gerenciar Bluetooth"
            onPress={handleBluetooth}
            style={buttonStyles.bluetooth}
          />
          
          <Button
            text="Histórico de Transações"
            onPress={handleTransactions}
            style={buttonStyles.secondary}
          />
        </View>

        {/* Informações */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Como Funciona</Text>
          <Text style={commonStyles.textSecondary}>
            Este wallet usa Bluetooth para transferir Bitcoin sem necessidade de internet. 
            Conecte-se com outros usuários próximos para enviar e receber transações de forma segura.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Status da Rede</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="wifi-off" size={20} style={{ color: colors.textSecondary, marginRight: 10 }} />
            <Text style={commonStyles.textSecondary}>Modo Offline - Usando Bluetooth</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
