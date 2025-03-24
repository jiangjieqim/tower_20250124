
import { BTAI_Base } from "./BTAI_Base";

//TODO:后面如果要用到BT，这里要重新设计，目前的写法存在一些问题。


//Wait
//将返回Continue，直到达到给定时间（首次调用时开始），然后返回Success。
//Trigger 
//允许在给定的动画师animator中设置Trigger参数（如果最后一个参数设置为false，则取消设置触发器）。始终返回成功。
//SetBool
//允许在给定的animator中设置布尔参数的值。始终返回成功
//SetActive 
//设置给定GameObject的活动/非活动状态。始终返回成功。
// </summary>
export namespace BTAI_Behaviour {
    import Vector3 = Laya.Vector3;

    // <summary>
    // 终止节点  切换到中止 状态
    // </summary>
    export class Terminate extends BTAI_Base.BTNode {

        public Tick(): BTAI_Base.BTState {
            return BTAI_Base.BTState.Abort;
        }
    }

    // <summary>
    // Log  输出Log 的节点
    // </summary>
    export class Log extends BTAI_Base.BTNode {

        msg: string;

        public constructor(msg: string) {
            super();
            this.msg = msg;
        }

        public Tick(): BTAI_Base.BTState {
            console.log(this.msg);
            return BTAI_Base.BTState.Success;
        }
    }

    //  <summary>
    //  暂停执行几秒钟。
    //  </summary>
    export class Wait extends BTAI_Base.BTNode {

        private seconds: number = 0;
        private future: number = -1;

        public constructor(seconds: number) {
            super();
            this.seconds = seconds;
        }

        public Tick(): BTAI_Base.BTState {

            if ((this.future < 0)) {
                this.future = (TimeUtil.TimeSinceStartupS + this.seconds);
            }

            if ((TimeUtil.TimeSinceStartupS >= this.future)) {
                this.future = -1;
                return BTAI_Base.BTState.Success;
            }
            else {
                return BTAI_Base.BTState.Continue;
            }
        }

        public /* override */ ToString(): string {
            return ("Wait : "
                + ((this.future - TimeUtil.TimeSinceStartupS) + (" / " + this.seconds)));
        }
    }

    //#region 角色行为

    export class IsAlive extends BTAI_Base.BTNode {

        // protected _ctrl: RoleCtrl;

        // public constructor(ctrl: RoleCtrl) {
        //     super();
        //     this._ctrl = ctrl;
        // }

        // public Tick(): BTAI_Base.BTState {

        //     // if (this._ctrl.IsDead) {
        //     //     return BTAI_Base.BTState.Failure;
        //     // }

        //     return BTAI_Base.BTState.Continue;
        // }
    }

    /**移动*/
    export class Move extends BTAI_Base.BTNode {

    }

    // /**移动到出生位置*/
    // export class MoveToBornPos extends IsAlive {
    //     protected _ctrl: RoleCtrl;

    //     private _paths: Vector3[] = [];             //路径数组
    //     private _needRecalPath: boolean = false;    //是否需要重新规划路径
    //     private _isFindingPath: boolean = false;    //是否在寻路
    //     private _curPathIdx: number = 0;            //当前寻路索引
    //     private _lastCalPathTime: number = 0;       //上次计算路径的时间
    //     private _checkDis: number = 1;              //检测距离

    //     public constructor(ctrl: RoleCtrl) {
    //         super(ctrl);
    //         this._ctrl.LookAtTargetPos();
    //         this._paths = [];
    //         this._needRecalPath = true;
    //         this._isFindingPath = false;
    //         this._curPathIdx = 0;
    //         this._lastCalPathTime = 0;
    //         this._checkDis = 0.01 //this._ctrl.RoleInfo.UnitRadius / 2.0;
    //     }

    //     private tmpStartPos: Vector3;
    //     private tmpEndPos: Vector3;
    //     private tmpStepPos: Vector3;
    //     private tmpStartNode: FindPath.MapNode;
    //     private tmpEndNode: FindPath.MapNode;
    //     private tmpStepNode: FindPath.MapNode;

    //     public Tick(): BTAI_Base.BTState {

