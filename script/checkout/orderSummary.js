import { cart } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/currency.js';
import { deliveryOptions, updateDeliveryOption } from '../../data/deliveryOptions.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.11/esm/index.js';
import renderPaymentSummary from './paymentSummary.js';

export default function renderOrderSummary() {

  const itemSummaryHTML = cart.cartItems.map(cartItem => {
    const matchingProduct = products.find(product => cartItem.productId === product.id);

    const deliveryOption = deliveryOptions.find(option => option.id === cartItem.deliveryOption);
    const deliveryDay = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

    return `
    <div class="cart-item-container js-cart-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${deliveryDay}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src=${matchingProduct.image}>

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Save
            </span>
            <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${renderDeliveryOptions(cartItem, matchingProduct)}
        </div>
      </div>
    </div>`
  });

  document.querySelector('.js-order-summary').innerHTML = itemSummaryHTML;

  // CHECKOUT QUANTITY
  document.querySelector('.return-to-home-link').textContent = cart.calculateQuantity();

  // REMOVE FROM CART
  const deleteBtns = document.querySelectorAll('.delete-quantity-link');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => { 
      const { productId } = btn.dataset;
      const cartContainer = document.querySelector(`.js-cart-container-${productId}`);
      cart.removeFromCart(productId);
      cartContainer.remove();
      renderOrderSummary();
      renderPaymentSummary();
    })
  });

  // DELIVERY OPTIONS
  function renderDeliveryOptions(cartItem, matchingProduct) {
    return deliveryOptions.map(deliveryOption => {
      const deliveryDay = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');
      const shippingPrice = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - `;
      const isChecked = cartItem.deliveryOption === deliveryOption.id ? 'checked' : '';

      return `
      <div class="delivery-option">
        <input type="radio"
          data-product-id="${matchingProduct.id}"
          data-delivery-option="${deliveryOption.id}"
          name="${matchingProduct.id}" ${isChecked}
          class="delivery-option-input js-delivery-option-input">
        <div>
          <div class="delivery-option-date">
            ${deliveryDay}
          </div>
          <div class="delivery-option-price">
            ${shippingPrice} Shipping
          </div>
        </div>
      </div>
      `
    }).join('');
  }
  
  // Update Delivery Option
  const deliveryInputsEl = document.querySelectorAll('.js-delivery-option-input');
  deliveryInputsEl.forEach(inputEl => {
    inputEl.addEventListener('click', () => {
        const { productId, deliveryOption } = inputEl.dataset;      
        updateDeliveryOption(productId, deliveryOption)
        renderOrderSummary();
        renderPaymentSummary();
    });
  })

  // Update Quantity
  const updateBtns = document.querySelectorAll('.update-quantity-link');
  updateBtns.forEach(updateBtn => {
    updateBtn.addEventListener('click', () => {
      const { productId } = updateBtn.dataset;
      const cartContainer = document.querySelector(`.js-cart-container-${productId}`);
      cartContainer.classList.add('is-editing-quantity');
    });
  })

  const saveBtns = document.querySelectorAll('.save-quantity-link');
  saveBtns.forEach(saveBtn => {
    saveBtn.addEventListener('click', () => {
      const { productId } = saveBtn.dataset;
      const cartContainer = document.querySelector(`.js-cart-container-${productId}`);
      
      const newQuantity = Number(document.querySelector(`.quantity-input-${productId}`).value);
      cart.updateQuantity(productId, newQuantity);
      renderOrderSummary();
      renderPaymentSummary()
      cartContainer.classList.remove('is-editing-quantity');
    })  
  });

};