
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#F7931A',      // Bitcoin Orange
  secondary: '#FF8C00',    // Darker Orange
  accent: '#FFB347',       // Light Orange
  background: '#1A1A1A',   // Dark Background
  backgroundAlt: '#2D2D2D', // Lighter Dark
  text: '#FFFFFF',         // White text
  textSecondary: '#B0B0B0', // Gray text
  success: '#4CAF50',      // Green
  error: '#F44336',        // Red
  card: '#2D2D2D',         // Card background
  border: '#404040',       // Border color
  blue: '#2196F3',         // Bluetooth blue
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  bluetooth: {
    backgroundColor: colors.blue,
    alignSelf: 'center',
    width: '100%',
  },
  danger: {
    backgroundColor: colors.error,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.card,
    borderRadius: 15,
    marginVertical: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  balanceUSD: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 5,
  },
  buttonContainer: {
    gap: 15,
    marginVertical: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: colors.text,
    marginVertical: 10,
  },
  statusConnected: {
    color: colors.success,
    fontWeight: 'bold',
  },
  statusDisconnected: {
    color: colors.error,
    fontWeight: 'bold',
  },
  statusSearching: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
});
