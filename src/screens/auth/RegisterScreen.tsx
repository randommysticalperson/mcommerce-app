import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppDispatch, RootState } from '../../store';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { AuthStackParamList } from '../../types';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !phone || !password) return;
    dispatch(clearError());
    dispatch(registerUser({ name, email, phone, password }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.accentLine} />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MCommerce today</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            {[
              { label: 'Full Name', value: name, setter: setName, placeholder: 'John Doe', keyboardType: 'default' as const },
              { label: 'Email Address', value: email, setter: setEmail, placeholder: 'you@example.com', keyboardType: 'email-address' as const },
              { label: 'Phone Number', value: phone, setter: setPhone, placeholder: '+254 700 000 000', keyboardType: 'phone-pad' as const },
            ].map((field) => (
              <View key={field.label} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.keyboardType === 'default' ? 'words' : 'none'}
                />
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING['2xl'] },
  header: { marginBottom: SPACING.xl },
  accentLine: { width: 48, height: 4, backgroundColor: COLORS.secondary, marginBottom: SPACING.md, borderRadius: 2 },
  title: { fontSize: FONT_SIZES['4xl'], fontWeight: '800', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary },
  errorContainer: { backgroundColor: '#FEE2E2', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 4, borderLeftColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: FONT_SIZES.sm },
  form: { gap: SPACING.md },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text },
  input: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 4, fontSize: FONT_SIZES.base, color: COLORS.text },
  registerButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  buttonDisabled: { opacity: 0.7 },
  registerButtonText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl, paddingBottom: SPACING.lg },
  footerText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.base },
  footerLink: { color: COLORS.primary, fontSize: FONT_SIZES.base, fontWeight: '700' },
});
