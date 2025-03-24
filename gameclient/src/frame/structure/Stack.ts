/**栈 后入先出*/
export class Stack<T>{

    private _lst: Array<T> = [];

    /**添加 */
    public Push(item: T): void { this._lst.push(item); }
    /**移除最后一个 */
    public Pop(): T { return this._lst.pop(); }

    public Peek(): T {
        if (this._lst.length == 0) return null;
        return this._lst[this._lst.length - 1];
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