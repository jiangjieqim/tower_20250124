import { Vec3Util } from "../util/Vec3Util";
/**射线检测辅助类 */
export class RaycastHelper {

    /**点击屏幕，从相机发射射线检测点到的第一个对象
     * @param cam 相机
     * @param scene3d 3d场景
     * @param point 屏幕坐标点
     * @returns 返回射线命中结果
     */
    public static Raycast(cam: Laya.Camera, scene3d: Laya.Scene3D, point: Laya.Vector2): Laya.HitResult {
        let hitres: Laya.HitResult = new Laya.HitResult();
        let ray: Laya.Ray = new Laya.Ray(Vec3Util.ZERO, Vec3Util.ZERO);
        cam.viewportPointToRay(point, ray);
        scene3d.physicsSimulation.rayCast(ray, hitres);
        return hitres;
    }

    /**点击屏幕，从相机发射射线检测点到的所有对象
     * @param cam 相机
     * @param scene3d 3d场景
     * @param point 屏幕坐标点
     * @returns 返回射线命中结果数组
    */
    public static RaycastAll(cam: Laya.Camera, scene3d: Laya.Scene3D, point: Laya.Vector2): Laya.HitResult[] {
        let hitres: Array<Laya.HitResult> = new Array<Laya.HitResult>();
        let ray: Laya.Ray = new Laya.Ray(Vec3Util.ZERO, Vec3Util.ZERO);
        cam.viewportPointToRay(point, ray);
        scene3d.physicsSimulation.rayCastAll(ray, hitres);
        return hitres;
    }

    public static RayCastFromTo(scene3d: Laya.Scene3D, from: Laya.Vector3, to: Laya.Vector3) {
        let hitres: Laya.HitResult = new Laya.HitResult();
        scene3d.physicsSimulation.raycastFromTo(from, to, hitres);
        return hitres;
    }

    public static RayCastAllFromTo(scene3d: Laya.Scene3D, from: Laya.Vector3, to: Laya.Vector3) {
        let hitres: Array<Laya.HitResult> = new Array<Laya.HitResult>();
        scene3d.physicsSimulation.raycastAllFromTo(from, to, hitres);
        return hitres;
    }

    /**
     * 从一个点沿着指定方向发射一条指定长度的射线
     * @param scene3d 3d场景
     * @param point 屏幕坐标点
     * @param dir 方向
     * @param length 长度
     */
    public static RayCastPointDirLength(scene3d: Laya.Scene3D, point: Laya.Vector3, dir: Laya.Vector3, length: number) {
        let hitres: Laya.HitResult = new Laya.HitResult();
        let ray: Laya.Ray = new Laya.Ray(point, dir);
        scene3d.physicsSimulation.rayCast(ray, hitres, length);
        return hitres;
    }

    /**
     * 从一个点沿着指定方向发射一条指定长度的射线
     * @param scene3d 3d场景
     * @param point 屏幕坐标点
     * @param dir 方向
     * @param length 长度
     */
    public static RayCastAllPointDirLength(scene3d: Laya.Scene3D, point: Laya.Vector3, dir: Laya.Vector3, length: number) {
        let hitres: Array<Laya.HitResult> = new Array<Laya.HitResult>();
        let ray: Laya.Ray = new Laya.Ray(point, dir);
        scene3d.physicsSimulation.rayCastAll(ray, hitres, length);
        return hitres;
    }

    /**形状检测 */
    public static ShapeCast(scene3d: Laya.Scene3D, shape: Laya.ColliderShape, from: Laya.Vector3, to: Laya.Vector3) {
        let hitres: Laya.HitResult = new Laya.HitResult();
        scene3d.physicsSimulation.shapeCast(shape, from, to, hitres);
        return hitres;
    }

    /**形状检测所有碰撞器 */
    public static ShapeCastAll(scene3d: Laya.Scene3D, shape: Laya.ColliderShape, from: Laya.Vector3, to: Laya.Vector3) {
        let hitres: Laya.HitResult[] = [];
        scene3d.physicsSimulation.shapeCastAll(shape, from, to, hitres);
        return hitres;
    }


}