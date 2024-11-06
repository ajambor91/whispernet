export class MessageQueue<T> {
   private _messages: T[] = [];

   public enqueue(item: T): void {
       this._messages.push(item)
   }

   public dequeue(): T | undefined {
       return this._messages.shift();
   }

   public peek(): T | undefined {
       return this._messages[0]
   }

   public isEmpty(): boolean {
       return this._messages.length === 0;
   }

   public size(): number {
       return this._messages.length;
   }
}