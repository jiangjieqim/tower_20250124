import { E } from "../../G";
import Sprite3D = Laya.Sprite3D;

/**单个对象池子
 * -prefab是该池子要管理的对象
 */
export class PoolableU3D {
    public get PoolName() { return this._poolName; }

    private _poolName: string = StringUtil.Empty;       //池子名字
    private _resPath: string = StringUtil.Empty;          //资源名字
    private _initNum: number = 0;                       //初始数量
    private _maxUnUseNum: number = 0;                   //最大缓存数量-未使用的数量超出时，不再放入缓存池，直接销毁
    private poolLst_using: Sprite3D[] = [];             //在使用的列表
    private poolLst_unused: Sprite3D[] = [];            //未使用的列表

    private _prefab: Laya.Sprite3D;                      //预设
    private _bNew: boolean = false;                     //归还是是否需要重新创建, 用以在池子外产生修改的资源

    /**
     * @param poolName 池子名字
     * @param resName 资源名字-如果为空，则无法自动加载
    */
    constructor(poolName: string, resName: string = StringUtil.Empty) {
        this._poolName = poolName;
        this._resPath = resName;
    }

    /**异步初始化
     * @param initNum 数量
     * @param maxUnUse 最大缓存数量，-1=不限制
     * @param bNew 归还是是否需要重新创建
     * @param complete 初始化完成回调-返回当前池子
    */
    public InitAsync(initNum: number, maxUnUse: number = -1, bNew: boolean = false, complete?: Callback): void {
        this._initNum = initNum;
        this._maxUnUseNum = maxUnUse;
        this._bNew = bNew;
        if (this._initNum > this._maxUnUseNum && this._maxUnUseNum != -1) {
            this._initNum = this._maxUnUseNum;
        }
        if (this._initNum > 0)
            this.initPool(complete);
    }

    /**从对象池获取
     * @param bCreate 池子里没有时 是否新建  true=是/false=否 
    */
    public GetFromPool(complete: Callback, bCreate: boolean = true): void {

        let item: Sprite3D = null;
        if (this.poolLst_unused.length > 0) {
            item = ListUtil.RemoveAt(this.poolLst_unused, 0);
        }
        else {
            if (bCreate) {
                item = this.create();
                if (item == null) {// 创建失败
                    return;
                }
            }
        }

        if (item != null && item.transform == null) { // 预防transform为空的情况
            item.destroy();
            this.GetFromPool(complete, bCreate);
            return;
        }

        if (item != null) {
            this.addToPoolLst_Using(item);
        }

        if (complete != null) complete.Invoke(item);
    }

    /**添加到对象池*/
    public AddToPool(obj: Sprite3D): void {
        if (ListUtil.Contains(this.poolLst_using, obj)) {
            ListUtil.Remove(this.poolLst_using, obj);
        }
        this.addToPoolLst_UnUsed(obj);

        // console.log("...type::" + this.PoolType.toString() + "...using num::" + this.poolLst_using.length + "...unused num::" + this.poolLst_unused.length);
    }

    /**清除对象池*/
    public ClearAll(): void {
        this.ClearUsing();
        this.ClearUnUsed();
    }

    /**清除在使用的列表*/
    public ClearUsing(): void {
        this.poolLst_using.forEach(i => i.destroy());
        this.poolLst_using = [];
    }

    /**清除未使用的列表*/
    public ClearUnUsed(): void {
        this.poolLst_unused.forEach(i => i.destroy());
        this.poolLst_unused = [];
    }


    private loadRes(complete: Callback): void {
        if (StringUtil.IsNullOrEmpty(this._resPath)) {
            LogSys.Warn("[PoolableU3D][loadRes] _resName is null");
            if (complete != null) complete.Invoke(null);
        }
        E.ResMgr.LoadU3D_LH(this._resPath, Callback.Create(this, (obj: Sprite3D) => {
            this._prefab = obj;
            if (complete != null) complete.Invoke();
        }));
    }

    /**初始化对象池
     * @param complete 完成回调-返回当前池子
    */
    private initPool(complete?: Callback): void {
        this.ClearAll();
        if (this._initNum > 0) {
            this.loadRes(Callback.Create(this, () => {
                for (let i: number = 0; i < this._initNum; i++) {
                    ListUtil.Add(this.poolLst_unused, this.create());
                }
                if (complete != null) complete.Invoke(this);
            }));
        }
        else {
            if (complete != null) complete.Invoke(this);
        }
    }

    /**添加到未使用资源列表*/
    private addToPoolLst_UnUsed(obj: Sprite3D): void {
        obj.removeSelf();
        obj.active = false;

        if (this._maxUnUseNum != -1 && this.poolLst_unused.length >= this._maxUnUseNum) {
            obj.destroy();
            return;
        }
        if (this._bNew) {
            // 销毁后，保存新创建的资源
            obj.destroy();
            obj = this.create();
        }
        ListUtil.Add(this.poolLst_unused, obj);
    }

    /**添加到正在使用的资源列表*/
    private addToPoolLst_Using(obj: any): void {
        obj.active = true;
        ListUtil.Add(this.poolLst_using, obj);
    }


    private create(): any {
        if (this._prefab != null)
            return this._prefab.clone();

        return null;
    }
}