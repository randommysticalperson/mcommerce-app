import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { CartItem } from '../../types';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';

export const CartScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, currency } = useSelector((state: RootState) => state.cart);

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImagePlaceholder} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.itemPrice}>
          {item.product.currency} {item.product.price.toLocaleString()}
        </Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() =>
              dispatch(
                updateQuantity({
                  productId: item.product.id,
                  quantity: item.quantity - 1,
                })
              )
            }
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() =>
              dispatch(
                updateQuantity({
                  productId: item.product.id,
                  quantity: item.quantity + 1,
                })
              )
            }
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => dispatch(removeFromCart(item.product.id))}
        style={styles.removeButton}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add products to your cart to get started
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={() => dispatch(clearCart())}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>
            {currency} {total.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  clearText: { color: COLORS.error, fontSize: FONT_SIZES.sm, fontWeight: '600' },
  list: { padding: SPACING.md, gap: SPACING.md },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImagePlaceholder: { width: 100, height: 100, backgroundColor: COLORS.divider },
  itemDetails: { flex: 1, padding: SPACING.sm, gap: SPACING.xs },
  itemTitle: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text },
  itemPrice: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.primary },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { color: COLORS.primary, fontSize: FONT_SIZES.lg, fontWeight: '800' },
  qtyText: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.text, minWidth: 20, textAlign: 'center' },
  removeButton: { padding: SPACING.sm },
  removeText: { color: COLORS.textMuted, fontSize: FONT_SIZES.base },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: FONT_SIZES['2xl'], fontWeight: '800', color: COLORS.text },
  emptySubtitle: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, textAlign: 'center' },
  footer: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textSecondary },
  totalAmount: { fontSize: FONT_SIZES['2xl'], fontWeight: '800', color: COLORS.text },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  checkoutButtonText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '800' },
});
