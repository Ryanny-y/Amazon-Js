import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { cart } from "../data/cart.js";

function renderAmazonHTML() {

  const productHTML = products.map(product => `
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
        src="${product.getStarsURL()}">
      <div class="product-rating-count link-primary">
        ${product.rating.count}
      </div>
    </div>

    <div class="product-price">
      ${product.getPrice()}
    </div>

    <div class="product-quantity-container">
      <select class="quantity-selector-${product.id}">
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

    ${product.getSizeChartLink()}

    <div class="product-spacer"></div>

    <div class="added-to-cart js-added-to-cart-${product.id}">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button js-add-to-cart-button button-primary" data-product-id="${product.id}">
      Add to Cart
    </button>
  </div>
  `).join('');

  document.querySelector('.js-products-grid').innerHTML = productHTML;
  const cartQuantityEl = document.querySelector('.js-cart-quantity');

  const addBtns = document.querySelectorAll('.js-add-to-cart-button');
  addBtns.forEach(btn => {
    let timeoutId = undefined;

    btn.addEventListener('click', () => {
      const { productId } = btn.dataset;
      const quantitySelectorEl = document.querySelector(`.quantity-selector-${productId}`);
      const quantity = Number(quantitySelectorEl.value);
      const added = document.querySelector(`.js-added-to-cart-${productId}`);
      added.classList.add('added');

      if(timeoutId) {
        clearTimeout(timeoutId);
      }

      const tID = setTimeout(() => {
        added.classList.remove('added');
      }, 2000);

      timeoutId = tID;

      cart.addToCart(productId, quantity);
      displayCartQuantity(cartQuantityEl, cart.calculateQuantity());
    });
  })

  displayCartQuantity(cartQuantityEl, cart.calculateQuantity());
};

function displayCartQuantity(el, quan) {
  el.innerText = quan;
}

renderAmazonHTML();