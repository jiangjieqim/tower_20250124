
/**碰撞出发检测基类*/
export class BaseChecker extends Laya.Script3D {

    constructor() { super(); }

    protected _self: Laya.Sprite3D;
    protected _rig3d: Laya.Rigidbody3D;
    protected _col: Laya.PhysicsCollider;

    onAwake(): void {
        this._self = this.owner as Laya.Sprite3D;

    }

    onDestroy(): void {
    }

    protected MonoUpdate() { }
    protected MonoLateUpdate() { }
    protected MonoFixedUpdate() { }

    //#region 触发事件

    /** 开始触发时执行*/
    onTriggerEnter(other: Laya.PhysicsComponent): void {
    }
    /** 持续触发时执行*/
    onTriggerStay(other: Laya.PhysicsComponent): void {
    }
    /** 结束触发时执行*/
    onTriggerExit(other: Laya.PhysicsComponent): void {
    }
    //#endregion

    //#region 碰撞事件

    /** 开始碰撞时执行*/
    onCollisionEnter(col: Laya.Collision): void {
    }

    /** 持续碰撞时执行*/
    onCollisionStay(col: Laya.Collision): void {
    }

    /** 结束碰撞时执行*/
    onCollisionExit(col: Laya.Collision): void {
    }

    //#endregion

    DoDestroy() {
        this.destroy();
    }

}