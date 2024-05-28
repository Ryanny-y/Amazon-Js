import renderOrderSummary from '../../script/checkout/orderSummary.js';
import { cart } from '../../data/cart.js';

describe('Test Suite: Render Order Summary', () => {
  const productId1 = '54e0eccd-8f36-462b-b68a-8182611d9add';
  const productId2 = '83d4ca15-0f35-48f5-b7a3-1ea210004f2e';

  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="header-content">
        <div class="checkout-header-middle-section">
          Checkout (<a class="return-to-home-link"
            href="amazon.html">0 items</a>)
        </div>
      </div>

      <div class="js-order-summary">
      </div>
      
      <div class="js-payment-summary"></div>
      `;

      spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 1,
        deliveryOption: '1'
      }, {
        productId: productId2,
        quantity: 2,
        deliveryOption: '2'
      }]);
    });

    cart.loadFromStorage();
      renderOrderSummary();
  });

  it('Displays the cart', () => {
    expect(document.querySelectorAll('.cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain("Quantity: 1");
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain("Quantity: 2");
  })


  it('removes a product', () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(document.querySelectorAll('.cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-cart-container-${productId1}`)).toEqual(null);
    expect(document.querySelector(`.js-cart-container-${productId2}`)).not.toEqual(null);
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = ``;
    
  })
});