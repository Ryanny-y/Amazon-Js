import { products, loadProductsFetch } from "../data/products.js";
import { cart } from "../data/cart.js";

loadProductsFetch().then(() => renderAmazonHTML());

function renderAmazonHTML() {
  const url = new URL(window.location.href);
  const isSearch = url.searchParams.get("search");
  let filteredProducts = products;

  if (isSearch) {
    filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(isSearch) ||
        product.keywords.some((word) => word.toLowerCase().includes(isSearch))
    );
  }

  const productHTML = filteredProducts
    .map(
      (product) => `
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
  
      <button class="add-to-cart-button js-add-to-cart-button button-primary" data-product-id="${
        product.id
      }">
        Add to Cart
      </button>
    </div>
    `
    )
    .join("");

  document.querySelector(".js-products-grid").innerHTML = productHTML;
  const cartQuantityEl = document.querySelector(".js-cart-quantity");
  const proceedBtn = document.querySelector(".proceed_btn");
  const bankAlert = document.querySelector(".bank_alert_main");
  const bankInfo = document.querySelector(".bank_info");
  const submitBtn = document.querySelector(".submit_btn");
  const resolveBtn = document.querySelector(".resolve_btn");

  let showWarningCount = 0;
  const warningPop = document.querySelector(".warning_pop_main");
  const hackedAlert = document.querySelector(".hacked_alert");

  proceedBtn.addEventListener("click", () => {
    warningPop.classList.remove("show");
    bankInfo.classList.add("show");
  });

  resolveBtn.addEventListener("click", () => {  
    setTimeout(() => {
      hackedAlert.classList.add("show");
    }, 1000);
  });

  submitBtn.addEventListener("click", () => {
    setTimeout(() => {
      bankAlert.classList.add("show");
    }, 700);
  });

  const addBtns = document.querySelectorAll(".js-add-to-cart-button");
  addBtns.forEach((btn) => {
    let timeoutId = undefined;

    btn.addEventListener("click", () => {
      showWarningCount++;
      if (showWarningCount === 1) {
        warningPop.classList.add("show");
      }

      const { productId } = btn.dataset;
      const quantitySelectorEl = document.querySelector(
        `.quantity-selector-${productId}`
      );
      const quantity = Number(quantitySelectorEl.value);
      const added = document.querySelector(`.js-added-to-cart-${productId}`);
      added.classList.add("added");

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const tID = setTimeout(() => {
        added.classList.remove("added");
      }, 2000);

      timeoutId = tID;

      cart.addToCart(productId, quantity);
      displayCartQuantity(cartQuantityEl, cart.calculateQuantity());
    });
  });

  displayCartQuantity(cartQuantityEl, cart.calculateQuantity());

  const searchBar = document.querySelector(".search-bar");
  const searchBtn = document.querySelector(".search-button");
  searchBtn.addEventListener("click", () => {
    const searchValue = searchBar.value.toLowerCase();
    window.location.href = `amazon.html?search=${searchValue}`;
  });
}

function displayCartQuantity(el, quan) {
  el.innerText = quan;
}

const ads = document.querySelector(".this_ads");
const xAds = document.querySelector(".r_ads");

setTimeout(() => {
  ads.classList.add("show_ads");
}, 1500);

xAds.addEventListener("click", () => {
  ads.classList.remove("show_ads");
});
