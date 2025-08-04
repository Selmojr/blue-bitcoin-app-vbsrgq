
import { Text, View, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReceiveScreen() {
  const [isListening, setIsListening] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [pendingTransaction, setPendingTransaction] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const startListening = () => {
    setIsListening(true);
    // Simular escuta por conexões Bluetooth
    setTimeout(() => {
      setConnectedDevice('iPhone de João');
      // Simular recebimento de transação
      setTimeout(() => {
        setPendingTransaction({
          amount: 0.0005,
          from: 'iPhone de João'
        });
      }, 3000);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setConnectedDevice(null);
    setPendingTransaction(null);
  };

  const handleAcceptTransaction = async () => {
    if (!pendingTransaction) return;

    try {
      // Atualizar saldo
      const savedBalance = await AsyncStorage.getItem('btc_balance');
      const currentBalance = savedBalance ? parseFloat(savedBalance) : 0.00125;
      const newBalance = currentBalance + pendingTransaction.amount;
      await AsyncStorage.setItem('btc_balance', newBalance.toString());
      
      // Salvar transação
      const transaction = {
        id: Date.now().toString(),
        type: 'received',
        amount: pendingTransaction.amount,
        device: pendingTransaction.from,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      const transactions = await AsyncStorage.getItem('transactions');
      const transactionList = transactions ? JSON.parse(transactions) : [];
      transactionList.unshift(transaction);
      await AsyncStorage.setItem('transactions', JSON.stringify(transactionList));
      
      Alert.alert('Sucesso', 'Bitcoin recebido com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Erro ao receber:', error);
      Alert.alert('Erro', 'Falha ao processar a transação.');
    }
  };

  const handleRejectTransaction = () => {
    setPendingTransaction(null);
    Alert.alert('Transação Rejeitada', 'A transação foi rejeitada.');
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Button
          text="← Voltar"
          onPress={handleBack}
          style={{ backgroundColor: colors.backgroundAlt, width: 100 }}
        />
        <Text style={commonStyles.title}>Receber Bitcoin</Text>
        <View style={{ width: 100 }} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Status da Conexão */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Status da Conexão</Text>
          {isListening ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="bluetooth" size={20} style={{ color: colors.blue, marginRight: 10 }} />
              <Text style={commonStyles.statusSearching}>
                Aguardando conexões...
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="bluetooth" size={20} style={{ color: colors.error, marginRight: 10 }} />
              <Text style={commonStyles.statusDisconnected}>
                Não está escutando
              </Text>
            </View>
          )}
          
          {connectedDevice && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Icon name="phone-portrait" size={20} style={{ color: colors.success, marginRight: 10 }} />
              <Text style={commonStyles.statusConnected}>
                Conectado: {connectedDevice}
              </Text>
            </View>
          )}
        </View>

        {/* Controles */}
        <View style={commonStyles.buttonContainer}>
          {!isListening ? (
            <Button
              text="Começar a Escutar"
              onPress={startListening}
              style={buttonStyles.bluetooth}
            />
          ) : (
            <Button
              text="Parar de Escutar"
              onPress={stopListening}
              style={buttonStyles.danger}
            />
          )}
        </View>

        {/* Transação Pendente */}
        {pendingTransaction && (
          <View style={[commonStyles.card, { borderColor: colors.primary, borderWidth: 2 }]}>
            <Text style={commonStyles.subtitle}>Transação Recebida!</Text>
            <Text style={commonStyles.text}>
              Valor: ₿ {pendingTransaction.amount.toFixed(8)}
            </Text>
            <Text style={commonStyles.textSecondary}>
              De: {pendingTransaction.from}
            </Text>
            
            <View style={[commonStyles.actionButtons, { marginTop: 20 }]}>
              <View style={commonStyles.actionButton}>
                <Button
                  text="Aceitar"
                  onPress={handleAcceptTransaction}
                  style={buttonStyles.primary}
                />
              </View>
              <View style={commonStyles.actionButton}>
                <Button
                  text="Rejeitar"
                  onPress={handleRejectTransaction}
                  style={buttonStyles.danger}
                />
              </View>
            </View>
          </View>
        )}

        {/* Instruções */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Como Receber</Text>
          <Text style={commonStyles.textSecondary}>
            1. Toque em "Começar a Escutar"{'\n'}
            2. Seu dispositivo ficará visível para outros usuários{'\n'}
            3. Quando alguém enviar Bitcoin, você receberá uma notificação{'\n'}
            4. Aceite ou rejeite a transação
          </Text>
        </View>

        {/* Informações de Segurança */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Segurança</Text>
          <Text style={commonStyles.textSecondary}>
            • Sempre verifique o valor antes de aceitar{'\n'}
            • Confirme a identidade do remetente{'\n'}
            • Mantenha o Bluetooth ativo apenas quando necessário
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
