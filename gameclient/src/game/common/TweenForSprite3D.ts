export class TweenForSprite3D extends Laya.Script {

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }

    fromposition: Laya.Vector3;
    toposition: Laya.Vector3;
    moveDistance: Laya.Vector3;
    moveObject: Laya.Sprite3D;
    moveTime: number = 0;
    moveValue: number = 0;

    public onPositionMoveTo(gameObject: Laya.Sprite3D, toPos: Laya.Vector3, playTime: number, easeFun: Function, obj: any = null, callback: Function = null) {

        this.moveDistance = new Laya.Vector3(toPos.x - gameObject.transform.position.x, toPos.y - gameObject.transform.position.y, toPos.z - gameObject.transform.position.z);
        this.fromposition = gameObject.transform.position;
        this.toposition = toPos;
        this.moveObject = gameObject;
        this.moveTime = playTime;
        if (playTime == 0) {
            this.moveObject.transform.position = this.toposition;
            return;
        }
        this.startMove();
        Laya.Tween.to(this, { moveValue: 1.0 }, this.moveTime, easeFun, Laya.Handler.create(this, this.endMove, [Laya.Handler.create(obj, callback)]));
    }

    private startMove(): void {
        Laya.timer.frameLoop(1, this, this.moveUpdate);
    }

    private endMove(handler: Laya.Handler): void {

        Laya.timer.clear(this, this.moveUpdate);
        this.moveObject.transform.position = this.toposition;

        if (handler.method != null)
            handler.method();
    }

    private moveUpdate(): void {

        this.moveObject.transform.position = new Laya.Vector3(
            this.fromposition.x + (this.moveDistance.x * this.moveValue),
            this.fromposition.y + (this.moveDistance.y * this.moveValue),
            this.fromposition.z + (this.moveDistance.z * this.moveValue),
        );
    }

}