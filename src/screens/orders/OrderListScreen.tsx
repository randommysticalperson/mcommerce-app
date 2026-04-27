import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchOrders } from '../../store/slices/ordersSlice';
import { Order } from '../../types';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#8B5CF6',
  shipped: '#06B6D4',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

export const OrderListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(-8).toUpperCase()}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[item.status] + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.orderDate}>
        {new Date(item.createdAt).toLocaleDateString('en-KE', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </Text>
      <View style={styles.orderFooter}>
        <Text style={styles.itemCount}>{item.items.length} item(s)</Text>
        <Text style={styles.orderTotal}>
          {item.currency} {item.total.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: SPACING.xl }} color={COLORS.primary} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>
                Your order history will appear here
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  list: { padding: SPACING.md, gap: SPACING.md },
  orderCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.xs },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.text },
  statusBadge: { borderRadius: RADIUS.full, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  statusText: { fontSize: FONT_SIZES.xs, fontWeight: '700' },
  orderDate: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xs },
  itemCount: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  orderTotal: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.primary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, paddingTop: SPACING['2xl'] },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: FONT_SIZES['2xl'], fontWeight: '800', color: COLORS.text },
  emptySubtitle: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, textAlign: 'center' },
});
