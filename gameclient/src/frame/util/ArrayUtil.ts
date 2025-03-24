/**列表工具类*/
export class ArrayUtil {

    /**替换数组中的数据
         * @param array 数组
         * @param idx 索引
         * @param item 替换对象
        */
    public static ReplaceItemToArray(array: any[], idx: number, item: any) {
        array.splice(idx, 1, item);
    }

    /**数组中移除对象
     * @param array 数组
     * @param tar 移除对象
    */
    public static RemoveFromArray(array: any[], tar: any): any {
        let idx = array.indexOf(tar);
        if (idx >= 0) array.splice(idx, 1);
        return array;
    }

    /**插入元素*/
    public static Insert(arr: any[], value: any, index: number): void {
        if (index > arr.length - 1)
            arr.push(value);
        else
            arr.splice(index, 0, value);
    }

    /**移除元素*/
    public static Remove(arr: any[], v: any): void {
        let i: number = arr.indexOf(v);
        if (i != -1)
            arr.splice(i, 1);
    }

    /**移除所有值为v的元素*/
    public static RemoveAll(arr: any[], v: any) {
        let i: number = arr.indexOf(v);
        while (i >= 0) {
            arr.splice(i, 1);
            i = arr.indexOf(v);
        }
    }

    /**包含元素*/
    public static Contains(arr: any[], v: any): boolean {
        return arr.length > 0 ? arr.indexOf(v) != -1 : false;
    }

    /**复制*/
    public static Copy(arr: any[]): any[] {
        return arr.slice();
    }

    /**排序
     * @param arr 需要排序的数组
     * @param key 排序字段
     * @param orderDes 排序方式 true=降序 false=升序
    */
    public static Sort(arr: any[], key: string, orderDes: boolean) {
        if (arr == null) return;
        arr.sort((item1, item2) => {
            if (orderDes) {//降序
                if (item1[key] > item2[key])
                    return -1;
                if (item1[key] < item2[key])
                    return 1;
                return 0;
            }
            else {
                if (item1[key] < item2[key])
                    return -1;
                if (item1[key] > item2[key])
                    return 1;
                return 0;
            }
        });
    }

    /**清除*/
    public static Clear(arr: any[]): void {
        let i: number = 0;
        let len: number = arr.length;
        for (; i < len; i++) {
            arr[i] = null;
        }
        arr.splice(0);
    }

    /**是否为空*/
    public static IsEmpty(arr: any[]): boolean {
        if (arr == null || arr.length == 0)
            return true;
        return false;
    }

}