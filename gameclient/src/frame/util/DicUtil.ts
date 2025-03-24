/**字典工具类*/
export class DicUtil {

    /**获取所有键*/
    public static Keys(dic: Object): any[] {
        let arry: any[] = [];
        for (let key in dic)
            arry.push(key);
        return arry;
    }

    /**获取所有值*/
    public static Values(dic: Object): any[] {
        let arry: any[] = [];
        for (let key in dic)
            arry.push(dic[key]);
        return arry;
    }

    /**清除*/
    public static Clear(dic: Object) {
        let v: any;
        for (let key in dic) {
            v = dic[key];
            if (v instanceof Object)
                this.Clear(dic);
            delete dic[key];
        }
    }

    /**遍历执行*/
    public static Foreach(dic: Object, compare: (key: any, value: any) => boolean) {
        for (let key in dic)
            if (!compare.call(null, key, dic[key]))
                break;
    }

    /**是否为空*/
    public static IsEmpty(dic: Object) {
        if (!dic) return;
        for (let key in dic)
            return false;
        return true;
    }

    /**长度*/
    public static Size(dic: Object): number {
        if (!dic) return 0;
        let count: number = 0;
        for (let key in dic)
            ++count;
        return count;
    }


}