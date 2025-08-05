
# Como Gerar o APK do Bitcoin Bluetooth Wallet

## Pré-requisitos

1. **Instalar EAS CLI** (se ainda não tiver):
   ```bash
   npm install -g eas-cli
   ```

2. **Fazer login no Expo**:
   ```bash
   eas login
   ```

3. **Configurar o projeto**:
   ```bash
   eas build:configure
   ```

## Gerar APK

### Para desenvolvimento/teste:
```bash
eas build -p android --profile development
```

### Para preview/distribuição interna:
```bash
eas build -p android --profile preview
```

### Para produção:
```bash
eas build -p android --profile production
```

## Opções de Build

- **APK**: Arquivo instalável diretamente no dispositivo
- **AAB**: Para publicação na Google Play Store

Para gerar AAB (Android App Bundle) para a Play Store:
```bash
eas build -p android --profile production-aab
```

## Processo de Build

1. O EAS irá solicitar que você crie ou use uma keystore existente
2. Para desenvolvimento, você pode usar uma keystore gerada automaticamente
3. Para produção, é recomendado criar sua própria keystore
4. O build será executado nos servidores do Expo
5. Você receberá um link para download do APK quando concluído

## Instalação do APK

1. Baixe o APK do link fornecido
2. No dispositivo Android, habilite "Fontes desconhecidas" nas configurações
3. Instale o APK baixado

## Notas Importantes

- O app usa Bluetooth, então teste em dispositivos físicos
- As funcionalidades de Bluetooth são simuladas no código atual
- Para funcionalidade real de Bluetooth, será necessário implementação adicional
- O app armazena dados localmente usando AsyncStorage

## Troubleshooting

Se encontrar problemas:
1. Verifique se todas as dependências estão instaladas
2. Execute `expo doctor` para verificar configurações
3. Consulte os logs de build no dashboard do Expo
