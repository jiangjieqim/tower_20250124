
interface IList<T> {
    Length: number;//长度
    Add(t: T);//添加元素
    Insert(t: T, i: T);//插入元素
    Remove(t: T);//移除元素
    Header(): T;//返回头元素
    Tail(): T;//返回尾元素
    Find(i: T): T;//查找元素
    ReverseFind(I: T): T;//反向查找元素
    Empty(): boolean;//是否空列表
    Clear(): void;//清空列表

}

class Item<T>{

    private _name: string;
    private _value: T;//值
    private _prev: Item<T>;//上个元素
    private _next: Item<T>;//下个元素

    constructor(value: T) {
        this._name = value + '';
        this._value = value;
        this._prev = null;
        this._next = null;
    }

    public set Name(name: string) { this._name = name; }
    public get Name() { return this._name; }

    public set Value(value: T) { this._value = value; }
    public get Value() { return this._value; }

    public set Prev(item: Item<T>) { this._prev = item; }
    public get Prev() { return this._prev; }

    public set Next(item: Item<T>) { this._next = item; }
    public get Next() { return this._next; }

}

/**双链列表 */
export class DoubleList<T> implements IList<T> {

    private _counter: number = 0;//元素个数
    private _header: Item<T>;//头元素
    private _tail: Item<T>;//尾元素

    constructor() {

        this._header = new Item<T>(null);
        this._header.Name = 'header';
        this._tail = new Item<T>(null);
        this._tail.Name = 'tail';
        this._header.Prev = this._header.Next = this._tail;
        this._tail.Next = this._tail.Prev = this._header;

    }

    get Length(): number { return this._counter; }

    Add(t: T) {
        let item = new Item<T>(t);
        item.Prev = this._tail.Prev;
        item.Next = this._tail;
        this._tail.Prev = item;
        item.Prev.Next = item;
        this._counter++;
    }

    Insert(t: T, i: T) {
        if (this.Empty()) return;
        let idxItem = this._header.Next;
        while (idxItem !== this._tail) {
            if (idxItem.Value == t) {
                let valueItem = new Item<T>(i);
                valueItem.Prev = idxItem;
                valueItem.Next = idxItem.Next;
                idxItem.Next.Prev = valueItem;
                idxItem.Next = valueItem;
                this._counter++;
                break;
            }
            idxItem = idxItem.Next;
        }
    }

    Remove(t: T): T {
        if (this.Empty()) return;
        let idxItem = this._header.Next;
        while (idxItem !== this._tail) {
            if (idxItem.Value == t) {
                idxItem.Prev.Next = idxItem.Next;
                idxItem.Next.Prev = idxItem.Prev;
                idxItem.Next = null;
                idxItem.Prev = null;
                let value = idxItem.Value;
                idxItem.Value = null;
                idxItem = null;
                this._counter--;
                return value;
            }
            idxItem = idxItem.Next;
        }
    }

    Header(): T {
        return this._header.Next.Value;
    }

    Tail() {
        return this._tail.Prev.Value;
    }

    Find(t: T): T {
        if (this.Empty()) return;
        let idxItem = this._header.Next;
        while (idxItem !== this._tail) {
            if (idxItem.Value == t)
                return idxItem.Value;
            idxItem = idxItem.Next;
        }
        return null;
    }

    ReverseFind(t: T): T {
        if (this.Empty())
            return;
        let idxItem = this._tail.Prev;
        while (idxItem !== this._header) {
            if (idxItem.Value == t)
                return idxItem.Value;
            idxItem = idxItem.Prev;
        }
        return null;
    }

    Empty(): boolean {
        return this._counter === 0;
    }

    Clear() {
        let item = this._header.Next;
        while (item !== this._tail) {
            item.Prev = null;
            item.Value = null;
            item = item.Next;
            item.Prev.Next = null;
        }
        this._header.Next = this._tail;
        this._tail.Prev = this._header;
        this._counter = 0;
    }

    Print() {
        let item = this._header.Next;
        while (item !== this._tail) {
            console.log(item);
            item = item.Next;
        }
    }
}