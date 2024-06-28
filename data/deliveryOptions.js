import { cart } from './cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.11/esm/index.js';

export const deliveryOptions = [
  {
    deliveryOptionId: '1',
    deliveryDays: 7,
    priceCents: 0
  }, {
    deliveryOptionId: '2',
    deliveryDays: 3,
    priceCents: 499
  }, {
    deliveryOptionId: '3',
    deliveryDays: 1,
    priceCents: 999
  }
]

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.cartItems.find(cartItem => cartItem.productId === productId);
  matchingItem.deliveryOptionId = deliveryOptionId;
  cart.saveToStorage();
}

export function deliveryDays(deliveryOption) {
  const today = dayjs();
  const deliveryDay = today.add(deliveryOption.deliveryDays, 'days');
  const dayString = deliveryDay.format('dddd, MMMM D');
  return dayString;
}