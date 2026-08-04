import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';

export const SIDEBAR_WIDTH = 220;

const SIDEBAR_BG = '#0F172A';   
const ACCENT = '#7C3AED';       
const TEXT_MUTED = 'rgba(255,255,255,0.72)';
const BORDER_MUTED = 'rgba(255,255,255,0.10)';

type LeafItem = { key: string; label: string; icon: keyof typeof Feather.glyphMap; path: string };
type HybridItem = { key: string; label: string; icon: keyof typeof Feather.glyphMap; path: string; children: LeafItem[] };
type NavEntry = LeafItem | HybridItem;

const NAV_ITEMS: NavEntry[] = [
  { key: 'home', label: 'Dashboard', icon: 'layout', path: '/' },
  {
    key: 'billing',
    label: 'Billing',
    icon: 'shopping-cart',
    path: '/billing',
    children: [
      { key: 'add-Bill', label: 'Add Bill', icon: 'plus-circle', path: '/billing' },
      { key: 'Bills', label: 'BillingList', icon: 'list', path: '/billing-list' },
    ],
  },
  { key: 'add-customer', label: 'Add Customer', icon: 'file-text', path: '/add-customer' },
  {
    key: 'products',
    label: 'Products',
    icon: 'package',
    path: '#',
    children: [
      { key: 'add-product', label: 'Add Product', icon: 'plus-square', path: '/add-product' },
      { key: 'current-stock-products', label: 'Current Stock Products', icon: 'archive', path: '/product-list' },
      { key: 'out-of-stock-products', label: 'Out Of Stock Products', icon: 'alert-circle', path: '/out-of-stock-products' },
      { key: 'all-products', label: 'All Products', icon: 'list', path: '/all-products' },
    ],
  },

  {
    key: 'transport',
    label: 'Transport',
    icon: 'truck',
    path: '#',
    children: [
      { key: 'deliveries', label: 'Deliveries', icon: 'map-pin', path: '/delivery-list' },
      { key: 'drivers', label: 'Drivers', icon: 'users', path: '/driver-list' },
      { key: 'order-track', label: 'Order Track', icon: 'navigation', path: '/order-track-management' },
    ],
  },
  { key: 'reports', label: 'Reports', icon: 'bar-chart-2', path: '/reports' },
  { key: 'profile', label: 'Profile', icon: 'user', path: '/profile' },
];

function hasChildren(item: NavEntry): item is HybridItem {
  return 'children' in item;
}

export function WebSidebar() {
  const colors = useColors();
  const { business } = useBusiness();
  const pathname = usePathname();

  const initialExpanded: Record<string, boolean> = {};
  NAV_ITEMS.forEach((item) => {
    if (hasChildren(item)) {
      initialExpanded[item.key] = item.children.some((c) => 
        c.path === '/' ? pathname === '/' : pathname?.startsWith(c.path)
      );
    }
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded);

  const toggleGroup = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={[styles.sidebar, { backgroundColor: SIDEBAR_BG }]}>
      <View style={styles.header}>
        <Text style={styles.businessName} numberOfLines={1}>
          {business?.business_name ?? 'KhataPro'}
        </Text>
        <View style={styles.planPill}>
          <Text style={styles.planLabel}>{(business?.plan ?? 'free').toUpperCase()} PLAN</Text>
        </View>
      </View>

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          if (hasChildren(item)) {
            const isExpanded = !!expanded[item.key];
            // Check if any child is currently active
            const hasActiveChild = item.children.some((child) => 
              child.path === '/billing' ? pathname === '/billing' : pathname?.startsWith(child.path)
            );

            return (
              <View key={item.key} style={styles.groupWrap}>
                {/* Parent row will never show the active purple background block now */}
                <View style={styles.hybridRow}>
                  <Pressable
                    onPress={() => {
                      router.push(item.path as any);
                      if (!isExpanded) toggleGroup(item.key);
                    }}
                    style={({ pressed }) => [styles.hybridMain, pressed && styles.itemPressed]}
                  >
                    <Feather name={item.icon} size={17} color="#fff" style={{ width: 22 }} />
                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => toggleGroup(item.key)}
                    hitSlop={10}
                    style={({ pressed }) => [styles.chevronBtn, pressed && styles.itemPressed]}
                  >
                    <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={15} color={TEXT_MUTED} />
                  </Pressable>
                </View>

                {isExpanded && (
                  <View style={styles.childrenWrap}>
                    {item.children.map((child) => {
                      const childActive = child.path === '/billing' 
                        ? pathname === '/billing' 
                        : pathname?.startsWith(child.path);

                      return (
                        <Pressable
                          key={child.key}
                          onPress={() => router.push(child.path as any)}
                          style={({ pressed }) => [
                            styles.subItem,
                            childActive && styles.itemActive,
                            pressed && !childActive && styles.itemPressed,
                          ]}
                        >
                          <View style={styles.subItemDot} />
                          <Feather name={child.icon} size={14} color="#fff" style={{ width: 18 }} />
                          <Text style={[styles.subItemLabel, childActive && styles.itemLabelActive]}>{child.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          }

          const active = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path);
          return (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.path as any)}
              style={({ pressed }) => [styles.item, active && styles.itemActive, pressed && !active && styles.itemPressed]}
            >
              <Feather name={item.icon} size={17} color="#fff" style={{ width: 22 }} />
              <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    minHeight: '100%' as any,
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_MUTED,
  },
  businessName: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Times New Roman',
    fontWeight: '700',
  },
  planPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,58,237,0.18)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 8,
  },
  planLabel: {
    color: '#C4B5FD',
    fontSize: 10,
    fontFamily: 'Times New Roman',
    letterSpacing: 0.5,
  },
  nav: { paddingTop: 10, paddingHorizontal: 10 },
  groupWrap: { marginBottom: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  hybridRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 8 },
  hybridMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 12 },
  chevronBtn: { paddingHorizontal: 12, paddingVertical: 12 },
  childrenWrap: { marginTop: 2, marginBottom: 4 },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  subItemDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  itemPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  itemActive: {
    backgroundColor: ACCENT,
  },
  itemLabel: {
    color: TEXT_MUTED,
    fontSize: 14,
    fontFamily: 'Times New Roman',
  },
  itemLabelActive: {
    color: '#fff',
    fontFamily: 'Times New Roman',
    fontWeight: '600',
  },
  subItemLabel: {
    color: TEXT_MUTED,
    fontSize: 13,
    fontFamily: 'Times New Roman',
  },
});