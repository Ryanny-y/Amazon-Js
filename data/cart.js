class Cart {
  cartItems;

  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  }

  saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantity) {
    const matchingItem = this.cartItems.find(cartItem => cartItem.productId === productId);

    if(matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }
    this.saveToStorage();
  }

  calculateQuantity() {
    return this.cartItems.reduce((acc, curr) => {
      return curr.quantity + acc
    }, 0);
  }

  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(cartItem => productId !== cartItem.productId);
    this.saveToStorage();
  }

  updateQuantity(productId, newQuantity) {
    if(newQuantity <= 0 ) {
      alert('New Quantity should be greater than 0');
      return;
    }
    const matchingItem = cart.cartItems.find(cartItem => cartItem.productId === productId);
    matchingItem.quantity = newQuantity;
    this.saveToStorage();
  }
  
};

export function loadCart(func) {
  const xhr = new XMLHttpRequest;
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    func();
  });
  xhr.send();
}

export const cart = new Cart();