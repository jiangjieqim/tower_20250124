
export class ColliderHelper {

    /**获取方形物理碰撞器组件
     * @param x 
     * @param y 
     * @param z 
     * @returns 返回碰撞器组件
     */
    public static AddBoxCollider(obj: Laya.Sprite3D, x: number, y: number, z: number): Laya.Sprite3D {
        let col: Laya.PhysicsCollider = obj.addComponent(Laya.PhysicsCollider);
        let shape: Laya.BoxColliderShape = new Laya.BoxColliderShape(x, y, z);
        col.colliderShape = shape;
        return obj;
    }
    
    /**添加球形碰撞器
     * @param obj 指定添加对象
     * @param radius 指定半径
     * @returns 返回添加后的对象
     */
    public static AddSphereCollider(obj: Laya.Sprite3D, radius: number): Laya.Sprite3D {
        let col: Laya.PhysicsCollider = obj.addComponent(Laya.PhysicsCollider);
        let shape: Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        col.colliderShape = shape;
        return obj;
    }

}