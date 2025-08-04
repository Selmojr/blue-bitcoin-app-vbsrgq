
import { Text, View, TextInput, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SendScreen() {
  const [amount, setAmount] = useState('');
  const [recipientDevice, setRecipientDevice] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const handleScanDevices = () => {
    setIsConnecting(true);
    // Simular busca por dispositivos Bluetooth
    setTimeout(() => {
      setIsConnecting(false);
      Alert.alert(
        'Dispositivos Encontrados',
        'Selecione um dispositivo para conectar:',
        [
          { text: 'iPhone de João', onPress: () => setConnectedDevice('iPhone de João') },
          { text: 'Samsung de Maria', onPress: () => setConnectedDevice('Samsung de Maria') },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }, 2000);
  };

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    if (!connectedDevice) {
      Alert.alert('Erro', 'Por favor, conecte-se a um dispositivo primeiro.');
      return;
    }

    try {
      // Verificar saldo
      const savedBalance = await AsyncStorage.getItem('btc_balance');
      const currentBalance = savedBalance ? parseFloat(savedBalance) : 0.00125;
      
      if (parseFloat(amount) > currentBalance) {
        Alert.alert('Erro', 'Saldo insuficiente.');
        return;
      }

      // Simular envio via Bluetooth
      Alert.alert(
        'Confirmar Transação',
        `Enviar ₿ ${amount} para ${connectedDevice}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Confirmar', 
            onPress: async () => {
              // Atualizar saldo
              const newBalance = currentBalance - parseFloat(amount);
              await AsyncStorage.setItem('btc_balance', newBalance.toString());
              
              // Salvar transação
              const transaction = {
                id: Date.now().toString(),
                type: 'sent',
                amount: parseFloat(amount),
                device: connectedDevice,
                timestamp: new Date().toISOString(),
                status: 'completed'
              };
              
              const transactions = await AsyncStorage.getItem('transactions');
              const transactionList = transactions ? JSON.parse(transactions) : [];
              transactionList.unshift(transaction);
              await AsyncStorage.setItem('transactions', JSON.stringify(transactionList));
              
              Alert.alert('Sucesso', 'Bitcoin enviado com sucesso!', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            }
          }
        ]
      );
    } catch (error) {
      console.log('Erro ao enviar:', error);
      Alert.alert('Erro', 'Falha ao processar a transação.');
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Button
          text="← Voltar"
          onPress={handleBack}
          style={{ backgroundColor: colors.backgroundAlt, width: 100 }}
        />
        <Text style={commonStyles.title}>Enviar Bitcoin</Text>
        <View style={{ width: 100 }} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Status da Conexão */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Status da Conexão</Text>
          {connectedDevice ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="bluetooth" size={20} style={{ color: colors.success, marginRight: 10 }} />
              <Text style={commonStyles.statusConnected}>
                Conectado: {connectedDevice}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="bluetooth" size={20} style={{ color: colors.error, marginRight: 10 }} />
              <Text style={commonStyles.statusDisconnected}>
                Nenhum dispositivo conectado
              </Text>
            </View>
          )}
        </View>

        {/* Buscar Dispositivos */}
        <View style={commonStyles.buttonContainer}>
          <Button
            text={isConnecting ? "Buscando..." : "Buscar Dispositivos"}
            onPress={handleScanDevices}
            style={buttonStyles.bluetooth}
          />
        </View>

        {/* Formulário de Envio */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Valor a Enviar</Text>
          
          <TextInput
            style={commonStyles.input}
            placeholder="0.00000000"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          
          <Text style={commonStyles.textSecondary}>
            Valor em Bitcoin (BTC)
          </Text>
        </View>

        {/* Botão de Envio */}
        <View style={commonStyles.buttonContainer}>
          <Button
            text="Enviar Bitcoin"
            onPress={handleSend}
            style={buttonStyles.primary}
          />
        </View>

        {/* Informações */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Como Funciona</Text>
          <Text style={commonStyles.textSecondary}>
            1. Busque por dispositivos Bluetooth próximos{'\n'}
            2. Conecte-se ao dispositivo do destinatário{'\n'}
            3. Insira o valor e confirme a transação{'\n'}
            4. A transação será enviada via Bluetooth
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
