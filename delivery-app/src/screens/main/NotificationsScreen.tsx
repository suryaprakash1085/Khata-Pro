// delivery-app/src/screens/main/NotificationsScreen.tsx
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { customerNotificationAPI } from '../../api/customerNotifications';

const THEME = {
  primary: '#6C5CE7',
  primaryLight: '#F1EEFF',
  text: '#1E1B2E',
  subtext: '#8A85A0',
  border: '#EFEDF7',
  bgSoft: '#FAFAFD',
};

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  ios: 'Times New Roman',
  android: 'serif',
  default: 'Times New Roman',
});

const ICONS: Record<string, string> = {
  order_confirmed: 'checkmark-circle-outline',
  assigned: 'bicycle-outline',
  picked_up: 'cube-outline',
  out_for_delivery: 'navigate-outline',
  completed: 'gift-outline',
  cancelled: 'close-circle-outline',
};

export default function NotificationsScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await customerNotificationAPI.list(50);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  }, [user?.id]);

  // Load once + poll every 20 seconds
  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const markRead = (n: any) => {
    if (n.isRead) return;
    setItems(prev => prev.map(i => (i.id === n.id ? { ...i, isRead: true } : i)));
    customerNotificationAPI.markRead(n.id).catch(() => {});
  };

  const markAll = () => {
    setItems(prev => prev.map(i => ({ ...i, isRead: true })));
    customerNotificationAPI.markAllRead().catch(() => {});
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          {navigation?.canGoBack?.() && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
              <Icon name="arrow-back" size={22} color={THEME.text} />
            </TouchableOpacity>
          )}
          <Text style={s.title}>Notifications</Text>
        </View>
        <TouchableOpacity onPress={markAll}>
          <Text style={s.link}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => String(i.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={s.empty}>No notifications yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.row, !item.isRead && s.unread]}
            onPress={() => markRead(item)}
            activeOpacity={0.75}
          >
            <View style={s.iconWrap}>
              <Icon
                name={ICONS[item.type] || 'notifications-outline'}
                size={22}
                color={THEME.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              {!!item.title && <Text style={s.rowTitle}>{item.title}</Text>}
              <Text style={s.msg}>{item.message}</Text>
              <Text style={s.time}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            {!item.isRead && <View style={s.dot} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  link: { color: THEME.primary, fontWeight: '600', fontFamily: FONT_FAMILY },
  empty: { textAlign: 'center', color: THEME.subtext, marginTop: 40, fontFamily: FONT_FAMILY },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: THEME.bgSoft,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  unread: { backgroundColor: THEME.primaryLight },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: { fontWeight: '700', color: THEME.text, marginBottom: 2, fontFamily: FONT_FAMILY },
  msg: { color: THEME.text, fontFamily: FONT_FAMILY },
  time: { fontSize: 11, color: THEME.subtext, marginTop: 4, fontFamily: FONT_FAMILY },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: THEME.primary,
    marginLeft: 8,
  },
});