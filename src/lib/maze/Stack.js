import { Node } from './Node';

export class Stack {
  constructor() {
    this.size = 0;
    this.head = null;
  }

  isEmpty() {
    return this.size === 0;
  }

  clear() {
    this.size = 0;
    this.head = null;
  }

  push(element) {
    const newHead = new Node(element, this.head);
    this.head = newHead;
    this.size++;
  }

  top() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }
    return this.head.element;
  }

  pop() {
    const element = this.top();
    this.head = this.head.next;
    this.size--;
    return element;
  }

  copy(pathSize, reversed = false) {
    const temp = new Stack();
    const copy = new Stack();

    for (let i = 0; i < pathSize; i++) {
      temp.push(this.pop());
    }

    for (let i = 0; i < pathSize; i++) {
      const point = temp.pop();
      this.push(point);
      copy.push(point);
    }

    if (reversed) {
      const reversedStack = new Stack();
      for (let i = 0; i < pathSize; i++) {
        reversedStack.push(copy.pop());
      }
      return reversedStack;
    }

    return copy;
  }
}