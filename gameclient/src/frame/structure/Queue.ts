
/**队列 先入先出*/
export class Queue<T>{

    private _lst: Array<T> = [];

    public Push(item: T): void {
        this._lst.push(item);
    }

    public Pop(): T {
        return this._lst.shift();
    }

    public Peek(): T {
        if (this._lst.length == 0) return null;
        return this._lst[0];
    }

    public Array(): Array<T> {
        return this._lst.slice(0, this._lst.length);
    }

    public Contains(item: T): boolean {
        return (this._lst.indexOf(item, 0) != -1);
    }

    public Clear(): void {
        this._lst.length = 0;
    }

    public get Length(): number {
        return this._lst.length;
    }

    public ForeachBreak(compare: (a: T) => boolean): void {
        for (let item of this._lst) {
            if (!compare.call(null, item))
                break;
        }
    }

    public Foreach(compare: (a: T) => boolean): void {
        for (let item of this._lst) {
            compare.call(null, item);
        }
    }
}