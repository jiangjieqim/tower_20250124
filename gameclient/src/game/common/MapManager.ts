import {DoubleArray} from "../../frame/structure/DoubleArray";
import {MeshUtil} from "../../frame/util/MeshUtil";
import {NumberUtil} from "../../frame/util/NumberUtil";
import { Vec3Util } from "../../frame/util/Vec3Util";
import { FindPath } from "../systems/findpath/FindPath";

import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;
import Scene3D = Laya.Scene3D;
import MeshSprite3D = Laya.MeshSprite3D;
import Sprite3D = Laya.Sprite3D;

/**地图管理器
 * -用于管理地图中的位置、寻路
*/
export class MapManager {
    private static _ins: MapManager;
    public static get Ins() {
        if (this._ins == null) this._ins = new MapManager();
        return this._ins;
    }

    constructor() { }

    private _scene3d: Scene3D;          //3d场景
    private _battles: Sprite3D;         //战斗节点
    private _rotate: Sprite3D;          //旋转
    private _map: FindPath.Map;         //地图
    private _findPath: FindPath.Find;   //寻路

    private _rows: number = 11;
    private _cols: number = 19;
    private _cellW: number = 1.3;
    private _cellH: number = 1.3;

    public get Rows(): number { return this._rows; }
    public get Cols(): number { return this._cols; }
    public get TotalW(): number { return this._rows * this._cellW; }
    public get TotalH(): number { return this._cols * this._cellH; }
    public get HalfTotalW(): number { return this.TotalW / 2.0; }
    public get HalfTotalH(): number { return this.TotalH / 2.0; }
    public get CellW(): number { return this._cellW; }
    public get CellH(): number { return this._cellH; }
    public get HalfCellW(): number { return this._cellW / 2.0; }
    public get HalfCellH(): number { return this._cellH / 2.0; }

    private color_green: Vector4 = new Vector4(0, 1, 0, 1);
    private color_red: Vector4 = new Vector4(1, 0, 0, 1);
    private color_yellow: Vector4 = new Vector4(1, 1, 0, 1);
    private color_blue: Vector4 = new Vector4(0, 0, 1, 1);
    private color_black: Vector4 = new Vector4(0, 0, 0, 1);
    private _mapItems: DoubleArray<MapItem>;
    private _hasInit: boolean = false;

    public get Battles(): Laya.Sprite3D { return this._battles; }
    public get Rotate(): Laya.Sprite3D { return this._rotate; }

    public OnInit(scene: Laya.Scene3D) {
        if (this._hasInit) return; this._hasInit = true;
        this._scene3d = scene;
        this._battles = this._scene3d.getChildByName("Battles") as Laya.Sprite3D;
        this._rotate = this._scene3d.getChildByName("ENV").getChildByName("Roate") as Laya.Sprite3D;
        this.InitBornPosItems();
        //生成寻路网格
        this._map = new FindPath.Map();
        this._findPath = new FindPath.Find();

        let lst: DoubleArray<FindPath.MapNode> = new DoubleArray(this._rows, this._cols, null);
        this._mapItems = new DoubleArray(this._rows, this._cols, null);

        for (var i: number = 0; i < lst.Rows; i++) {
            for (var j: number = 0; j < lst.Cols; j++) {
                let node = new FindPath.MapNode();
                node.X = i; node.Y = j; node.Type = FindPath.NodeType.Normal;
                lst.Set(i, j, node);
            }
        }

        this._map.CreateMap1(lst);
        this._findPath.Map = this._map.GetMap();

        //实例化模型显示网格
        this.ShowNode(this._scene3d, lst);

        // this.OnClickSureBtn();
    }

    public OnClear() {
        if (!this._hasInit) return; this._hasInit = false;

        if (this._scene3d != null) {
            this._scene3d = null;
        }

        if (this._map != null) {
            this._map.OnClear();
            this._map = null;
        }
        if (this._findPath != null) {
            this._findPath.OnClear();
            this._findPath = null;
        }
        if (this._mapItems != null) {
            for (let x: number = 0; x < this._mapItems.Rows; x++) {
                for (let z: number = 0; z < this._mapItems.Cols; z++) {
                    this._mapItems.Get(x, z).OnClear();
                }
            }
            this._mapItems = null;
        }

        Laya.timer.clearAll(this);
        MapManager._ins = null;
    }


    //显示
    private ShowNode(scene: Scene3D, lst: DoubleArray<FindPath.MapNode>): void {
        for (let x: number = 0; x < lst.Rows; x++) {
            for (let z: number = 0; z < lst.Cols; z++) {
                this.createBox(scene, x, z, lst.Get(x, z));
            }
            // console.warn("  pos: x:" + this._mapItems.Get(x, 0).Box().transform.localPositionX + "  y:" + this._mapItems.Get(x, 0).Box().transform.localPositionZ);
        }
    }

    //生成盒子map

