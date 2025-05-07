export interface Poolable {
  reset(): void;
}

export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private factory: () => T;
  private maxSize: number;
  private currentSize: number = 0;

  constructor(factory: () => T, initialSize: number = 10, maxSize: number = 100) {
    this.factory = factory;
    this.maxSize = maxSize;
    this.initialize(initialSize);
  }

  private initialize(size: number): void {
    for (let i = 0; i < size; i++) {
      this.pool.push(this.createNew());
    }
  }

  private createNew(): T {
    if (this.currentSize >= this.maxSize) {
      throw new Error('Object pool has reached maximum size');
    }
    this.currentSize++;
    return this.factory();
  }

  public acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createNew();
  }

  public release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      obj.reset();
      this.pool.push(obj);
    }
  }

  public getSize(): number {
    return this.pool.length;
  }

  public getCurrentSize(): number {
    return this.currentSize;
  }

  public clear(): void {
    this.pool = [];
    this.currentSize = 0;
  }
}
