// Customer app — return request modal.
// Rules: 1+ product, a reason, at least 1 photo AND 1 video (mandatory).
// Files are uploaded at submit time, then the return request is created.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ordersApi, CustomerOrder, CustomerOrderItem, ReturnReason } from '../../api/orders';
import { pickMedia, PickedMedia, PickKind } from './pickMedia';

// ── Design tokens (same as OrdersScreen) ─────────────────────────
const PURPLE = '#6C5CE7';
const PURPLE_DARK = '#5541D7';
const PURPLE_LIGHT = '#F1EEFF';
const PURPLE_SOFT = '#EDE9FE';
const DANGER = '#EF4444';
const DANGER_BG = '#FEE2E2';
const TEXT_MAIN = '#1E1B2E';
const TEXT_SECONDARY = '#8A85A0';
const BORDER = '#EFEDF7';
const BG = '#FFFFFF';
const BG_SOFT = '#FAFAFD';

const FONT_FAMILY = Platform.select({
  web: "'Times New Roman', Times, serif",
  default: 'Times New Roman',
}) as string;

const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const RETURN_REASONS: { key: ReturnReason; label: string; icon: string }[] = [
  { key: 'EXPIRED_PRODUCT', label: 'Expired product', icon: 'calendar-outline' },
  { key: 'WRONG_PRODUCT', label: 'Wrong product delivered', icon: 'swap-horizontal-outline' },
  { key: 'DAMAGED', label: 'Damaged product', icon: 'warning-outline' },
  { key: 'MISSING_ITEM', label: 'Item missing', icon: 'help-circle-outline' },
  { key: 'OTHER', label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

type Slot = PickedMedia & { id: string };

type Props = {
  order: CustomerOrder | null;
  isDesktopWeb: boolean;
  onClose: () => void;
  onSubmitted: (orderId: number) => void;
};

const ReturnRequestModal: React.FC<Props> = ({ order, isDesktopWeb, onClose, onSubmitted }) => {
  const [items, setItems] = useState<CustomerOrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [reason, setReason] = useState<ReturnReason | null>(null);
  const [desc, setDesc] = useState('');
  const [photos, setPhotos] = useState<Slot[]>([]);
  const [video, setVideo] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // slot.id -> uploaded url, so a retry after a failed request doesn't re-upload
  const uploadedRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!order) return;
    let cancelled = false;

    setItems([]);
    setSelected({});
    setReason(null);
    setDesc('');
    setPhotos([]);
    setVideo(null);
    setError(null);
    setProgress(null);
    uploadedRef.current = {};
    setItemsLoading(true);

    ordersApi
      .getOrderTracking(order.id)
      .then((detail: any) => {
        if (cancelled) return;
        const list: CustomerOrderItem[] = detail?.items ?? [];
        setItems(list);
        // Single-product order: pre-select it
        if (list.length === 1) setSelected({ [list[0].product_id]: true });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load order items. Please close and try again.');
      })
      .finally(() => {
        if (!cancelled) setItemsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [order?.id]);

  const close = () => {
    if (submitting) return;
    onClose();
  };

  const toggleItem = (it: CustomerOrderItem) => {
    setError(null);
    setSelected((prev) => {
      const next = { ...prev };
      if (next[it.product_id]) delete next[it.product_id];
      else next[it.product_id] = true;
      return next;
    });
  };

  const addMedia = async (kind: PickKind) => {
    setError(null);
    try {
      const picked = await pickMedia(kind);
      if (!picked) return;
      const max = kind === 'photo' ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES;
      if (picked.size && picked.size > max) {
        setError(`${kind === 'photo' ? 'Photo' : 'Video'} is too large (max ${max / 1024 / 1024} MB).`);
        return;
      }
      const slot: Slot = { ...picked, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
      if (kind === 'photo') setPhotos((p) => [...p, slot]);
      else setVideo(slot);
    } catch (e: any) {
      setError(e?.message || 'Could not open your gallery.');
    }
  };

  const uploadSlot = async (slot: Slot): Promise<string> => {
    const cached = uploadedRef.current[slot.id];
    if (cached) return cached;
    const res: any = await ordersApi.uploadReturnMedia(slot);
    uploadedRef.current[slot.id] = res.url;
    return res.url as string;
  };

  const submit = async () => {
    if (!order) return;
    setError(null);

    const productIds = items.filter((it) => selected[it.product_id]).map((it) => it.product_id);
    if (productIds.length === 0) return setError('Please select the product(s) you want to return.');
    if (!reason) return setError('Please select a reason for the return.');
    if (reason === 'OTHER' && !desc.trim()) return setError('Please describe the issue.');
    if (photos.length === 0) return setError('Please add at least one photo of the product.');
    if (!video) return setError('Please add a short video of the product.');

    try {
      setSubmitting(true);

      const all: Slot[] = [...photos, video];
      const media: { type: 'photo' | 'video'; url: string }[] = [];
      for (let i = 0; i < all.length; i++) {
        setProgress(`Uploading ${i + 1} of ${all.length}...`);
        const url = await uploadSlot(all[i]);
        media.push({ type: all[i].kind, url });
      }

            setProgress('Submitting request...');
      const returnItems = items
        .filter((it) => selected[it.product_id])
        .map((it) => ({ product_id: it.product_id, qty: it.qty }));

      await ordersApi.requestReturn(order.id, {
        items: returnItems,
        reason,
        description: desc.trim() || undefined,
        media,
      });

      setSubmitting(false);
      setProgress(null);
      onSubmitted(order.id);
    } catch (err: any) {
      setSubmitting(false);
      setProgress(null);
      setError(
        err?.response?.data?.error || err?.error || err?.message || 'Could not submit return request. Please try again.',
      );
    }
  };

  const renderThumb = (slot: Slot, onRemove: () => void) => (
    <View key={slot.id} style={styles.thumbWrap}>
      {slot.kind === 'photo' ? (
        <Image source={{ uri: slot.uri }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.videoThumb]}>
          <Icon name="play-circle" size={26} color="#fff" />
          <Text style={styles.videoThumbText} numberOfLines={1}>
            {slot.name}
          </Text>
        </View>
      )}
      {!submitting && (
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <Icon name="close" size={12} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal visible={!!order} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, isDesktopWeb && styles.modalCardDesktop]}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Return Order #{order?.id}</Text>
            <TouchableOpacity onPress={close} style={styles.modalCloseBtn}>
              <Icon name="close" size={20} color={TEXT_MAIN} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.hintBox}>
              <Icon name="information-circle-outline" size={15} color={PURPLE_DARK} />
              <Text style={styles.hintText}>
                Returns must be requested within 24 hours of delivery. A photo and a short video of the product are required.
              </Text>
            </View>

            <Text style={styles.modalLabel}>Which product are you returning?</Text>
            {itemsLoading ? (
              <ActivityIndicator size="small" color={PURPLE} style={{ marginVertical: 14 }} />
            ) : (
              items.map((it) => {
                const isSel = !!selected[it.product_id];
                return (
                  <TouchableOpacity
                    key={it.id}
                    style={[styles.reasonRow, isSel && styles.reasonRowSelected]}
                    onPress={() => toggleItem(it)}
                    activeOpacity={0.8}
                  >
                    <Icon name={isSel ? 'checkbox' : 'square-outline'} size={20} color={isSel ? PURPLE : '#c9c6d8'} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.itemNameText, isSel && styles.reasonTextSelected]} numberOfLines={1}>
                        {it.product_name}
                      </Text>
                      <Text style={styles.itemSubText}>
                        Ordered: {it.qty} × ₹{it.unit_price}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            <Text style={[styles.modalLabel, { marginTop: 8 }]}>Why are you returning it?</Text>
            {RETURN_REASONS.map((r) => {
              const isSel = reason === r.key;
              return (
                <TouchableOpacity
                  key={r.key}
                  style={[styles.reasonRow, isSel && styles.reasonRowSelected]}
                  onPress={() => {
                    setReason(r.key);
                    setError(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Icon name={r.icon as any} size={18} color={isSel ? PURPLE : TEXT_SECONDARY} />
                  <Text style={[styles.reasonText, isSel && styles.reasonTextSelected]}>{r.label}</Text>
                  <Icon name={isSel ? 'radio-button-on' : 'radio-button-off'} size={20} color={isSel ? PURPLE : '#c9c6d8'} />
                </TouchableOpacity>
              );
            })}

            <TextInput
              style={styles.reasonInput}
              placeholder="Describe the issue (required for 'Other')"
              placeholderTextColor={TEXT_SECONDARY}
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* ── Evidence ─────────────────────────────────────── */}
            <Text style={[styles.modalLabel, { marginTop: 16 }]}>Add proof (required)</Text>

            <Text style={styles.subLabel}>
              Photos ({photos.length}/{MAX_PHOTOS})
            </Text>
            <View style={styles.mediaRow}>
              {photos.map((p) => renderThumb(p, () => setPhotos((prev) => prev.filter((x) => x.id !== p.id))))}
              {photos.length < MAX_PHOTOS && (
                <TouchableOpacity
                  style={styles.addTile}
                  onPress={() => addMedia('photo')}
                  disabled={submitting}
                  activeOpacity={0.8}
                >
                  <Icon name="camera-outline" size={22} color={PURPLE} />
                  <Text style={styles.addTileText}>Add photo</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.subLabel}>Video ({video ? 1 : 0}/1)</Text>
            <View style={styles.mediaRow}>
              {video && renderThumb(video, () => setVideo(null))}
              {!video && (
                <TouchableOpacity
                  style={styles.addTile}
                  onPress={() => addMedia('video')}
                  disabled={submitting}
                  activeOpacity={0.8}
                >
                  <Icon name="videocam-outline" size={22} color={PURPLE} />
                  <Text style={styles.addTileText}>Add video</Text>
                </TouchableOpacity>
              )}
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Icon name="alert-circle-outline" size={15} color={DANGER} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitReturnBtn, submitting && { opacity: 0.7 }]}
              onPress={submit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.submitReturnText}>{progress ?? 'Please wait...'}</Text>
                </View>
              ) : (
                <Text style={styles.submitReturnText}>Submit Return Request</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(30,27,46,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: BG,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '92%',
  },
  modalCardDesktop: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderRadius: 24,
    marginBottom: 'auto' as any,
    marginTop: 'auto' as any,
  },
  modalHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: BORDER, marginBottom: 12 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  modalTitle: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '800', color: TEXT_MAIN },
  modalCloseBtn: { padding: 4, backgroundColor: BG_SOFT, borderRadius: 20 },
  modalLabel: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: TEXT_MAIN, marginBottom: 10 },
  subLabel: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 8 },

  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  hintText: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 12.5, color: PURPLE_DARK, lineHeight: 17 },

  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
    backgroundColor: BG,
  },
  reasonRowSelected: { borderColor: PURPLE, backgroundColor: PURPLE_LIGHT },
  itemNameText: { fontFamily: FONT_FAMILY, fontSize: 14, color: TEXT_MAIN },
  itemSubText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: TEXT_SECONDARY, marginTop: 2 },
  reasonText: { flex: 1, marginLeft: 10, fontFamily: FONT_FAMILY, fontSize: 14, color: TEXT_MAIN },
  reasonTextSelected: { fontWeight: '700', color: PURPLE_DARK },
  reasonInput: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    minHeight: 78,
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    color: TEXT_MAIN,
    backgroundColor: BG_SOFT,
  },

  mediaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  thumbWrap: { position: 'relative' },
  thumb: { width: 84, height: 84, borderRadius: 12, backgroundColor: BORDER },
  videoThumb: { backgroundColor: '#1E1B2E', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, gap: 4 },
  videoThumbText: { color: '#fff', fontSize: 9.5, fontFamily: FONT_FAMILY, maxWidth: 72 },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DANGER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    width: 84,
    height: 84,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: PURPLE,
    backgroundColor: PURPLE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addTileText: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700', color: PURPLE },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: DANGER_BG,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  errorText: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 12.5, color: DANGER },

  submitReturnBtn: { marginTop: 16, backgroundColor: PURPLE, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  submitReturnText: { color: '#ffffff', fontFamily: FONT_FAMILY, fontSize: 15.5, fontWeight: '700' },
});

export default ReturnRequestModal;