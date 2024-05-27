class Cart {
  cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  addToCart(productId, quantity) {
    const matchingItem = this.cartItems.find(cartItem => cartItem.productId === productId);

    if(matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity
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
}

export const cart = new Cart();