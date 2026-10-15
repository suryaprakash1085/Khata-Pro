// khata-mobile/lib/notificationRoute.ts
export function getNotificationRoute(n: any): any | null {
  const type: string = n?.type ?? '';

  if (type === 'low_stock' && n.product_id) {
    return { pathname: '/restock', params: { id: String(n.product_id) } };
  }
  if (type === 'new_order') return '/delivery-list';
  if (type === 'order_return' || type === 'return_requested') return '/order-returns';
  if (type.startsWith('vendor_payment')) return '/reports';
  if (type.startsWith('subscription_')) return '/subscription-status';
  return null;
}