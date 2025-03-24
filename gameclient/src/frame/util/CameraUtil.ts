import Vector3 = Laya.Vector3;

/**3d场景中相机使用的工具类 */
export class CameraUtil {

    /**3d坐标 转 2d*/
    public static Pos3Dto2D(selfpos: Vector3, camera: Laya.Camera): Laya.Vector4 {
        let outpos: Laya.Vector4 = new Laya.Vector4();
        if (camera != null && camera.transform != null && camera.viewport != null)
            camera.viewport.project(selfpos, camera.projectionViewMatrix, outpos);
        return outpos;
    }

    /**3D坐标转换为屏幕中的2D坐标 */
    public static Pos3DtoPos2D(selfpos: Vector3, camera: Laya.Camera): Laya.Vector2 {
        let out: Laya.Vector4 = this.Pos3Dto2D(selfpos, camera)
        let scaleX = Laya.stage.clientScaleX;
        let scaleY = Laya.stage.clientScaleY;
        return new Laya.Vector2(out.x / scaleX, out.y / scaleY);
    }

}