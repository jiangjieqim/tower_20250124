
/**对象池
 * @description 对于一些需要重复进行生成与销毁的对象，可以考虑放到对象池中，进行缓存，复用
*/
export class PoolUtil {

    /**获取*/
    public static Get(classDef: any): any {
        let sign: string = "ml." + classDef.name;
        let obj: any = Laya.Pool.getItem(sign);
        if (!obj) {
            if (!Laya.ClassUtils.getRegClass(sign)) {
                // console.log("[PoolUtil] 注册对象池：" + sign);
                Laya.ClassUtils.regClass(sign, classDef);
            }
            obj = Laya.ClassUtils.getInstance(sign);
        }
        // if(obj&&obj["Init"])obj.Init();
        return obj;
    };

    /**回收*/
    public static Recover(obj: any): void {
        if (!obj) return;
        let proto: any = Object.getPrototypeOf(obj);
        let clas: any = proto["constructor"];
        let sign: string = "ml." + clas.name;
        obj.close();
        Laya.Pool.recover(sign, obj);
    }
}
/**对象池接口
 * -需要回收的类引用该接口
 */
export interface IPoolable {
    Init();
    Close();
}