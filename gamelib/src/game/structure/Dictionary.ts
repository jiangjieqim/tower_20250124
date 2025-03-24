/** 字典
 * 字典这个数据结构，其本质是一个个键值对<key,value>形成的数据集合，
 * 但为了能查找到正确的数据，key值必须保证唯一性。我们可以通过使用
 * Typescript中的两个数组来分别存储key值和value值来模拟实现这种结构。
 * 数据存储时把key和value分别存储在两个数组相同的索引位置，
 * 这样在查找数据时就可以通过这个索引把数据关联起来，找到对应的值。。
 * 
 */
export class Dictionary<K, V> {

    private _keys: K[] = [];       //所有键列表
    private _values: V[] = [];     //所有值列表
    private _len: number = 0;       //总长度

    public constructor() { }

    /**转为json*/
    public ToJsonObj(): any {
        const result: any = {};
        result.keys = this._keys;
        result.values = this._values;
        return result;
    }

    /**json转对象*/
    public FromJsonObj(obj: any): void {
        this._keys = obj.keys;
        this._values = obj.values;
    }

    /**添加*/
    public Add(key: K, value: V): boolean {
        let idx = this._keys.indexOf(key, 0);
        if (idx != -1) {
            this._keys[idx] = key;
            this._values[idx] = value;
            return true;
        }
        this._keys.push(key);
        this._values.push(value);
        this._len++;
        return true;
    }

    /**移除*/
    public Remove(key: K): void {
        let idx = this._keys.indexOf(key, 0);
        if (idx != -1) {
            this._keys.splice(idx, 1);
            this._values.splice(idx, 1);
            this._len--;
        }
    }

    /**获取key*/
    public Key(value: V): K {
        let idx = this._values.indexOf(value);
        if (idx != -1)
            return this._keys[idx];
        return null;
    }

    /**获取value*/
    public Value(key: K): V {
        let idx = this._keys.indexOf(key);
        if (idx != -1)
            return this._values[idx];
        return null;
    }

    /**通过条件获取value lst
     * @param value 判断条件
    */
    public TryGetValueListByCondition(value: (value: V) => boolean): Array<V> {
        let list = [];
        for (let v of this._values) {
            if (value(v))
                list[list.length] = v;
        }
        return list;
    }

    /**通过条件获取获取 */
    public TryGetAnyByCondition(value: (v: V) => boolean): Array<V> {
        let dic: any = {};
        for (let k of this._keys) {
            let idx = this._keys.indexOf(k, 0);
            if (value(this._values[idx]))
                dic[k] = this._values[idx];
        }
        return dic;
    }

    /**通过条件获取key lst*/
    public TryGetKeyListByCondition(func: (k: K) => boolean): Array<K> {
        let list = [];
        for (let k of this._keys) {
            if (func(k))
                list[list.length] = k;
        }
        return list;
    }

    /**是否含有key*/
    public HasKey(key: K): boolean {
        let ks = this._keys;
        for (let i = 0; i < ks.length; i++) {
            if (ks[i] == key) return true;
        }
        return false;
    }

    /**key 为number 类型 ，可以从小到大从新排序*/
    public SortByKey(): boolean {
        for (let i = this._keys.length - 1; i >= 0; i--) {
            for (let j = this._keys.length - 1; j >= 0; j--) {
                if (Number(this._keys[i]) > Number(this._keys[i + 1])) {
                    let tmpK: K = this._keys[i];
                    let tmpV: V = this._values[i];
                    this._keys[i] = this._keys[i + 1];
                    this._values[i] = this._values[i + 1];
                    this._keys[i + 1] = tmpK;
                    this._values[i + 1] = tmpV;
                }
            }
        }
        return true;
    }

    /**获取长度*/
    public GetLength(): number { return this._len; }

    /**通过索引获取value*/
    public GetValueByIndex(idx: number): V {
        if (idx < 0 || idx > +this._len)
            return;
        let v: V = this._values[idx];
        return v;
    }

    /**通过索引获取key*/
    public GetKeyByIndex(idx: number): K {
        if (idx < 0 || idx > +this._len)
            return;
        let k: K = this._keys[idx];
        return k;
    }

    /**获取所有value*/
    public Values(): V[] { return this._values; }

    /**获取所有key*/
    public Keys(): K[] { return this._keys; }

    /**清除*/
    public Clear(): void {
        while (this._keys.length > 0)
            this._keys.pop();
        while (this._values.length > 0) {
            let vt: V = this._values.pop();
            vt = null;
        }
        this._keys.length = 0;
        this._values.length = 0;
        this._len = 0;
    }

    /**遍历执行-不会中断*/
    public Foreach(func: (key: K, value: V) => boolean) {
        let idx = -1;
        for (let k of this._keys) {
            idx = this._keys.indexOf(k);
            if (idx != -1) {
                func(k, this._values[idx])
            }
        }
    }

}