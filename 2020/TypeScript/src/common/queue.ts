export class Queue<T> {
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

  enqueue(item: T): void {
    this.collection.push(item);
  }

  peek(): T {
    return this.collection[0];
  }

  dequeue(): T {
    return this.collection.shift();
  }

  clone(): Queue<T> {
    return new Queue<T>(this.collection);
  }

  cloneToDepth(toDepth: number): Queue<T> {
    return new Queue<T>(this.collection.slice(0, toDepth));
  }

  equivalent(other: Queue<T>): boolean {
    return this.collection.length === other.collection.length
      && this.collection.every((value, index) => other.collection[index] === value);
  }
}