    //         if (super.Tick() == BTAI_Base.BTState.Failure) {
    //             this.reset();
    //             return BTAI_Base.BTState.Failure;
    //         }
    //         if (this._ctrl.IsReachedPos(this._ctrl.RoleInfo.BornPos, this._checkDis)) {
    //             this.reset();
    //             return BTAI_Base.BTState.Success;
    //         }

    //         if (this._needRecalPath) { this.reCalPath(); }
    //         if (this._isFindingPath) { return BTAI_Base.BTState.Continue; }
    //         if (this._paths.length == 0) {
    //             this.reset();
    //             return BTAI_Base.BTState.Success;
    //         }
    //         else {
    //             if (TimeUtil.TimeSinceStartupS - this._lastCalPathTime > 5) {//每间隔一段时间重新规划路径
    //                 this._needRecalPath = true;
    //                 return BTAI_Base.BTState.Continue;
    //             }

    //             this.tmpStartPos = this._ctrl.RoleInfo.CurPos;
    //             // if (this._paths.length > 1) {
    //             //     if (this._curPathIdx == 0)
    //             //         this.tmpPos2 = this._paths[this._curPathIdx + 1];
    //             //     else
    //             //         this.tmpPos2 = this._paths[this._curPathIdx];
    //             // }
    //             // else
    //             this.tmpEndPos = this._paths[this._curPathIdx];

    //             if (this._paths.length == 1) { this.tmpEndPos = this._ctrl.RoleInfo.BornPos; }

    //             if (Vec3Util.GetIsWithinDistance(this.tmpStartPos, this.tmpEndPos, this._checkDis)) {
    //                 if (this._curPathIdx < this._paths.length - 1) {
    //                     this._curPathIdx++;
    //                 }
    //                 else {
    //                     this._needRecalPath = true;
    //                 }
    //             }
    //             else {
    //                 this.tmpStartNode = MapManager.Ins.GetMapNode(this.tmpStartPos);
    //                 this.tmpEndNode = MapManager.Ins.GetMapNode(this.tmpEndPos);

    //                 this.tmpStepPos = Common.Func.Vector3MoveTowards(this._ctrl.RoleInfo.CurPos, this.tmpEndPos, this._ctrl.RoleInfo.MoveSpeed);
    //                 this.tmpStepNode = MapManager.Ins.GetMapNode(this.tmpStepPos);

    //                 // if (MapManager.Ins.CheckCanEnter(this._ctrl.RoleInfo.NodeTypes, this.tarNode) || this.curNode == this.tarNode) {
    //                 // this.tmpStepPos = new Laya.Vector3(0, 180, 0);
    //                 this._ctrl.LookAtTarPos(this.tmpStepPos);          //朝向目标位置
    //                 this._ctrl.MoveToTarPos(this.tmpStepPos);          //朝目标位置移动
    //                 // }
    //                 // else {
    //                 //     this._needRecalPath = true;
    //                 // }
    //             }
    //         }

    //         return BTAI_Base.BTState.Continue;
    //     }

    //     /**重新规划路径*/
    //     private reCalPath() {
    //         this._needRecalPath = false;
    //         this._isFindingPath = true;
    //         this._curPathIdx = 0;
    //         this._paths = this._ctrl.FindPaths(this._ctrl.RoleInfo.CurPos, this._ctrl.RoleInfo.BornPos, false);
    //         this._lastCalPathTime = TimeUtil.TimeSinceStartupS;
    //         this._isFindingPath = false;
    //     }

    //     private reset() {
    //         this._paths = [];
    //         this._needRecalPath = true;
    //         this._isFindingPath = false;
    //         this._curPathIdx = 0;
    //     }
    // }

    // /**移动到目标位置*/
    // export class MoveToTarget extends IsAlive {
    //     protected _ctrl: RoleCtrl;                  //角色控制器

    //     private _paths: Vector3[] = [];             //路径数组
    //     private _needRecalPath: boolean = false;    //是否需要重新规划路径
    //     private _isFindingPath: boolean = false;    //是否在寻路
    //     private _curPathIdx: number = 0;            //当前寻路索引
    //     private _lastCalPathTime: number = 0;       //上次计算路径的时间
    //     private _checkDis: number = 1;              //检测距离

