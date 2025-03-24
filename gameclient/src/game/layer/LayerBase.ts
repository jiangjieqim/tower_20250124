
/**层级*/
export class LayerBase extends Laya.Sprite implements ILayer {

    constructor(layerid: number = 0, name: string) {
        super();
        this.init(layerid, name);
    }

    //#region 静态相关


    //#endregion

    //#region 实例相关
    //层级id
    private _layerid: number = 0;
    public get LayerID(): number { return this._layerid; }


    /**初始化
     * @param layerid 层级id
     * @param name 名字
    */
    private init(layerid: number = 0, name: string) {
        this._layerid = layerid;
        this.mouseEnabled = true;
        this.mouseThrough = true;
        this.name = name;

        this.zOrder = layerid;
    }

    //#endregion




}