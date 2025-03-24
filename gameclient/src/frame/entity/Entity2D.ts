import Sprite = Laya.Sprite;

import { Entity } from "./Entity";

export abstract class Entity2D extends Entity {

    private _obj: Laya.Sprite;
    public get Obj() { return this._obj; }

    constructor(obj: Sprite) {
        super();
        this._obj = obj;
    }
}