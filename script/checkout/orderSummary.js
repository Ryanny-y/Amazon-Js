import { cart } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.11/esm/index.js';
import { deliveryOptions, updateDeliveryOption, deliveryDays } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  const orderSummaryHTML = cart.cartItems.map(cartItem => {
    const matchingProduct = products.find(product => cartItem.productId === product.id);
    const deliveryOption = deliveryOptions.find(option => option.deliveryOptionId === cartItem.deliveryOptionId);
    const dayString = deliveryDays(deliveryOption);

    return `<div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dayString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link js-delete-quantity-link link-primary js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          
          ${displayDeliveryOption(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `
  }).join('');

  document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

  function displayDeliveryOption(matchingProduct, cartItem) {
    return deliveryOptions.map(deliveryOption => {
      const dayString = deliveryDays(deliveryOption);
      const deliveryPrice = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;
      const checked = cartItem.deliveryOptionId === deliveryOption.deliveryOptionId ? 'checked' : '';

      return `
      <div class="delivery-option">
        <input type="radio"
          ${checked}
          class="delivery-option-input js-delivery-option"
          name="delivery-option-${matchingProduct.id}"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.deliveryOptionId}">
        <div>
          <div class="delivery-option-date">
            ${dayString}
          </div>
          <div class="delivery-option-price">
            ${deliveryPrice}
          </div>
        </div>
      </div>`
    }).join('');
  }

  document.querySelector('.return-to-home-link').textContent = cart.calculateQuantity() + ' items'; 

  // Delete item
  const deleteBtns = document.querySelectorAll('.js-delete-quantity-link');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const { productId } = btn.dataset;
      const cartContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      cart.removeFromCart(productId);
      cartContainer.remove();
      renderOrderSummary();
      renderPaymentSummary();
    })
  });

  // Update quantity
  const updateBtns = document.querySelectorAll('.update-quantity-link');
  updateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const { productId } = btn.dataset; 
      const productContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      productContainer.classList.add('is-editing-quantity');
    }); 
  })
  
  const saveBtns = document.querySelectorAll('.save-quantity-link');
  saveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const { productId } = btn.dataset; 
      const productContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      productContainer.classList.remove('is-editing-quantity');
      quantityInput.innerText = '';
      cart.updateQuantity(productId, Number(quantityInput.value));
      renderOrderSummary();
      renderPaymentSummary();
    });
  })

  // Update delivery Option
  const deliveryOptionBtns = document.querySelectorAll('.js-delivery-option');
  deliveryOptionBtns.forEach(deliveryBtn => {
    deliveryBtn.addEventListener('click', () => {
      const { productId, deliveryOptionId } = deliveryBtn.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderPaymentSummary();
      renderOrderSummary();
    });
  })

}