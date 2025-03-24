import Vector3 = Laya.Vector3;
// import {TimeUtil} from "../../frame/util/TimeUtil";
import { Updater } from "./timer/Updater";

export namespace Common {

    export class AppRoot extends Laya.Script {
        //根节点-引擎支持的代码生命周期函数的脚本可以挂在这里
        public root: Laya.Sprite;

        constructor() {
            super();
            if (this.root == null) this.root = new Laya.Sprite();
            Laya.stage.addChild(this.root);
            this.root.name = "AppRoot";
            this.root.addComponentIntance(this);
        }

        public onInit() {
            //初始化需要做的
            TimeUtil.Init();
            Updater.Ins.Init();

        }

        /**每帧执行*/
        public onUpdate() {
            Updater.Ins.Update();
        }
        
        public onLateUpdate(): void {
            Updater.Ins.LateUpdate();
        }

    }
/*
    export class Func {
        //#region Ve3Towards
        private static tmpVector3: Vector3 = new Vector3(); //坐标偏移量
        private static dir: Vector3 = new Vector3();        //单位向量
        
        //移动到目标位置
        public static Vector3MoveTowards(from: Vector3, to: Vector3, moveSpeed: number): Vector3 {
            Func.tmpVector3 = new Vector3(to.x - from.x, 0, to.z - from.z);
            Vector3.normalize(Func.tmpVector3, Func.dir);
            let xMove: number = NumberUtil.toFixed(moveSpeed * TimeUtil.DeltaTimeS * this.dir.x, 3);
            let zMove: number = NumberUtil.toFixed(moveSpeed * TimeUtil.DeltaTimeS * this.dir.z, 3);
            // let pos = new Vector3(from.x + xMove, from.y, from.z + zMove);
            let xTmp: number = NumberUtil.toFixed(to.x - from.x, 3);
            let zTmp: number = NumberUtil.toFixed(to.z - from.z, 3);
            //todo:如果这一帧的偏移量超过了最终的位置
            if (MathUtil.Abs(xMove) > MathUtil.Abs(xTmp)) xMove = xTmp;
            if (MathUtil.Abs(zMove) > MathUtil.Abs(zTmp)) zMove = zTmp;

            let pos = new Vector3(from.x + xMove, from.y, from.z + zMove);
            return pos;
        }

        //#endregion

        //A、B为顺时针定点，C为起始点，D为check点 
        public static CheckCross(A: Vector3, B: Vector3, C: Vector3, D: Vector3): boolean {

            let AB: Vector3 = new Vector3();
            let AC: Vector3 = new Vector3();
            let AD: Vector3 = new Vector3();
            let CD: Vector3 = new Vector3();
            let CA: Vector3 = new Vector3();
            let CB: Vector3 = new Vector3();

            Vector3.subtract(B, A, AB);
            Vector3.subtract(C, A, AC);
            Vector3.subtract(D, A, AD);
            Vector3.subtract(D, C, CD);
            Vector3.subtract(A, C, CA);
            Vector3.subtract(B, C, CB);

            let tmp_01: Vector3 = new Vector3();
            let tmp_02: Vector3 = new Vector3();
            let check_01: boolean;
            let check_02: boolean;

            Vector3.cross(AB, AD, tmp_01);
            Vector3.cross(AB, AC, tmp_02);
            check_01 = Vector3.dot(tmp_01, tmp_02) < 0;

            Vector3.cross(CD, CA, tmp_01);
            Vector3.cross(CD, CB, tmp_02);
            check_02 = Vector3.dot(tmp_01, tmp_02) < 0;

            return check_01 && check_02;
        }
    }
    */
}