    //     public constructor(ctrl: RoleCtrl) {
    //         super(ctrl);
    //         this._ctrl.LookAtTargetPos();
    //         this._paths = [];
    //         this._needRecalPath = true;
    //         this._isFindingPath = false;
    //         this._curPathIdx = 0;
    //         this._lastCalPathTime = 0;
    //         this._checkDis = this._ctrl.RoleInfo.GetATKRadius;
    //         // console.log("checkdis:::" + this._ctrl.RoleId + "  dis:" + this._checkDis);

    //     }

    //     private tmpStartPos: Vector3;               //起始位置
    //     private tmpEndPos: Vector3;                 //结束位置
    //     private tmpStepPos: Vector3;            //下一步位置
    //     private tmpStartNode: FindPath.MapNode;     //起始节点
    //     private tmpEndNode: FindPath.MapNode;       //结束节点
    //     private tmpNextStepNode: FindPath.MapNode;  //下一步节点

    //     public Tick(): BTAI_Base.BTState {
    //         if (super.Tick() == BTAI_Base.BTState.Failure) {
    //             this.reset();
    //             return BTAI_Base.BTState.Failure;
    //         }

    //         if (this._ctrl.PreAtkTarget == null || !this._ctrl.IsAlive) {
    //             this.reset();
    //             return BTAI_Base.BTState.Success;
    //         }

    //         if (this._ctrl.IsReachedPos(this._ctrl.PreAtkTarget.RoleInfo.CurPos, this._checkDis)) {
    //             this.reset();
    //             return BTAI_Base.BTState.Success;
    //         }

    //         if (this._needRecalPath) { this.reCalPath(); }
    //         if (this._isFindingPath) { return BTAI_Base.BTState.Continue; }
    //         if (this._paths.length == 0) {
    //             this.reset();
    //             return BTAI_Base.BTState.Success;
    //         }
    //         else {
    //             if (TimeUtil.TimeSinceStartupS- this._lastCalPathTime > 1) {
    //                 let pathEndNode = MapManager.Ins.GetMapNode(this._paths[this._paths.length - 1]);
    //                 let tarNode = MapManager.Ins.GetMapNode(this._ctrl.PreAtkTarget.RoleInfo.CurPos);
    //                 if (pathEndNode != tarNode) {//目标对象在移动
    //                     this._needRecalPath = true;
    //                     return BTAI_Base.BTState.Continue;
    //                 }
    //                 if (TimeUtil.TimeSinceStartupS - this._lastCalPathTime > 5) {//每间隔一段时间重新规划路径
    //                     this._needRecalPath = true;
    //                     return BTAI_Base.BTState.Continue;
    //                 }
    //             }

    //             //当前位置
    //             this.tmpStartPos = this._ctrl.RoleInfo.CurPos;
    //             //#region 获取tmpPos2
    //             if (this._paths.length > 1 && this._curPathIdx < this._paths.length - 1) {
    //                 //判断当前位置到目标位置的距离和路径起始点位置到目标位置的距离，小于
    //                 if (Vec3Util.Distance(this.tmpStartPos, this._paths[this._curPathIdx + 1])
    //                     < Vec3Util.Distance(this._paths[this._curPathIdx], this._paths[this._curPathIdx + 1])) {
    //                     this.tmpEndPos = this._paths[this._curPathIdx + 1];
    //                 }
    //                 else {
    //                     this.tmpEndPos = this._paths[this._curPathIdx];
    //                 }
    //             }
    //             else
    //                 this.tmpEndPos = this._paths[this._curPathIdx];
    //             //#endregion

    //             if (Vec3Util.GetIsWithinDistance(this.tmpStartPos, this.tmpEndPos, 0.01)) {
    //                 if (this._curPathIdx < this._paths.length - 1) {
    //                     this._curPathIdx++;
    //                 }
    //                 else {
    //                     this._needRecalPath = true;
    //                 }
    //             }
    //             else {
    //                 this.tmpStartNode = MapManager.Ins.GetMapNode(this.tmpStartPos);
    //                 this.tmpEndNode = MapManager.Ins.GetMapNode(this.tmpEndPos);
    //                 this.tmpStepPos = Common.Func.Vector3MoveTowards(this._ctrl.RoleInfo.CurPos, this.tmpEndPos, this._ctrl.RoleInfo.MoveSpeed);
    //                 this.tmpNextStepNode = MapManager.Ins.GetMapNode(this.tmpStepPos);
    //                 //判断是否可以通过
    //                 if (this.tmpStartNode == this.tmpNextStepNode || MapManager.Ins.CheckCanEnter(this._ctrl.RoleInfo.NodeTypes, this.tmpEndNode)) {
    //                     this._ctrl.LookAtTarPos(this.tmpStepPos);          //朝向目标位置
    //                     this._ctrl.MoveToTarPos(this.tmpStepPos);          //朝目标位置移动
    //                 }
    //                 else {
    //                     this._needRecalPath = true;
    //                 }
    //             }
    //         }

