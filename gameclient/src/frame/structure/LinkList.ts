
/**双向循环列表
 * 实际测试100000增加和删除，发现:
 * 1.如果是在开始位置插入和删除，比Array快；基数越大，差距越大
 * 2.中间位置插入和删除，比Array慢；基数越大，差距越大
 * 3.末端操作，效率差距不大
 * 4.耗时比较多的是GetNode函数
*/
export class LinkList<T> {

    /**表头*/
    private _linkHead: any = null;
    /**节点个数*/
    private _size: number = 0;

    constructor() {
        this._linkHead = { Data: null, Prev: null, Next: null };//双向链表 表头为空
        this._linkHead.Prev = this._linkHead;
        this._linkHead.Next = this._linkHead;
        this._size = 0;

    }

    /**在链表末尾添加 */
    public Add(t: T): void {
        this.Append(this._size, t);
    }

    /**将节点插入到第index位置之前*/
    public Insert(index: number, t: T): void {
        if (this._size < 1 || index >= this._size)
            console.error("没有可插入的点或索引溢出");
        if (index == 0)
            this.Append(this._size, t);
        else {
            let inode: any = this.GetNode(index);
            let tnode: any = { Data: t, Prev: inode.Prev, Next: inode };
            inode.Prev.Next = tnode;
            inode.Prev = tnode;
            this._size++;
        }
    }

    /**追加到index位置之后*/
    public Append(index: number, t: T): void {
        let inode: any;
        if (index == 0)
            inode = this._linkHead;
        else {
            index = index - 1;
            if (index < 0)
                console.error("位置不存在");
            inode = this.GetNode(index);
        }
        let tnode: any = { Data: t, Prev: inode, Next: inode.Next };
        inode.Next.Prev = tnode;
        inode.Next = tnode;
        this._size++;
    }

    /**删除节点
     * 有效索引[0,size-1];
    */
    public Del(index: number): void {
        let inode: any = this.GetNode(index);
        inode.Prev.Next = inode.Next;
        inode.Next.Prev = inode.Prev;
        this._size--;
    }

    public DelFirst(): void { this.Del(0); }

    public DelLast(): void { this.Del(this._size - 1); }

    public Get(index: number): T {
        return this.GetNode(index).Data;
    }

    public GetFirst(): T {
        return this.GetNode(0).Data;
    }

    public GetLast(): T {
        return this.GetNode(this._size - 1).Data;
    }

    /**通过索引查找*/
    public GetNode(index: number): any {
        if (index < 0 || index >= this._size)
            console.error("索引移除或者链表为空");
        if (index < this._size / 2) {
            let node: any = this._linkHead.Next;
            for (let i = 0; i < index; i++)
                node = node.Next;
            return node;
        }
        //反向查找
        let rnode: any = this._linkHead.Prev;
        let rindex = this._size - index - 1;
        for (let i: number = 0; i < rindex; i++)
            rnode = rnode.Prev;
        return rnode;
    }

    /**遍历列表执行回调
     * 注意返回值为false时 中断遍历
    */
    public ForeachBreak(compare: (value: T) => boolean) {
        let node: any = this._linkHead.Next;
        if (!node) return;
        do {
            if (compare.call(null, node.Data))
                break;
            node = node.Next;
        } while (node != this._linkHead);
    }

    public Foreach(compare: (value: T) => boolean) {
        let node: any = this._linkHead.Next;
        if (!node) return;

        do {
            compare.call(null, node.Data);
            node = node.Next;
        } while (node != this._linkHead);
    }

    public IsEmpty() {
        return this._size == 0;
    }

    public get Length(): number {
        return this._size;
    }

}