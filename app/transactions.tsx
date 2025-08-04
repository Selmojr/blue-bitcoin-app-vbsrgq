
import { Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  device: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        // Transações de exemplo
        const exampleTransactions: Transaction[] = [
          {
            id: '1',
            type: 'received',
            amount: 0.0005,
            device: 'iPhone de João',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
            status: 'completed'
          },
          {
            id: '2',
            type: 'sent',
            amount: 0.0002,
            device: 'Samsung de Maria',
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
            status: 'completed'
          },
          {
            id: '3',
            type: 'received',
            amount: 0.001,
            device: 'Pixel de Pedro',
            timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
            status: 'completed'
          }
        ];
        setTransactions(exampleTransactions);
        await AsyncStorage.setItem('transactions', JSON.stringify(exampleTransactions));
      }
    } catch (error) {
      console.log('Erro ao carregar transações:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.primary;
      case 'failed': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
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
        <Text style={commonStyles.title}>Transações</Text>
        <View style={{ width: 100 }} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Resumo</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={commonStyles.text}>
                {transactions.filter(t => t.type === 'received').length}
              </Text>
              <Text style={commonStyles.textSecondary}>Recebidas</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={commonStyles.text}>
                {transactions.filter(t => t.type === 'sent').length}
              </Text>
              <Text style={commonStyles.textSecondary}>Enviadas</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={commonStyles.text}>{transactions.length}</Text>
              <Text style={commonStyles.textSecondary}>Total</Text>
            </View>
          </View>
        </View>

        {/* Lista de Transações */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Histórico</Text>
          
          {transactions.length === 0 ? (
            <View style={commonStyles.centerContent}>
              <Icon name="receipt-outline" size={48} style={{ color: colors.textSecondary, marginBottom: 10 }} />
              <Text style={commonStyles.textSecondary}>
                Nenhuma transação encontrada
              </Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={commonStyles.listItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Icon 
                    name={transaction.type === 'sent' ? 'arrow-up-circle' : 'arrow-down-circle'}
                    size={24} 
                    style={{ 
                      color: transaction.type === 'sent' ? colors.error : colors.success,
                      marginRight: 15 
                    }} 
                  />
                  
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={commonStyles.text}>
                        {transaction.type === 'sent' ? 'Enviado para' : 'Recebido de'}
                      </Text>
                      <Text style={[
                        commonStyles.text,
                        { 
                          color: transaction.type === 'sent' ? colors.error : colors.success,
                          fontWeight: 'bold'
                        }
                      ]}>
                        {transaction.type === 'sent' ? '-' : '+'}₿ {transaction.amount.toFixed(8)}
                      </Text>
                    </View>
                    
                    <Text style={commonStyles.textSecondary}>
                      {transaction.device}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                      <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                        {formatDate(transaction.timestamp)}
                      </Text>
                      <Text style={[
                        commonStyles.textSecondary,
                        { 
                          fontSize: 12,
                          color: getStatusColor(transaction.status),
                          fontWeight: 'bold'
                        }
                      ]}>
                        {getStatusText(transaction.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Informações */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Sobre as Transações</Text>
          <Text style={commonStyles.textSecondary}>
            • Todas as transações são realizadas via Bluetooth{'\n'}
            • As transações são armazenadas localmente no dispositivo{'\n'}
            • Não há necessidade de conexão com a internet{'\n'}
            • Os dados são sincronizados apenas entre dispositivos conectados
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