    //         return BTAI_Base.BTState.Continue;
    //     }

    //     /**重新规划路径*/
    //     private reCalPath() {
    //         this._needRecalPath = false;
    //         this._isFindingPath = true;
    //         this._curPathIdx = 0;
    //         this._paths = this._ctrl.FindPaths(this._ctrl.RoleInfo.CurPos, this._ctrl.PreAtkTarget.RoleInfo.CurPos, true);
    //         this._lastCalPathTime = TimeUtil.TimeSinceStartupS;
    //         this._isFindingPath = false;
    //     }

    //     private reset() {
    //         this._paths = [];
    //         this._needRecalPath = true;
    //         this._isFindingPath = false;
    //         this._curPathIdx = 0;
    //     }

    // }

    /**播放动画*/
    export class PlayAnim extends IsAlive {

    }

    /**等待动画结束*/
    export class WaitForAnimFinish extends IsAlive {

    }

    /**设置是否显示*/
    export class SetActive extends IsAlive {

    }

    // /**死亡*/
    // export class DeadAction extends BTAI_Base.BTNode {

    //     private _ctrl: RoleCtrl;
    //     private isDeading: boolean = false;

    //     public constructor(ctrl: RoleCtrl) {
    //         super();
    //         this._ctrl = ctrl;
    //     }

    //     public Tick(): BTAI_Base.BTState {

    //         if (!this.isDeading) {
    //             this._ctrl.ShowDeadEffect();
    //             this.isDeading = true;
    //         }
    //         else {
    //             if (this._ctrl.CheckCurAniEnd()) {
    //                 //怪物回收
    //                 this._ctrl.OnClear();

    //                 return BTAI_Base.BTState.Success;
    //             }
    //         }
    //         return BTAI_Base.BTState.Continue;
    //     }



    // }

    //#endregion

    //#region 元宇宙角色行为

    /**元宇宙移动*/
    export class MetaMove extends BTAI_Base.BTNode {

        // private _ctrl: AICtrl;
        // // 状态
        // private inFindingPath: boolean = false;
        // private needRecalPath: boolean = true;
        // private movingPath: boolean = false;
        // //目标点
        // private targetPos: Vector3 = null;
        // //AI与目标点距离
        // private distance: number = 0.5;
        // //移动时间判定 超出时间停止移动
        // private moveTime: number = 0;
        // private moveTimer: number = 0;
        // private lastPos: Vector3 = null;

        // public constructor(ctrl: AICtrl) {
        //     super();
        //     this._ctrl = ctrl;
        //     this.moveTime = 5;
        //     this.reset();
        // }

        // public Tick(): BTAI_Base.BTState {
        //     if (super.Tick() == BTAI_Base.BTState.Failure) {
        //         this.reset();
        //         return BTAI_Base.BTState.Failure;
        //     }

        //     if (this.needRecalPath)
        //         this.onGetTarget();

        //     if (this.inFindingPath)
        //         return BTAI_Base.BTState.Continue;

        //     if (this.movingPath) {

        //         if (this.targetPos == null) {
        //             this.reset();
        //             return BTAI_Base.BTState.Failure;
        //         }
        //         else {
        //             let pos: Vector3 = this._ctrl.onGetPos();
        //             let selfPos: Vector3 = new Vector3(pos.x, 0, pos.z);// 自身坐标
        //             if (Vec3Util.GetIsWithinDistance(selfPos, this.targetPos, this.distance)) {// 与目标点距离够近
        //                 this.reset();
        //                 return BTAI_Base.BTState.Success;
        //             }
        //             if (this.lastPos == selfPos) {// 卡住次数判定
        //                 this.moveTimer++;
        //                 if (this.moveTimer >= this.moveTime) {
        //                     this.reset();
        //                     return BTAI_Base.BTState.Success;
        //                 }
        //             }
        //             // 移动
        //             this._ctrl.MoveToTarget();
        //             this.lastPos = selfPos;
        //         }
        //     }
        //     return BTAI_Base.BTState.Continue;
        // }


