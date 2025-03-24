import {DoubleArray} from "../../../frame/structure/DoubleArray";
import {MathUtil} from "../../../frame/util/MathUtil";
// import {RandomUtil} from "../../../frame/util/RandomUtil";

import Vector3 = Laya.Vector3;
import Transform = Laya.Transform;

export namespace FindPath {

    export enum NodeType {
        Normal = 1,
        Wall = 2,
    }

    /**地图节点*/
    export class MapNode {

        public X: number = 0;                       //x
        public Y: number = 0;                       //y
        public H: number = 0;                       //h
        public Type: NodeType = NodeType.Normal;    //type

        private _entityNum: number = 0;             //单位数量
        public AddEntity(): void { ++this._entityNum; }
        public RemoveEntity(): void { --this._entityNum; if (this._entityNum < 0) this._entityNum = 0; }
        public get CurEntityNum(): number { return this._entityNum; }

        private _parentNode: MapNode;
        public get ParentNode(): MapNode { return this._parentNode; }
        public SetParentNode(node: MapNode) {
            this._parentNode = node;
        }

        public get G() {
            if (this.ParentNode == null)
                return 0;
            if (this.ParentNode.X == this.X || this.ParentNode.Y == this.Y)//x或y相等
                return this.ParentNode.G + 10 + this.Type;
            else
                return this.ParentNode.G + 14 + this.Type;                  //x和y不相等
        }

        public get F() { return this.G + this.H; }

        public Clone(): MapNode {
            let node = new MapNode();
            node.X = this.X;
            node.Y = this.Y;
            node.H = this.H;
            node.Type = this.Type;
            node._parentNode = null;
            return node;
        }

        public OnClear() {
            this.X = 0;
            this.Y = 0;
            this.H = 0;
            this.Type = 0;
            this._parentNode = null;
        }
    }

    /**地图*/
    export class Map {
        private _baseMap: DoubleArray<MapNode>;

        private _mapW: number = 0;//地图宽度
        private _mapH: number = 0;//地图高度

        public CreateMap(mapW: number, mapH: number) {
            this._mapW = mapW;
            this._mapH = mapH;
            let tmpMap: DoubleArray<MapNode> = new DoubleArray<MapNode>(this._mapW, this._mapH, null);

            for (let i: number = 0; i < tmpMap.Rows; i++) {
                for (let j: number = 0; j < tmpMap.Cols; j++) {
                    let mapNode: MapNode = new MapNode();
                    mapNode.X = i;
                    mapNode.Y = j;
                    tmpMap.Set(i, j, mapNode);
                }
            }
            this._baseMap = tmpMap;
        }

        /*创建地图*/
        public CreateMap1(map: DoubleArray<MapNode>) {
            this._baseMap = map;
        }

        /**创建地图*/
        public GetMap(): DoubleArray<MapNode> {
            let tmpMap: DoubleArray<MapNode> = new DoubleArray<MapNode>(this._baseMap.Rows, this._baseMap.Cols, null);

            for (let i: number = 0; i < this._baseMap.Rows; i++) {
                for (let j: number = 0; j < this._baseMap.Cols; j++) {
                    tmpMap.Set(i, j, this._baseMap.Get(i, j).Clone());
                }
            }
            return tmpMap;
        }

        /**清除*/
        public OnClear() {
            if (this._baseMap != null) {
                for (let i: number = 0; i < this._baseMap.Rows; i++) {
                    for (let j: number = 0; j < this._baseMap.Cols; j++) {
                        this._baseMap.Get(i, j).OnClear();
                    }
                }
                this._baseMap = null;
            }
        }

    }

    export class Find {

        private _startNode: MapNode = null;
        private _endNode: MapNode = null;

        public Map: DoubleArray<MapNode> = null;
        public IntersectRadius: number = 1;         //碰撞半径，以当前坐标为中心，边长为2*IntersectRadius-1的正方形
        public OrderStartNode: MapNode = null;
        public OrderEndNode: MapNode = null;

        private openList: Array<MapNode> = null;
        private closeList: Array<MapNode> = null;

        constructor() {
            this.openList = [];
            this.closeList = [];
        }

        public OnClear() {
            this._startNode = null;
            this._endNode = null;
            this.Map = null;
            this.OrderEndNode = null;
            this.OrderEndNode = null;
            this.openList = null;
            this.closeList = null;

        }

        /**获取路径*/
        public GetPath(): MapNode[] {
            let path: MapNode[] = null;
            if (this.findPath()) {
                let tmpPath: MapNode[] = [];
                let pathNode: MapNode = this._endNode;
                while (pathNode != null && pathNode != this._startNode) {
                    ListUtil.Add(tmpPath, pathNode);
                    pathNode = pathNode.ParentNode;
                }
                path = [];
                for (let i: number = tmpPath.length - 1; i >= 0; i--) {
                    ListUtil.Add(path, tmpPath[i]);
                }
            }

            this.openList = [];
            this.closeList = [];
            return path;
        }

        /**地图节点是否可用*/
        public IsValidMapNode(x: number, y: number): boolean {

            if (this.IntersectRadius <= 0)
                return true;
            else if (this.IntersectRadius == 1) {
                if (!this.isInRange(x, y)) return false;
                if (this.Map.Get(x, y).Type == NodeType.Wall) return false;
                if (this.Map.Get(x, y).CurEntityNum > 0) return false;
                return true;
            }
            else {
                let intersectXMin = x - this.IntersectRadius + 1;
                let intersectXMax = x + this.IntersectRadius - 1;
                let intersectYMin = y - this.IntersectRadius + 1;
                let intersectYMax = y + this.IntersectRadius - 1;

                for (let xi: number = intersectXMin; xi <= intersectXMax; xi++) {
                    for (let yi: number = intersectYMin; yi <= intersectYMax; yi++) {
                        if (!this.isInRange(x, y)) return false;
                        if (this.Map.Get(xi, yi).Type == NodeType.Wall) return false;
                        if (this.Map.Get(xi, yi).CurEntityNum > 0) return false;
                    }
                }
                return true;
            }
        }

