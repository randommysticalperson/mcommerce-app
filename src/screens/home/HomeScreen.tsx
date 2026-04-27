import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchFeaturedProducts, fetchCategories } from '../../store/slices/productsSlice';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';
import { Product, Category } from '../../types';

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, categories, isLoading } = useSelector(
    (state: RootState) => state.products
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImagePlaceholder} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productVendor}>{item.vendorName}</Text>
        <Text style={styles.productPrice}>
          {item.currency} {item.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryChip}>
      <Text style={styles.categoryChipText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(' ')[0] || 'Shopper'} 👋
            </Text>
            <Text style={styles.subGreeting}>What are you looking for today?</Text>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Search products...</Text>
        </TouchableOpacity>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Shop Smarter</Text>
          <Text style={styles.bannerSubtitle}>
            Discover thousands of products from local vendors
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <FlatList
              data={categories}
              renderItem={renderCategoryChip}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          )}
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <FlatList
              data={featuredProducts}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchBar: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchPlaceholder: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.base,
  },
  banner: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    minHeight: 120,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  bannerSubtitle: {
    color: COLORS.primaryLight,
    fontSize: FONT_SIZES.base,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  categoriesList: {
    paddingBottom: SPACING.sm,
  },
  categoryChip: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginRight: SPACING.sm,
  },
  categoryChipText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  productsList: {
    paddingBottom: SPACING.sm,
  },
  productCard: {
    width: 180,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.divider,
  },
  productInfo: {
    padding: SPACING.sm,
  },
  productTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  productVendor: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  productPrice: {
    fontSize: FONT_SIZES.base,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
