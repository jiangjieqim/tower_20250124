import Vector3 = Laya.Vector3;
import { FindPath } from "./FindPath";
import {DoubleArray} from "../../../frame/structure/DoubleArray";

/**测试寻路*/
export class Test_Findpath {
    constructor() {

        //#region 场景

        //创建场景
        var scene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;

        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 50, 0));
        camera.transform.rotate(new Laya.Vector3(-90, 0, 0), true, false);

        //添加方向光
        var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));

        //#endregion

        let map: FindPath.Map = new FindPath.Map();

        let lst: DoubleArray<FindPath.MapNode> = new DoubleArray(this.mapW, this.mapH, null);
        this.boxArray = new DoubleArray(this.mapW, this.mapH, null);

        for (var i: number = 0; i < lst.Rows; i++) {
            for (var j: number = 0; j < lst.Cols; j++) {

                if ((i + j) % 5 == 0)//设置是否为墙
                {
                    let b: number = Math.random();
                    if (b < 0.2) {
                        let node = new FindPath.MapNode();
                        node.X = i; node.Y = j; node.Type = FindPath.NodeType.Wall;
                        lst.Set(i, j, node);
                    }
                    else {
                        let node = new FindPath.MapNode();
                        node.X = i; node.Y = j; node.Type = FindPath.NodeType.Normal;
                        lst.Set(i, j, node);
                    }
                }
                else {
                    let node = new FindPath.MapNode();
                    node.X = i; node.Y = j; node.Type = FindPath.NodeType.Normal;
                    lst.Set(i, j, node);
                }
            }
        }
        map.CreateMap1(lst);
        this.findpath.Map = map.GetMap();
        this.ShowNode(scene, lst);
        this.addEventListener();
    }

    //点击事件监听
    private addEventListener(): void {
        let btn_find: Laya.Button = new Laya.Button();
        Laya.stage.addChild(btn_find);
        btn_find.pos(Laya.stage.width - 100, 0);
        btn_find.size(100, 50);
        btn_find.label = "查找";
        btn_find.labelSize = 32;

        btn_find.on(Laya.Event.CLICK, this, this.OnClickSureBtn);

        let btn_clear: Laya.Button = new Laya.Button();
        Laya.stage.addChild(btn_clear);
        btn_clear.pos(Laya.stage.width - 100, 50 + 5);
        btn_clear.size(100, 50);
        btn_clear.label = "清除";
        btn_clear.labelSize = 32;

        btn_clear.on(Laya.Event.CLICK, this, this.clearPath);

    }

    //寻路
    private findpath: FindPath.Find = new FindPath.Find();
    private boxArray: DoubleArray<Laya.MeshSprite3D>;

    public mapW: number = 10;
    public mapH: number = 20;

    private side: number = 5;

    //点击确认
    private OnClickSureBtn(): void {

        this.clearPath();

        let startNode = this.findpath.Map.Get(3, 19);
        let endNode = this.findpath.Map.Get(5, 0);

        this.findpath.OrderStartNode = startNode;
        this.findpath.OrderEndNode = endNode;

        let lst: Array<FindPath.MapNode> = this.findpath.GetPath();

        if (lst == null || lst.length == 0) {
            LogSys.Warn("未找到路径"); return;
        }

        for (var i: number = 0; i < lst.length; i++) {
            // console.log(" xx" + lst[i].x + " yy" + lst[i].y);

            // console.log(" boxx" + Math.round(lst[i].x - this.boxArray.getRows() / 2) + " boxy" + Math.round(lst[i].y - this.boxArray.getColumns() / 2));
            Laya.timer.once(i * 300, this, this.doPathPoint, [i, lst], false);
        }
    }

    private doPathPoint(i: number, lst: Array<FindPath.MapNode>) {
        var box = this.boxArray.Get(lst[i].X, lst[i].Y);
        if (box == null) return;
        // console.log(" posx::" + box.transform.position.x + "  posy::" + box.transform.position.z);

        var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        if (i == 0)
            material.albedoColor = new Laya.Vector4(0, 1, 0, 1);
        else if (i == lst.length - 1)
            material.albedoColor = new Laya.Vector4(1, 1, 0, 1);
        else
            material.albedoColor = new Laya.Vector4(1, 0, 0, 1);

        box.meshRenderer.material = material;
    }

    //显示
    private ShowNode(scene: any, lst: DoubleArray<FindPath.MapNode>): void {
        let count = 0;

        for (let x: number = 0; x < lst.Rows; x++) {
            for (let z: number = 0; z < lst.Cols; z++) {
                count++;
                Laya.timer.once(count * 10, this, this.createBox, [scene, x, z, lst.Get(x, z)], false);
            }
        }
    }

    //清除上次的路径
    private clearPath() {
        for (let x: number = 0; x < this.findpath.Map.Rows; x++) {
            for (let z: number = 0; z < this.findpath.Map.Cols; z++) {

                var box = this.boxArray.Get(x, z)
                if (box != null) {
                    var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();

                    switch (this.findpath.Map.Get(x, z).Type) {
                        case FindPath.NodeType.Wall:
                            {
                                material.albedoColor = new Laya.Vector4(0, 0, 0, 1);
                            }
                            break;
                        default:
                            {
                                material.albedoColor = new Laya.Vector4(1, 1, 1, 1);
                            }
                            break;
                    }

                    box.meshRenderer.material = material;
                }
            }
        }
    }

    //生成盒子map
    private createBox(scene: any, x: number, z: number, value: FindPath.MapNode): void {

        //添加自定义模型
        var box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.9, 0.9, 0.9))) as Laya.MeshSprite3D;
        box.transform.rotate(new Laya.Vector3(0, 0, 0), false, false);
        box.transform.position = new Vector3(Math.round(x - this.mapW / 2), 0, Math.round(z - this.mapH / 2));
        var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex: Laya.Texture2D) {
            material.albedoTexture = tex;
        }));
        if (value.Type == FindPath.NodeType.Normal)
            material.albedoColor = new Laya.Vector4(1, 1, 1, 1);
        else
            material.albedoColor = new Laya.Vector4(0, 0, 0, 1);

        box.meshRenderer.material = material;

        this.boxArray.Set(x, z, box);
    }

}