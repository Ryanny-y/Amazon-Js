import { cart } from '../data/cart.js';

export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999
  }
]

export function updateDeliveryOption(productId, newDeliveryOption) {
  const matchingItem = cart.cartItems.find(cartItem => productId === cartItem.productId);
  matchingItem.deliveryOption = newDeliveryOption;
  cart.saveToStorage();
}