import { EntityHelper } from "./EntityHelper";

/**单位对象*/
export abstract class Entity {
    protected _entityType: EntityType;
    public get EntityType() { return this._entityType; }

    protected _id: number = 0;
    public get ID() { return this._id; }

    constructor() {
        this._id = EntityHelper.GetUUID();
    }

    public Init(): void { }
    public Clear(): void { }
    public Update(): void {
        this.onUpdate();
    }
    public LateUpdate(): void {
        this.onLateUpdate();
    }
    public FixedUpdate(): void {
        this.onFixedUpdate();
    }

    protected abstract onUpdate(): void;
    protected abstract onLateUpdate(): void;
    protected abstract onFixedUpdate(): void;

}

/**单位类型 */
export enum EntityType {
    D2, //2D单位
    D3, //3D单位
}