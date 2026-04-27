import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { searchProducts, setSearchQuery } from '../../store/slices/productsSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Product } from '../../types';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';

export const SearchScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, searchQuery, isLoading } = useSelector(
    (state: RootState) => state.products
  );
  const [localQuery, setLocalQuery] = useState('');

  const handleSearch = () => {
    if (!localQuery.trim()) return;
    dispatch(setSearchQuery(localQuery));
    dispatch(searchProducts(localQuery));
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productRow}>
      <View style={styles.productImagePlaceholder} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productVendor}>{item.vendorName}</Text>
        <Text style={styles.productPrice}>
          {item.currency} {item.price.toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => dispatch(addToCart(item))}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={localQuery}
          onChangeText={setLocalQuery}
          placeholder="Search for products..."
          placeholderTextColor={COLORS.textMuted}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: SPACING.xl }} color={COLORS.primary} />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searchQuery ? (
              <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
            ) : (
              <Text style={styles.emptyText}>Start searching for products above</Text>
            )
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
  searchRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm },
  searchInput: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 4, fontSize: FONT_SIZES.base, color: COLORS.text },
  searchButton: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, justifyContent: 'center' },
  searchButtonText: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZES.base },
  list: { padding: SPACING.md, gap: SPACING.md },
  productRow: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  productImagePlaceholder: { width: 80, height: 80, backgroundColor: COLORS.divider },
  productInfo: { flex: 1, padding: SPACING.sm, gap: 2 },
  productTitle: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text },
  productVendor: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  productPrice: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.primary },
  addButton: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs + 2, marginRight: SPACING.sm },
  addButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZES.sm },
  emptyText: { textAlign: 'center', color: COLORS.textSecondary, marginTop: SPACING.xl, fontSize: FONT_SIZES.base },
});
