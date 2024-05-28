class Cart {
  cartItems;

  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem('cart')) || []
  }

  addToCart(productId, quantity) {
    const matchingItem = this.cartItems.find(cartItem => cartItem.productId === productId);

    if(matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOption: '1'
      })
    }
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  calculateQuantity() {
    return this.cartItems.reduce((acc, cur) => acc + cur.quantity, 0);
  }
  
  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(cartItem => productId !== cartItem.productId);
    this.saveToStorage();
  }
  
  updateQuantity(productId, newQuantity) {
    const matchingItem = cart.cartItems.find(cartItem => cartItem.productId === productId);
    matchingItem.quantity = newQuantity;
    this.saveToStorage();
  }
}

export const cart = new Cart();