        private isInRange(x: number, y: number) {
            let xMax = this.Map.Rows - 1;
            let yMax = this.Map.Cols - 1;

            if (x < 0 || x > xMax || y < 0 || y > yMax) return false;
            return true;
        }

        private clearAllParentNode() {
            for (let x: number = 0; x < this.Map.Rows; x++) {
                for (let y: number = 0; y < this.Map.Cols; y++) {
                    this.Map.Get(x, y).SetParentNode(null);
                }
            }
        }

        /**寻找路径
         * @returns true=找到 false=未找到
        */
        private findPath(): boolean {

            if (this.OrderStartNode == null || this.OrderEndNode == null || this.Map == null) return false;

            if (!this.isInRange(this.OrderStartNode.X, this.OrderStartNode.Y)) return false;
            if (!this.isInRange(this.OrderEndNode.X, this.OrderEndNode.Y)) return false;

            this._startNode = this.Map.Get(this.OrderStartNode.X, this.OrderStartNode.Y);
            this._endNode = this.Map.Get(this.OrderEndNode.X, this.OrderEndNode.Y);

            this.openList = [];
            this.closeList = [];
            this.clearAllParentNode();
            ListUtil.Add(this.openList, this._startNode);

            while (!(ListUtil.Contains(this.closeList, this._endNode) || this.openList.length < 1)) {
                let curNode: MapNode = this.getMinFFromOpenList();

                ListUtil.Remove(this.openList, curNode);
                ListUtil.Add(this.closeList, curNode);

                let nearByNodes: MapNode[] = this.getValidMapNodeNearBy(curNode);

                nearByNodes.forEach(item => {
                    if (!ListUtil.Contains(this.openList, item)) {
                        item.SetParentNode(curNode);
                        ListUtil.Add(this.openList, item);
                        // Log.Info("path node x:" + item.X + " y:" + item.Y);
                    }
                    else {

                        let mn: MapNode = item.Clone();
                        mn.SetParentNode(curNode);
                        if (mn.G < item.G)
                            item.SetParentNode(curNode);
                    }
                });
            }
            if (ListUtil.Contains(this.closeList, this._endNode))
                return true;
            return false;
        }

        /**从openList中查找F值最小的节点*/
        private getMinFFromOpenList(): MapNode {
            if (this.openList == null || this.openList.length == 0) {
                return null;
            }
            let mn: MapNode = this.openList[0];
            this.calH(mn);
            this.openList.forEach(node => {
                this.calH(node);
                if (node.F < mn.F)
                    mn = node;
            });
            return mn;
        }

        /**计算计算节点的H值*/
        private calH(node: MapNode) {
            node.H = MathUtil.Abs(node.X - this._endNode.X) + MathUtil.Abs(node.Y - this._endNode.Y);
        }

        /**获取所有有效的临近节点*/
        public GetValidMapNodeNearBy(node: MapNode): MapNode[] {
            return this.getCanPassMapNodeNearBy(node);
        }

        /**随机一个有效的临近节点*/
        public RandOneCanPassMapNodeNearBy(node: MapNode): MapNode {
            let nodes: MapNode[] = this.getCanPassMapNodeNearBy(node);
            if (nodes == null || nodes.length == 0) return null;
            return nodes[RandomUtil.RandomRoundInt(0, nodes.length)];
        }

        /**获取可以通过的临近节点*/
        private getCanPassMapNodeNearBy(node: MapNode): MapNode[] {
            let validMapNodes: MapNode[] = [];

            for (let x: number = node.X - 1; x <= node.X + 1; x++) {
                for (let y: number = node.Y - 1; y <= node.Y + 1; y++) {

                    if (!this.isInRange(x, y)) continue;
                    if (x == node.X && y == node.Y) continue;
                    if (this.IsValidMapNode(x, y) == false) continue;

                    if (this.IntersectRadius <= 0) {
                    }
                    else {
                        if (x != node.X && y != node.Y) {
                            if (this.Map.Get(node.X, y).Type == NodeType.Wall) continue;
                            if (this.Map.Get(x, node.Y).CurEntityNum > 0) continue;
                        }
                    }
                    ListUtil.Add(validMapNodes, this.Map.Get(x, y));
                }
            }
            return validMapNodes;
        }

        /**获取临近的有效节点*/
        private getValidMapNodeNearBy(node: MapNode): MapNode[] {
            let validMapNodes: MapNode[] = [];
            for (let x: number = node.X - 1; x <= node.X + 1; x++) {
                for (let y: number = node.Y - 1; y <= node.Y + 1; y++) {

                    if (!this.isInRange(x, y)) continue;                                    //索引范围判断
                    if (x == node.X && y == node.Y) continue;                               //排除传入节点
                    if (ListUtil.Contains(this.closeList, this.Map.Get(x, y))) continue;    //是否是闭节点
                    if (this.IsValidMapNode(x, y) == false) continue;                       //是否有效节点

                    if (this.IntersectRadius <= 0) {
                    }
                    else {
                        if (x != node.X && y != node.Y) {
                            if (this.Map.Get(node.X, y).Type == NodeType.Wall) continue;
                            if (this.Map.Get(x, node.Y).CurEntityNum > 0) continue;
                        }
                    }
                    ListUtil.Add(validMapNodes, this.Map.Get(x, y));
                }
            }
            return validMapNodes;
        }
    }
}
