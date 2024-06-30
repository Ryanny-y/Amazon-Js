class Order {
  orders = JSON.parse(localStorage.getItem('orders')) || [];

  addOrder(order) {
    this.orders.unshift(order);
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }
}

export const orders = new Order();