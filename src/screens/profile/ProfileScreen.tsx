import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';

const MENU_ITEMS = [
  { icon: '📋', label: 'My Orders', screen: 'Orders' },
  { icon: '📍', label: 'Saved Addresses', screen: 'Addresses' },
  { icon: '💳', label: 'Payment Methods', screen: 'Payments' },
  { icon: '❤️', label: 'Wishlist', screen: 'Wishlist' },
  { icon: '🔔', label: 'Notifications', screen: 'Notifications' },
  { icon: '🔒', label: 'Security & Privacy', screen: 'Security' },
  { icon: '❓', label: 'Help & Support', screen: 'Support' },
];

export const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            {user?.phone && (
              <Text style={styles.profilePhone}>{user.phone}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MCommerce v1.0.0 · TerraSept Solutions</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: COLORS.white, fontSize: FONT_SIZES['2xl'], fontWeight: '800' },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text },
  profileEmail: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  profilePhone: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  editButton: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2 },
  editButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZES.sm },
  menuSection: { marginTop: SPACING.md, backgroundColor: COLORS.white, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.divider, gap: SPACING.md },
  menuIcon: { fontSize: FONT_SIZES.xl, width: 28 },
  menuLabel: { flex: 1, fontSize: FONT_SIZES.base, color: COLORS.text, fontWeight: '500' },
  menuArrow: { color: COLORS.textMuted, fontSize: FONT_SIZES.xl },
  logoutButton: { margin: SPACING.md, backgroundColor: '#FEE2E2', borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { color: COLORS.error, fontSize: FONT_SIZES.base, fontWeight: '800' },
  version: { textAlign: 'center', color: COLORS.textMuted, fontSize: FONT_SIZES.xs, marginBottom: SPACING.xl },
});
