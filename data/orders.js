class Order {
  orders = JSON.parse(localStorage.getItem('orders')) || [];

  addOrder(order) {
    this.orders.unshift(order);
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  calculateOrderQuantity() {
    return this.orders.reduce((acc, cur) => {
      return acc + cur.products.reduce((acc, cur) => {
        return cur.quantity + acc;
      }, 0);
    }, 0);
  }
}

export const orders = new Order();