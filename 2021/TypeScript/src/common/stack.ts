export class Stack<T> {
    private collection: T[];
  
    constructor(collection: T[] = []) {
      this.collection = collection.slice();
    }
  
    isEmpty(): boolean {
      return this.size() === 0;
    }
  
    size(): number {
      return this.collection.length;
    }
  
    push(item: T): void {
      this.collection.push(item);
    }
  
    peek(): T {
      return this.collection[this.collection.length - 1];
    }
  
    pop(): T | undefined {
      return this.collection.pop();
    }
  
    clone(): Stack<T> {
      return new Stack<T>(this.collection);
    }
  
    equivalent(other: Stack<T>): boolean {
      return this.collection.length === other.collection.length
        && this.collection.every((value, index) => other.collection[index] === value);
    }
  }
