import { cart } from '../../data/cart.js';

describe('Test Suite: Add To Cart', () => {
  it('Adds an existing product to the cart', () => {

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: '54e0eccd-8f36-462b-b68a-8182611d9add',
        quantity: 1,
        deliveryOption: '1'
      }]);
    });
    
    cart.loadFromStorage();
    cart.addToCart('54e0eccd-8f36-462b-b68a-8182611d9add', 1);

    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual('54e0eccd-8f36-462b-b68a-8182611d9add');
    expect(cart.cartItems[0].quantity).toEqual(2);

  });

  it('Add a new product to the cart', () => {
    // Mock the local Storage
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });

    cart.loadFromStorage();
    cart.addToCart('54e0eccd-8f36-462b-b68a-8182611d9add', 1);

    expect(cart.cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual('54e0eccd-8f36-462b-b68a-8182611d9add');
    expect(cart.cartItems[0].quantity).toEqual(1);
  })

});