// Place this file at app/driver-list.tsx
//
// Admin screen: shows all drivers for the business, lets the admin add a
// new driver and tap an existing driver to change their status.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import {
  useListDrivers,
  useCreateDriver,
  useUpdateDriver,
  getListDriversQueryKey,
  type Driver,
  type DriverStatus,
  type VehicleType,
} from '@workspace/api-client-react';

const FONT_FAMILY = Platform.OS === 'web' ? 'Times New Roman' : 'serif';
const LIMIT = 100;

const STATUS_META: Record<DriverStatus, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#15803D', bg: '#DCFCE7' },
  busy: { label: 'Busy', color: '#B45309', bg: '#FEF3C7' },
  offline: { label: 'Offline', color: '#6B7280', bg: '#F3F4F6' },
};

const STATUS_FILTERS: { value: DriverStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' },
];

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'bike', label: 'Bike' },
  { value: 'auto', label: 'Auto' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Truck' },
];

const STATUS_OPTIONS: { value: DriverStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' },
];

export default function DriverListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<DriverStatus | 'all'>('all');
  const [searchText, setSearchText] = useState('');

  // ---- Add driver modal ----
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('bike');
  const [formError, setFormError] = useState<string | null>(null);

  // ---- Status-change modal ----
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const driverParams = {
    business_id: business?.id as number,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchText.trim() || undefined,
    limit: LIMIT,
  };
  const {
    data: driverData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useListDrivers(driverParams, {
    query: { enabled: !!business?.id, queryKey: getListDriversQueryKey(driverParams) },
  });

  const drivers: Driver[] = driverData?.data ?? [];
  const total = driverData?.total ?? 0;

  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();

  const resetForm = () => {
    setName('');
    setPhone('');
    setVehicleNumber('');
    setVehicleType('bike');
    setFormError(null);
  };

  const handleCreateDriver = () => {
    setFormError(null);
    if (!name.trim() || !phone.trim()) {
      setFormError('Name and phone are required.');
      return;
    }
    if (!business?.id) return;

    createDriver.mutate(
      {
        data: {
          business_id: business.id,
          name: name.trim(),
          phone: phone.trim(),
          vehicle_number: vehicleNumber.trim() || undefined,
          vehicle_type: vehicleType,
          status: 'offline',
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/drivers'], exact: false });
          setAddModalOpen(false);
          resetForm();
        },
        onError: () => setFormError('Could not add driver. Please try again.'),
      },
    );
  };

  const handleChangeStatus = (status: DriverStatus) => {
    if (!selectedDriver) return;
    updateDriver.mutate(
      { id: selectedDriver.id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/drivers'], exact: false });
          setSelectedDriver(null);
        },
      },
    );
  };

  const renderDriverCard = ({ item }: { item: Driver }) => {
    const meta = STATUS_META[item.status];
    return (
      <Pressable
        onPress={() => setSelectedDriver(item)}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          pressed && { backgroundColor: colors.muted },
        ]}
      >
        <View style={styles.cardTopRow}>
          <Text style={[styles.driverName, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
            <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Feather name="phone" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.phone}</Text>
          <Text style={[styles.metaDot, { color: colors.mutedForeground }]}>•</Text>
          <Feather name="truck" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {item.vehicle_type}
            {item.vehicle_number ? ` (${item.vehicle_number})` : ''}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Drivers</Text>
          <Pressable
            onPress={() => setAddModalOpen(true)}
            style={[styles.addDriverBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          >
            <Feather name="plus" size={14} color={colors.primaryForeground} />
            <Text style={[styles.addDriverBtnText, { color: colors.primaryForeground }]}>Add Driver</Text>
          </Pressable>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          {total} driver{total === 1 ? '' : 's'}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by name or phone..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')} hitSlop={8}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Status filter chips */}
      <View style={styles.filterStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterStrip}
          contentContainerStyle={styles.filterStripContent}
        >
          {STATUS_FILTERS.map((f) => {
            const active = f.value === statusFilter;
            return (
              <Pressable
                key={f.value}
                onPress={() => setStatusFilter(f.value)}
                style={[
                  styles.filterChip,
                  {
                    borderRadius: colors.radius,
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 12, fontFamily: FONT_FAMILY }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : isError ? (
        <View style={styles.errorBox}>
          <Feather name="alert-triangle" size={20} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.destructive }]}>Could not load drivers.</Text>
          <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={{ color: colors.primary, fontSize: 13, fontFamily: FONT_FAMILY }}>Retry</Text>
          </Pressable>
        </View>
      ) : drivers.length === 0 ? (
        <EmptyState
          icon="users"
          title={searchText ? 'No matching drivers' : 'No drivers yet'}
          subtitle={searchText ? 'Try a different name or phone number.' : 'Tap Add Driver to add your first delivery driver.'}
        />
      ) : (
        <FlatList
          data={drivers}
          keyExtractor={(item) => `driver-${item.id}`}
          renderItem={renderDriverCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 20 }}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      )}

      {/* Add Driver modal */}
      <Modal
        visible={addModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setAddModalOpen(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Add Driver</Text>
              <Pressable
                onPress={() => {
                  setAddModalOpen(false);
                  resetForm();
                }}
                hitSlop={8}
              >
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 4 }}>
              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Name *</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Driver's full name"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.fieldInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Phone *</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="10-digit phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.fieldInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Vehicle Number</Text>
                <TextInput
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                  placeholder="e.g. TN 37 AB 1234"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.fieldInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Vehicle Type</Text>
                <View style={styles.chipsRow}>
                  {VEHICLE_TYPES.map((v) => {
                    const active = v.value === vehicleType;
                    return (
                      <Pressable
                        key={v.value}
                        onPress={() => setVehicleType(v.value)}
                        style={[
                          styles.chip,
                          {
                            borderRadius: colors.radius,
                            backgroundColor: active ? colors.primary : colors.background,
                            borderColor: active ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 13, fontFamily: FONT_FAMILY }}>
                          {v.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {formError ? <Text style={[styles.errorText, { color: colors.destructive, marginBottom: 8 }]}>{formError}</Text> : null}

              <PrimaryButton
                label="Add Driver"
                onPress={handleCreateDriver}
                loading={createDriver.isPending}
                style={{ marginTop: 8 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Change status modal */}
      <Modal
        visible={!!selectedDriver}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDriver(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>{selectedDriver?.name}</Text>
              <Pressable onPress={() => setSelectedDriver(null)} hitSlop={8}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.mutedForeground, marginTop: 6, marginBottom: 10 }]}>
              Update status
            </Text>

            {STATUS_OPTIONS.map((s) => {
              const active = selectedDriver?.status === s.value;
              return (
                <Pressable
                  key={s.value}
                  disabled={updateDriver.isPending}
                  onPress={() => handleChangeStatus(s.value)}
                  style={[
                    styles.statusOptionRow,
                    {
                      borderColor: active ? colors.primary : colors.border,
                      backgroundColor: active ? colors.muted : 'transparent',
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <View style={[styles.statusDot, { backgroundColor: STATUS_META[s.value].color }]} />
                  <Text style={[styles.statusOptionText, { color: colors.foreground }]}>{s.label}</Text>
                  {active && <Feather name="check" size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontFamily: FONT_FAMILY, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 4 },
  addDriverBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  addDriverBtnText: { fontSize: 13, fontFamily: FONT_FAMILY, fontWeight: '600' },

  searchSection: { paddingHorizontal: 16, paddingTop: 12 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: FONT_FAMILY },

  filterStripWrap: { paddingTop: 10, paddingBottom: 4 },
  filterStrip: { flexGrow: 0, height: 44 },
  filterStripContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },

  card: { borderWidth: 1, padding: 14, marginBottom: 10 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  driverName: { fontSize: 15, fontFamily: FONT_FAMILY, fontWeight: '700', flex: 1, marginRight: 8 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontFamily: FONT_FAMILY, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  metaText: { fontSize: 12, fontFamily: FONT_FAMILY },
  metaDot: { fontSize: 12, marginHorizontal: 2 },

  errorBox: { alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, paddingHorizontal: 20 },
  errorText: { fontSize: 13, fontFamily: FONT_FAMILY },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 420, maxHeight: '85%', padding: 22, borderRadius: 16 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 18, fontFamily: FONT_FAMILY, fontWeight: '700', flex: 1, marginRight: 10 },
  modalField: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontFamily: FONT_FAMILY, marginBottom: 6 },
  fieldInput: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: FONT_FAMILY, borderRadius: 6 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1 },

  statusOptionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, marginBottom: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusOptionText: { flex: 1, fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '600' },
});