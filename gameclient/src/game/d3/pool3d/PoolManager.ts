import Sprite3D = Laya.Sprite3D;
import Sprite = Laya.Sprite;
import Text = Laya.Text;

import { PoolableU3D } from "./Poolable";

/**对象池管理器*/
export class PoolManager {
    static UnityExportLst: PoolableU3D[] = [];

    //#region 导出资源

    /**unity导出资源 池子初始化*/
    public static InitUnityExport() {
        // 初始化勇者骨骼
        // this.initPool(TextDefine.PoolName.HeroBody, ResPath.U3D.Role, 5, -1, true, null);

        //#region 初始化特效池子
        // this.initPool(EPoolType.effect_other_fuhuo, 3);
        // this.initPool(EPoolType.effect_other_upgrade, 3);
        // this.initPool(EPoolType.effect_other_zhufutishi, 3);
        // this.initPool(EPoolType.effect_skill_hit_buff, 3);
        // this.initPool(EPoolType.effect_skill_hit_damage, 3);
        // this.initPool(EPoolType.effect_skill_hit_debuff, 3);
        // this.initPool(EPoolType.effect_skill_hit_hill, 3);
        // this.initPool(EPoolType.effect_other_benpao, 5);

        // this.initSkillEffectTypes();
        //#endregion
        // this.initPool(TextDefine.PoolName.Scene1, ResPath.U3D.Scene_1, 3);
        // this.initPool(TextDefine.PoolName.Scene2, ResPath.U3D.Scene_2, 3);
        // this.initPool(TextDefine.PoolName.Scene3, ResPath.U3D.Scene_3, 3);
        // this.initPool(TextDefine.PoolName.Scene4, ResPath.U3D.Scene_4, 3);
        console.log("初始化池子");
    }

    /**异步获取unity导出资源 */
    public static GetSprite3DAsync(poolName: string, resName: string, complete: Callback) {
        PoolManager.getExportAsync(poolName, Callback.Create(this, (pool: PoolableU3D) => {
            if (pool == null) {
                // 初始化池子时会有延迟, 如在此时传入多个异步获取资源时会返回null, 若不希望返回null, 在池子初始化中先进行初始化
                this.initPool(poolName, resName, 1, -1, false, Callback.Create(this, (newPool: PoolableU3D) => {
                    if (newPool == null) {
                        console.warn("newPool = null: " + poolName);
                        return null;
                    }
                    newPool.GetFromPool(Callback.Create(this, (obj: Sprite3D) => {
                        if (!obj.active) obj.active = true;
                        if (complete != null) complete.Invoke(obj);
                    }), true);
                }));
                // let newPool = new PoolableU3D(poolName, resName);
                // newPool.InitAsync(1, -1, Callback.Create(this, () => {
                //     newPool.GetFromPool(Callback.Create(this, (obj: Sprite3D) => {
                //         if (complete != null) complete.Invoke(obj);
                //     }), true);
                // }));
            }
            else {
                pool.GetFromPool(Callback.Create(this, (obj: Sprite3D) => {
                    if (!obj.active) obj.active = true;
                    if (complete != null) complete.Invoke(obj);
                }), true);
            }
        }));
    }

    /**归还资源*/
    public static ReturnSprit3D(poolName: string, obj: any, complete?: Callback): void {
        PoolManager.getExportAsync(poolName, Callback.Create(this, (pool: PoolableU3D) => {
            if (pool != null) {
                pool.AddToPool(obj);
                if (complete != null) complete.Invoke();
            }
            else {
                console.warn("pool is null, destroy obj! poolName: " + poolName);
                obj.destroy();

                // let newPool = new PoolableU3D(poolName);
                // newPool.InitAsync(0, -1, Callback.Create(this, () => {
                //     console.log("newPool.AddToPool: " + obj.name);
                //     newPool.AddToPool(obj);
                //     if (complete != null) complete.Invoke();
                // }));
            }
        }));
    }

    //#endregion

    /**异步获取对象池
     * @param poolName 对象池名字
     * @param complete 完成回调-返回对象池,如果没有则return null
    */
    private static getExportAsync(poolName: string, complete: Callback) {
        let pool: PoolableU3D = PoolManager.UnityExportLst.find(pool => pool.PoolName == poolName);
        if (complete != null) complete.Invoke(pool);
    }

    /**初始化池子
     * @param poolName 池子名字
     * @param resName 资源名字
     * @param initNum 初始数量
     * @param maxNum 最大数量
     * @param bNew 归还是是否需要重新创建
     * @param complete 完成回调-返回对象池
    */
    private static initPool(poolName: string, resName: string, initNum: number, maxNum: number = -1, bNew: boolean = false, complete?: Callback): void {
        let pool: PoolableU3D = new PoolableU3D(poolName, resName);
        pool.InitAsync(initNum, maxNum, bNew, complete);
        ListUtil.Add(PoolManager.UnityExportLst, pool);
    }
}