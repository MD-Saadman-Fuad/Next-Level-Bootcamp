class Counter {
  static count: number = 0;

  static increment() {
    return Counter.count++;
  }

  static decrement() {
    return Counter.count--;
  }
}


Counter.increment();
Counter.increment();
Counter.decrement();

console.log(Counter.count);

Counter.increment();
Counter.increment();
Counter.increment();

console.log(Counter.count);
