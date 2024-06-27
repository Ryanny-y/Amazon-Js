class Cart {
  cartItems = JSON.parse(localStorage.getItem('cart')) || [];

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
};

export const cart = new Cart();