
import { Text, View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';

interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
  trusted: boolean;
}

export default function BluetoothScreen() {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([
    { id: '1', name: 'iPhone de João', connected: false, trusted: true },
    { id: '2', name: 'Samsung de Maria', connected: false, trusted: false },
    { id: '3', name: 'Pixel de Pedro', connected: false, trusted: true },
  ]);

  const handleBack = () => {
    router.back();
  };

  const toggleBluetooth = () => {
    setIsBluetoothEnabled(!isBluetoothEnabled);
    if (!isBluetoothEnabled) {
      Alert.alert('Bluetooth Habilitado', 'Bluetooth foi habilitado com sucesso.');
    } else {
      Alert.alert('Bluetooth Desabilitado', 'Bluetooth foi desabilitado.');
      setDevices(devices.map(device => ({ ...device, connected: false })));
    }
  };

  const scanForDevices = () => {
    if (!isBluetoothEnabled) {
      Alert.alert('Erro', 'Habilite o Bluetooth primeiro.');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simular novos dispositivos encontrados
      const newDevice = {
        id: Date.now().toString(),
        name: 'Novo Dispositivo',
        connected: false,
        trusted: false
      };
      setDevices(prev => [...prev, newDevice]);
      Alert.alert('Busca Concluída', 'Novos dispositivos foram encontrados.');
    }, 3000);
  };

  const connectToDevice = (deviceId: string) => {
    if (!isBluetoothEnabled) {
      Alert.alert('Erro', 'Habilite o Bluetooth primeiro.');
      return;
    }

    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    Alert.alert(
      'Conectar Dispositivo',
      `Conectar ao ${device.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Conectar',
          onPress: () => {
            setDevices(devices.map(d => 
              d.id === deviceId 
                ? { ...d, connected: !d.connected }
                : { ...d, connected: false }
            ));
            Alert.alert('Sucesso', `${device.connected ? 'Desconectado de' : 'Conectado ao'} ${device.name}`);
          }
        }
      ]
    );
  };

  const trustDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    Alert.alert(
      'Dispositivo Confiável',
      `${device.trusted ? 'Remover' : 'Adicionar'} ${device.name} como dispositivo confiável?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: device.trusted ? 'Remover' : 'Adicionar',
          onPress: () => {
            setDevices(devices.map(d => 
              d.id === deviceId ? { ...d, trusted: !d.trusted } : d
            ));
          }
        }
      ]
    );
  };

  const removeDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    Alert.alert(
      'Remover Dispositivo',
      `Remover ${device.name} da lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setDevices(devices.filter(d => d.id !== deviceId));
          }
        }
      ]
    );
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Button
          text="← Voltar"
          onPress={handleBack}
          style={{ backgroundColor: colors.backgroundAlt, width: 100 }}
        />
        <Text style={commonStyles.title}>Bluetooth</Text>
        <View style={{ width: 100 }} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Status do Bluetooth */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Status do Bluetooth</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                {isBluetoothEnabled ? 'Habilitado' : 'Desabilitado'}
              </Text>
            </View>
            <Button
              text={isBluetoothEnabled ? 'Desabilitar' : 'Habilitar'}
              onPress={toggleBluetooth}
              style={isBluetoothEnabled ? buttonStyles.danger : buttonStyles.bluetooth}
            />
          </View>
        </View>

        {/* Controles */}
        <View style={commonStyles.buttonContainer}>
          <Button
            text={isScanning ? "Buscando..." : "Buscar Dispositivos"}
            onPress={scanForDevices}
            style={buttonStyles.bluetooth}
          />
        </View>

        {/* Lista de Dispositivos */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Dispositivos Disponíveis</Text>
          {devices.length === 0 ? (
            <Text style={commonStyles.textSecondary}>
              Nenhum dispositivo encontrado. Toque em "Buscar Dispositivos" para procurar.
            </Text>
          ) : (
            devices.map((device) => (
              <View key={device.id} style={commonStyles.listItem}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon 
                      name="phone-portrait" 
                      size={20} 
                      style={{ color: colors.textSecondary, marginRight: 10 }} 
                    />
                    <Text style={commonStyles.text}>{device.name}</Text>
                    {device.trusted && (
                      <Icon 
                        name="shield-checkmark" 
                        size={16} 
                        style={{ color: colors.success, marginLeft: 5 }} 
                      />
                    )}
                  </View>
                  <Text style={[
                    commonStyles.textSecondary,
                    { marginLeft: 30, fontSize: 12 }
                  ]}>
                    {device.connected ? 'Conectado' : 'Desconectado'}
                    {device.trusted ? ' • Confiável' : ''}
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Button
                    text={device.connected ? 'Desconectar' : 'Conectar'}
                    onPress={() => connectToDevice(device.id)}
                    style={{
                      backgroundColor: device.connected ? colors.error : colors.blue,
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                    }}
                  />
                  <Button
                    text="⋮"
                    onPress={() => {
                      Alert.alert(
                        device.name,
                        'Escolha uma ação:',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: device.trusted ? 'Remover Confiança' : 'Confiar',
                            onPress: () => trustDevice(device.id)
                          },
                          { 
                            text: 'Remover',
                            style: 'destructive',
                            onPress: () => removeDevice(device.id)
                          }
                        ]
                      );
                    }}
                    style={{
                      backgroundColor: colors.backgroundAlt,
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                    }}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        {/* Informações */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Dicas de Segurança</Text>
          <Text style={commonStyles.textSecondary}>
            • Apenas conecte a dispositivos conhecidos{'\n'}
            • Marque como "confiável" apenas dispositivos de pessoas que você conhece{'\n'}
            • Mantenha o Bluetooth desabilitado quando não estiver usando{'\n'}
            • Verifique sempre a identidade do dispositivo antes de transações
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
