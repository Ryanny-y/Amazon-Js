import { renderOrderSummary } from '../../../script/checkout/orderSummary.js';
import { cart } from '../../../data/cart.js';

describe('Test suite: renderOrderSummary', () => {

  const productId1 = "3ebe75dc-64d2-4137-8860-1f5a963e534b";
  const productId2 = "8c9c52b5-5a19-4bcb-a5d1-158a74287c53";

  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `

     <div class="checkout-header-middle-section">
        Checkout (<a class="return-to-home-link"
          href="amazon.html">0 items</a>)
      </div>

      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
    `;

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }, {
        productId: productId2,
        quantity: 2,
        deliveryOptionId: '2'
      }]
    );  
    });

    cart.loadFromStorage();

    renderOrderSummary();
  })

  it('displays the cart', () => {
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 1');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 2');
  }); 

  it('removes a product', () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-delete-link-${productId1}`)).toEqual(null);
    expect(document.querySelector(`.js-delete-link-${productId2}`)).not.toEqual(null);
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  })
}); 