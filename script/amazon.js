import { products } from '../data/products.js';
import { formatCurrency } from './utils/currency.js';
import { cart } from '../data/cart.js';

function renderAmazonHTML() {

  const productsHTML = products.map(product => {
    return `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src=${product.getStarRating()}>
        <div class="product-rating-count link-primary">
          ${product.getRatingCount()}
        </div>
      </div>

      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="product-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart added-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary" data-product-id=${product.id}>
        Add to Cart
      </button>
    </div>
    `
  }).join("");

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  const cartQuanityEl = document.querySelector('.js-cart-quantity');
  cartQuanityEl.textContent = cart.calculateQuantity();

  // Add To Cart
  const addBtns = document.querySelectorAll('.add-to-cart-button');
  addBtns.forEach(btn => {
    let timeoutId;
    btn.addEventListener('click', () => {
      const { productId } = btn.dataset;
      const quantity = Number(document.querySelector(`.product-selector-${productId}`).value);

      cart.addToCart(productId, quantity);
      cartQuanityEl.textContent = cart.calculateQuantity();

      // DISPLAY ADD MESSAGE
      const addMessage = document.querySelector(`.added-${productId}`);
      addMessage.classList.add('added');

      if(timeoutId) {
        clearTimeout(timeoutId);
      }

      const intervalId = setTimeout(() => {
        addMessage.classList.remove('added');
      }, 2000);

      timeoutId = intervalId;
    });
  })  
}

renderAmazonHTML();