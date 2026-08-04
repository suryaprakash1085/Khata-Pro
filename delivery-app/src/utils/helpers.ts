export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(0)}`;
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const getInitials = (name: string): string => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateOrderId = (): string => {
  return 'ORD' + Date.now().toString(36).toUpperCase();
};

export const getDeliveryFee = (distance: number): number => {
  if (distance <= 3) return 28;
  if (distance <= 6) return 47;
  if (distance <= 10) return 69;
  return 99;
};

export const getEstimatedDelivery = (distance: number): number => {
  const baseTime = 20;
  const timePerKm = 3;
  return Math.round(baseTime + distance * timePerKm);
};