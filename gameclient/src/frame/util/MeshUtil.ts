
import { LineUtil } from "./LineUtil";
import Mesh = Laya.Mesh;
import PrimitiveMesh = Laya.PrimitiveMesh;
import MeshSprite3D = Laya.MeshSprite3D;
import Vector3 = Laya.Vector3;

export enum EDrawType{
    Line = 1,//线框渲染方式
    Solid = 2,//实体渲染
    Empty = 3,//虚拟体
}


export class MeshUtil {

    /**创建box网格
     * @param x 宽度
     * @param y 高度
     * @param z 长度
     * @returns 返回创建的box网格
     */
    public static BoxMesh(x: number, y: number, z: number): Mesh {
        return PrimitiveMesh.createBox(x, y, z);
    }

    /**创建一个box
     * @param x 宽度
     * @param y 高度
     * @param z 长度
     * @param type 是否绘制线框模式的渲染
     * @returns 返回创建的box
     */
    public static Box(x: number, y: number, z: number,isTrigger:boolean = false,
        collisionGroup:number=Laya.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER,
        type:EDrawType = EDrawType.Line,lineColor:Laya.Color = Laya.Color.GREEN
        ): MeshSprite3D
    {
        let result;
        if(type == EDrawType.Line){
            // box = LineUtil.createLineRect(x,lineColor);
            let box:Laya.MeshSprite3D = new Laya.MeshSprite3D(MeshUtil.BoxMesh(x, y, z));
            let poslist = [];
            box.meshFilter.sharedMesh.getPositions(poslist);
            box.destroy();
            let l2 = LineUtil.createList(poslist,lineColor);
            let lineobj = new Laya.PixelLineSprite3D();
            lineobj.maxLineCount = l2.length;
            lineobj.addLines(l2);
            result = lineobj;
        }else if(type == EDrawType.Solid){
            result = new Laya.MeshSprite3D(MeshUtil.BoxMesh(x, y, z));
        }else if(type == EDrawType.Empty){
            result = new Laya.Sprite3D();
        }
        let col = result.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        col.colliderShape = new Laya.BoxColliderShape(x, y, z);
        col.isTrigger = isTrigger;
        col.collisionGroup = collisionGroup;
        return result;
    }
}