        // /**获取移动目标 */
        // private onGetTarget() {
        //     this.needRecalPath = false;
        //     this.inFindingPath = true;
        //     this.movingPath = false;

        //     this.targetPos = this._ctrl.TarPos;
        //     this._ctrl.ReadyToMove();

        //     this.movingPath = true;
        //     this.inFindingPath = false;
        // }

        // /**重置 */
        // private reset() {
        //     this.needRecalPath = true;
        //     this.inFindingPath = false;
        //     this.movingPath = false;
        //     this.targetPos = null;
        //     this.lastPos = null;
        // }

    }

    /**元宇宙待机*/
    export class MetaIdle extends BTAI_Base.BTNode {

        // private _ctrl: AICtrl;

        // public constructor(ctrl: AICtrl) {
        //     super();
        //     this._ctrl = ctrl;
        // }

        // public Tick(): BTAI_Base.BTState {
        //     if (super.Tick() == BTAI_Base.BTState.Failure) {
        //         this.reset();
        //         return BTAI_Base.BTState.Failure;
        //     }

        //     this._ctrl.ReadyToIdle();

        //     return BTAI_Base.BTState.Continue;
        // }

        // /**重置 */
        // private reset() {

        //     console.log("[MetaIdle][reset] ");

        // }
    }
    //#endregion
    //#region 矿场

    //矿车移动
    export class MineCarMove extends BTAI_Base.BTNode {

        // private _ctrl: AICtrl;
        // // 状态
        // private inFindingPath: boolean = false;
        // private needRecalPath: boolean = true;
        // private movingPath: boolean = false;
        // //目标点
        // private targetPos: Vector3 = null;
        // //AI与目标点距离
        // private distance: number = 0.5;
        // //移动时间判定 超出时间停止移动
        // private moveTime: number = 0;
        // private moveTimer: number = 0;
        // private lastPos: Vector3 = null;

        // public constructor(ctrl: AICtrl) {
        //     super();
        //     this._ctrl = ctrl;
        //     this.moveTime = 5;
        //     this.reset();
        // }

        // public Tick(): BTAI_Base.BTState {
        //     if (super.Tick() == BTAI_Base.BTState.Failure) {
        //         this.reset();
        //         return BTAI_Base.BTState.Failure;
        //     }

        //     if (this.needRecalPath)
        //         this.onGetTarget();

        //     if (this.inFindingPath)
        //         return BTAI_Base.BTState.Continue;

        //     if (this.movingPath) {

        //         if (this.targetPos == null) {
        //             this.reset();
        //             return BTAI_Base.BTState.Failure;
        //         }
        //         else {
        //             let pos: Vector3 = this._ctrl.onGetPos();
        //             let selfPos: Vector3 = new Vector3(pos.x, 0, pos.z);// 自身坐标
        //             if (Vec3Util.GetIsWithinDistance(selfPos, this.targetPos, this.distance)) {// 与目标点距离够近
        //                 this.reset();
        //                 return BTAI_Base.BTState.Success;
        //             }
        //             if (this.lastPos == selfPos) {// 卡住次数判定
        //                 this.moveTimer++;
        //                 if (this.moveTimer >= this.moveTime) {
        //                     this.reset();
        //                     return BTAI_Base.BTState.Success;
        //                 }
        //             }
        //             // 移动
        //             this._ctrl.MoveToTarget();
        //             this.lastPos = selfPos;
        //         }
        //     }
        //     return BTAI_Base.BTState.Continue;
        // }


        // /**获取移动目标 */
        // private onGetTarget() {
        //     this.needRecalPath = false;
        //     this.inFindingPath = true;
        //     this.movingPath = false;

        //     this.targetPos = this._ctrl.TarPos;
        //     this._ctrl.ReadyToMove();

        //     this.movingPath = true;
        //     this.inFindingPath = false;
        // }

        // /**重置 */
        // private reset() {
        //     this.needRecalPath = true;
        //     this.inFindingPath = false;
        //     this.movingPath = false;
        //     this.targetPos = null;
        //     this.lastPos = null;
        // }

    }

    //#endregion

}