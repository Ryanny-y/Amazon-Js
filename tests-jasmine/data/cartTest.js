import { cart } from '../../data/cart.js';

describe('Test suite: Add To Cart', () => {

  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });
  
  it('Add a new product', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);  
    });

    cart.loadFromStorage();
    
    cart.addToCart('3ebe75dc-64d2-4137-8860-1f5a963e534b', 1);
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual('3ebe75dc-64d2-4137-8860-1f5a963e534b');
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
      quantity: 1,
      deliveryOptionId: '1'
    }]))
  });

  it('Add an existing product', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
        quantity: 1,
        deliveryOptionId: '1'
      }]);  
    });

    cart.loadFromStorage();

    cart.addToCart('3ebe75dc-64d2-4137-8860-1f5a963e534b', 1);
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual('3ebe75dc-64d2-4137-8860-1f5a963e534b');
    expect(cart.cartItems[0].quantity).toEqual(2);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
      quantity: 2,
      deliveryOptionId: '1'
    }]))
  });
});

describe('Test suite: Remove From Cart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
        quantity: 1,
        deliveryOptionId: '1'
      }])
    })

    cart.loadFromStorage();
  })

  it('Remove existing product', () => {
    cart.removeFromCart('3ebe75dc-64d2-4137-8860-1f5a963e534b');
    expect(cart.cartItems.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
  });

  it('Remove not existing product', () => {
    cart.removeFromCart('id does not exist');
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual('3ebe75dc-64d2-4137-8860-1f5a963e534b');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
      quantity: 1,
      deliveryOptionId: '1'
    }]));
  });
});