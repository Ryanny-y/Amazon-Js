import { orders } from '../data/orders.js';
import { formatCurrency } from './utils/money.js';
import { loadProductsFetch, products } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.11/esm/index.js';

async function loadPage() {
  await loadProductsFetch();
  renderOrdersHTML();
}

loadPage();

function renderOrdersHTML() {

  const ordersHTML = orders.orders.map(order => {
    const orderDate = new dayjs(order.orderTime).format('MMMM D');

    return `
    <div class="order-container">
      
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${productDetails(order.products)}
      </div>
    </div>
    `
  }).join('');

  function productDetails(orderItems) {
    return orderItems.map(item => {
      const { productId } = item;
      const matchingProduct = products.find(product => product.id === productId);
      const deliveryDate = dayjs(item.estimatedDeliveryTime).format('MMMM D');

      return `
      <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${deliveryDate}
          </div>
          <div class="product-quantity">
            Quantity: ${item.quantity}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${productId}&productId=${matchingProduct.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `
    }).join('');
  };

  document.querySelector('.js-order-grid').innerHTML = ordersHTML;
  document.querySelector('.cart-quantity').innerText = orders.calculateOrderQuantity();

}