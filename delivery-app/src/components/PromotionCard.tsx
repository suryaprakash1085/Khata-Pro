
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Promotion } from '../services/promotionService';

const COLORS = {
  primary: '#6C5CE7',
  primaryLight: '#F1EEFF',
  primarySoft: '#EDE9FE',
  success: '#22C55E',
  successBg: '#ECFDF3',
  text: '#1E1B2E',
  subtext: '#8A85A0',
  border: '#EFEDF7',
  bg: '#FFFFFF',
};

interface PromotionCardProps {
  promotion: Promotion;
  isSelected?: boolean;   // 👈 NEW — this card is the one currently chosen (radio-style)
  onSelect?: () => void;  // 👈 NEW — tapping anywhere on the card selects it
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
};

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, isSelected, onSelect }) => {
  const isBogo = promotion.promotion_type === 'bogo';

  const bannerUrl = (promotion as any).banner_image || (promotion as any).image;
  const description = (promotion as any).description;
  const promoCode = (promotion as any).promo_code;
  const minOrderAmount = (promotion as any).min_order_amount;

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.85}
      disabled={!onSelect}
    >
      {/* 👇 NEW — radio indicator, top-right corner */}
      {onSelect && (
        <View style={styles.radioWrap}>
          <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      )}

      {bannerUrl ? (
        <Image source={{ uri: bannerUrl }} style={styles.banner} resizeMode="cover" />
      ) : (
        <View style={[styles.banner, styles.bannerPlaceholder]}>
          <Icon
            name={isBogo ? 'gift-outline' : 'pricetag-outline'}
            size={28}
            color={COLORS.primary}
          />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{promotion.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isBogo ? 'BOGO' : `${promotion.discount_percentage}% OFF`}
            </Text>
          </View>
        </View>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        ) : null}

        {promoCode ? (
          <View style={styles.codeRow}>
            <Icon name="pricetags-outline" size={13} color={COLORS.primary} />
            <Text style={styles.codeText}>{promoCode}</Text>
          </View>
        ) : null}

        {minOrderAmount ? (
          <Text style={styles.minOrder}>Min order ₹{minOrderAmount}</Text>
        ) : null}

        <View style={styles.footerRow}>
          <Icon name="time-outline" size={12} color={COLORS.subtext} />
          <Text style={styles.validity}>
            Valid {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  radioWrap: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#ffffff',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: COLORS.primary,
  },
  banner: {
    width: '100%',
    height: 90,
    backgroundColor: COLORS.primarySoft,
  },
  bannerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginRight: 8,
  },
  badge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.success,
  },
  description: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 4,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  codeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
  },
  minOrder: {
    fontSize: 11,
    color: COLORS.subtext,
    marginTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  validity: {
    fontSize: 10.5,
    color: COLORS.subtext,
    marginLeft: 4,
  },
});

export default PromotionCard;
