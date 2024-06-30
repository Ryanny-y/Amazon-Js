import { orders } from '../data/orders.js';
import { loadProductsFetch, products } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.11/esm/index.js';

async function renderTracking() {
  
  await loadProductsFetch();

  const currentTime = dayjs();
  const url = new URL(window.location.href);
  const productId = url.searchParams.get('productId');
  const orderId = url.searchParams.get('orderId');
  const matchingOrder = orders.orders.find(order => order.id === orderId);
  const matchingProduct = products.find(product => product.id === productId);

  const orderDetails = matchingOrder.products.find(product => productId === product.productId);
  const arrivingDate = dayjs(orderDetails.estimatedDeliveryTime);

  const orderProgress = ((currentTime - dayjs(matchingOrder.orderTime)) / (arrivingDate - dayjs(matchingOrder.orderTime))) * 10000;
  console.log(orderProgress);

  const trackProductHTML = `
  <a class="back-to-orders-link link-primary" href="orders.html">
    View all orders
  </a>

  <div class="delivery-date">
    Arriving on ${arrivingDate.format('dddd, MMMM D')}
  </div>

  <div class="product-info">
    ${matchingProduct.name}
  </div>

  <div class="product-info">
    Quantity: ${orderDetails.quantity}
  </div>

  <img class="product-image" src="${matchingProduct.image}">

  <div class="progress-labels-container">
    <div class="progress-label ${orderProgress < 50 ? 'current-status' : ''}">
      Preparing
    </div>
    <div class="progress-label ${100 > orderProgress >= 50 ? 'current-status' : ''}">
      Shipped
    </div>
    <div class="progress-label ${orderProgress >= 100 ? 'current-status' : ''}">
      Delivered
    </div>
  </div>

  <div class="progress-bar-container">
    <div class="progress-bar" style="width: ${orderProgress}%;"></div>
  </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackProductHTML;
}

renderTracking();