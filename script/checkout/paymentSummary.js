import { products } from "../../data/products.js";
import { cart } from '../../data/cart.js';
import { deliveryOptions } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/currency.js';
 
export default function renderPaymentSummary() {

  let cartTotalCents = 0;
  let shippingTotalCents = 0;
  
  cart.cartItems.forEach(cartItem => {
    const matchingProduct = products.find(product => cartItem.productId === product.id);
    cartTotalCents += cartItem.quantity * matchingProduct.priceCents;
    
    const deliveryOption = deliveryOptions.find(option => cartItem.deliveryOption === option.id);
    shippingTotalCents += deliveryOption.priceCents;
  })
  
  let totalBeforetaxCents = cartTotalCents + shippingTotalCents;
  let taxCents = totalBeforetaxCents * .1;
  let totalPriceCents = totalBeforetaxCents + taxCents;

  const paymentSummaryHTML = `
  <div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${cart.calculateQuantity()}):</div>
    <div class="payment-summary-money">$${formatCurrency(cartTotalCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">$${formatCurrency(shippingTotalCents)}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(totalBeforetaxCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">$${formatCurrency(totalPriceCents)}</div>
  </div>

  <button class="place-order-button button-primary">
    Place your order
  </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

}