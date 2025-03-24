import Sprite3D = Laya.Sprite3D;

import { Entity } from "./Entity";

/**3d单位对象 */
export abstract class Entity3D extends Entity {
    private _obj: Sprite3D;
    public get Obj() { return this._obj; }

    constructor(obj: Sprite3D) {
        super();
        this.SetObj(obj);
    }

    public Clear(): void {
        this.Obj.destroy();
        super.Clear();
    }

    public SetObj(obj: Sprite3D): void {
        this._obj = obj;
        this.onSetObj();
    }

    protected abstract onSetObj(): void;

}