    private createBox(scene: Scene3D, x: number, z: number, value: FindPath.MapNode): void {
        //添加自定义模型
        var box: Laya.MeshSprite3D = MeshUtil.Box(1, 1, 1);
        scene.addChild(box);
        box.transform.rotate(Vec3Util.ZERO, false, false);

        let pos: Vector3 = new Vector3(
            NumberUtil.toFixed((x * this._cellW) - this.HalfTotalW + this.HalfCellW, 2), 0,
            NumberUtil.toFixed((z * this._cellH) - this.HalfTotalH + this.HalfCellH, 2));
        box.transform.position = pos;
        var material: Laya.UnlitMaterial = new Laya.UnlitMaterial();
        Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, (tex: Laya.Texture2D) => {
            material.albedoTexture = tex;
        }));

        let item: MapItem = new MapItem();
        item.OnInit(pos, box);
        this._mapItems.Set(x, z, item);

        box.meshRenderer.material = material;
        if (value.Type == FindPath.NodeType.Normal) {
            this.changeBoxColor(item.Box, this.color_green);
        }
        else {
            this.changeBoxColor(item.Box, this.color_black);
        }

        item.HideBox();
    }

    //清除上次的路径
    private clearPath() {
        for (let x: number = 0; x < this._findPath.Map.Rows; x++) {
            for (let z: number = 0; z < this._findPath.Map.Cols; z++) {
                var item = this._mapItems.Get(x, z)
                if (item != null) {
                    switch (this._findPath.Map.Get(x, z).Type) {
                        case FindPath.NodeType.Wall:
                            {
                                this.changeBoxColor(item.Box, this.color_black);
                            }
                            break;
                        default:
                            {
                                this.changeBoxColor(item.Box, this.color_green);
                            }
                            break;
                    }
                }
            }
        }
    }

    //点击确认
    private OnClickSureBtn(): void {

        this.clearPath();

        let startNode = this._findPath.Map.Get(0, 1);
        let endNode = this._findPath.Map.Get(this._findPath.Map.Rows - 1, this._findPath.Map.Cols - 1);

        let v3Start = this.MapNodePosToVec3(startNode.X, startNode.Y);
        this.getInnerPosCell(v3Start);

        let v3End = this.MapNodePosToVec3(endNode.X, endNode.Y);
        this.getInnerPosCell(v3End);

        this._findPath.OrderStartNode = startNode;
        this._findPath.OrderEndNode = endNode;

        let lst: Array<FindPath.MapNode> = this._findPath.GetPath();

        if (lst == null || lst.length == 0) {
            LogSys.Warn("未找到路径"); return;
        }

        for (var i: number = 0; i < lst.length; i++) {
            // console.log(" xx" + lst[i].x + " yy" + lst[i].y);
            // console.log(" boxx" + Math.round(lst[i].x - this.boxArray.getRows() / 2) + " boxy" + Math.round(lst[i].y - this.boxArray.getColumns() / 2));
            Laya.timer.once(i * 300, this, this.tagPathPoint, [i, lst], false);
        }
    }

    /**标记路径点*/
    private tagPathPoint(i: number, lst: Array<FindPath.MapNode>) {
        var item = this._mapItems.Get(lst[i].X, lst[i].Y);
        if (item == null) return;
        // console.log(" x:" + lst[i].X + " y:" + lst[i].Y + " posx::" + box.transform.position.x + "  posy::" + box.transform.position.z);
        if (i == lst.length - 1 || i == 0)
            this.changeBoxColor(item.Box, this.color_yellow);
        else
            this.changeBoxColor(item.Box, this.color_red);
    }

    /**获取地图节点*/
    private getMapNode(pos: Laya.Vector3): FindPath.MapNode {
        //实际位置转mapNode位置
        let centerPos = this.getInnerPosCell(pos);
        let nodePos = this.Vec3ToMapNodePos(centerPos);
        let mapNode = this._findPath.Map.Get(nodePos.x, nodePos.y);
        return mapNode;
    }

    private getNearMapNode(pos: Laya.Vector3): FindPath.MapNode {
        //实际位置mapNode
        let curNode = this.getMapNode(pos);
        let mapNode = this._findPath.RandOneCanPassMapNodeNearBy(curNode);
        return mapNode;
    }

    /**坐标位置转地图节点位置*/
    private Vec3ToMapNodePos(v3: Laya.Vector3): Laya.Vector2 {
        let nodePos = new Laya.Vector2();
        for (let i: number = 0; i < this._mapItems.Rows; i++) {
            for (let j: number = 0; j < this._mapItems.Cols; j++) {
                if (v3 == this._mapItems.Get(i, j).Pos)
                    nodePos = new Laya.Vector2(i, j);
            }
        }
        return nodePos;
    }

    /**地图节点位置转坐标位置*/
    private MapNodePosToVec3(x: number, y: number): Vector3 {
        return this._mapItems.Get(x, y).Pos;
    }

    /**获取所在格子的坐标点*/
    private getInnerPosCell(v3: Laya.Vector3): Laya.Vector3 {
        for (let i: number = 0; i < this._mapItems.Rows; i++) {
            for (let j: number = 0; j < this._mapItems.Cols; j++) {
                let pos = this._mapItems.Get(i, j).Pos;
                if ((pos.x - this.HalfCellW) <= v3.x && (pos.z - this.HalfCellH) <= v3.z) {//左下角
                    if ((pos.x + this.HalfCellW) > v3.x && (pos.z + this.HalfCellH) > v3.z) {//右上角
                        this.changeBoxColor(this._mapItems.Get(i, j).Box, this.color_blue);
                        return pos;
                    }
                }
            }
        }

        return Vec3Util.ZERO;
    }
    /**修改盒子颜色*/
    private changeBoxColor(box: Laya.MeshSprite3D, color: Laya.Vector4) {
        ((box.meshRenderer.material) as Laya.UnlitMaterial).albedoColor = color;
    }

    public EnterMapNode(mapNode: FindPath.MapNode) {
        if (mapNode != null) {
            mapNode.AddEntity();
            this.changeBoxColor(this._mapItems.Get(mapNode.X, mapNode.Y).Box, this.color_black);
        }
    }

    public ExitMapNode(mapNode: FindPath.MapNode) {
        if (mapNode != null) {
            mapNode.RemoveEntity();
            if (mapNode.CurEntityNum == 0)
                this.changeBoxColor(this._mapItems.Get(mapNode.X, mapNode.Y).Box, this.color_green);
        }
    }

    /**检测是否可以进入*/
    public CheckCanEnter(mapNodes: FindPath.NodeType[], mapNode: FindPath.MapNode): boolean {
        if (!ListUtil.Contains(mapNodes, mapNode.Type)) return false;
        if (mapNode.CurEntityNum > 0) return false;
        return true;
    }

    public GetMapNode(pos: Laya.Vector3): FindPath.MapNode {
        return this.getMapNode(pos);
    }

    /**获取路径*/
    public FindPath(curPos: Laya.Vector3, tarPos: Laya.Vector3, bNear: boolean): Laya.Vector3[] {
        let path: Laya.Vector3[] = [];
        this.clearPath();
        let startNode = this.getMapNode(curPos);
        let endNode = this.getMapNode(tarPos);
        ListUtil.Add(path, this.MapNodePosToVec3(startNode.X, startNode.Y));
        if (startNode == endNode) {
            // Log.Warn("开始点与结束点一致 不进行寻路");
            return path;
        }
        // Log.Warn("**************FindPath  curPos x:" + curPos.x + " z:" + curPos.z + "  tarPos x:" + tarPos.x + " z:" + tarPos.z);
        // Log.Warn("**************FindPath  startnode x:" + startNode.X + " y:" + startNode.Y + "  endnode x:" + endNode.X + " y:" + endNode.Y);
        let v3Start = this.MapNodePosToVec3(startNode.X, startNode.Y);
        this.getInnerPosCell(v3Start);
        let v3End = this.MapNodePosToVec3(endNode.X, endNode.Y);
        this.getInnerPosCell(v3End);

        this._findPath.OrderStartNode = startNode;
        this._findPath.OrderEndNode = endNode;

        if (bNear) {
            let tmpNode = this.getNearMapNode(v3End);
            if (tmpNode != null)
                this._findPath.OrderEndNode = tmpNode;
        }

        let lst: Array<FindPath.MapNode> = this._findPath.GetPath();

        if (lst == null || lst.length == 0) {
            LogSys.Warn("未找到路径"); return path;
        }

        // for (var i: number = 0; i < lst.length; i++) {
        //     Laya.timer.once(i * 300, this, this.tagPathPoint, [i, lst], false);
        // }

        lst.forEach(i => {
            let pos: Laya.Vector3 = this.MapNodePosToVec3(i.X, i.Y);
            ListUtil.Add(path, pos);
        });
        return path;
    }

    //#region 勇者出生位置相关

    private posItems: PosItem[] = [];       //位置列表

    /**初始化出生位置*/
    public InitBornPosItems() {
        this.posItems = [];
        for (let i: number = 0; i < this._battles.numChildren; i++) {
            let posItem: PosItem = new PosItem();
            posItem.pos = (this._battles.getChildAt(i) as Laya.Sprite3D).transform.localPosition;
            posItem.seatId = i + 1;
            ListUtil.Add(this.posItems, posItem);
        }
    }

    /**获取出生位置*/
    public GetBornPos(seat: number): Laya.Vector3 {
        let tmp = this.posItems.find(pItem => pItem.seatId == seat);
        if (tmp != null) {
            return tmp.pos;
        }
        return Vec3Util.ZERO;
    }

    //#endregion
}

/**地图格子实例条目*/
export class MapItem {

    private _pos: Vector3;
    private _box: MeshSprite3D;

    public OnInit(pos: Vector3, box: MeshSprite3D) {
        this._pos = pos;
        this._box = box;
    }

    public get Pos(): Vector3 { return this._pos; }
    public get Box(): MeshSprite3D { return this._box; }

    public ResetBox() {
    }

    public ShowBox(): void { this._box.active = true; }
    public HideBox(): void { this._box.active = false; }
    public IsBoxShow(): boolean { return this._box.active; }


    public OnClear() {
        if (this._box != null)
            this._box.destroy();
        this._box = null;
        this._pos = null;

    }
}

/**位置条目*/
export class PosItem {
    public pos: Laya.Vector3;           //位置坐标
    public seatId: number = 0;          //位置ID
}