import { products } from "../../data/products.js";
import { cart } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { formatCurrency } from '../utils/money.js';
import { orders } from "../../data/orders.js";
import { renderOrderSummary } from './orderSummary.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach(cartItem => {
    const matchingProduct = products.find(product => cartItem.productId === product.id);
    const deliveryOption = deliveryOptions.find(option => option.deliveryOptionId === cartItem.deliveryOptionId);
    productPriceCents += matchingProduct.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * .10;
  const totalPriceCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
  <div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${cart.calculateQuantity()}):</div>
    <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">$${formatCurrency(totalPriceCents)}</div>
  </div>

  <button class="place-order-button button-primary js-place-order-button">
    Place your order
  </button>
  </div>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  const orderBtn = document.querySelector('.js-place-order-button');
  orderBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart.cartItems
        })
      });
      const order = await response.json();
      orders.addOrder(order);
      cart.clearCart();
      renderOrderSummary();
      renderPaymentSummary();
    } catch(err) {
      console.log(err);
    }
   
    window.location.href = 'orders.html';
  });
}