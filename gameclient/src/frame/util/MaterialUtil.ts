
/**
 * 材质工具类
 * -方便一些公用材质的调用
*/
export class MaterialUtil {

    private static _whiteMat: Laya.UnlitMaterial;
    public static WhiteUnlitMat() {
        if (this._whiteMat == null) {
            this._whiteMat = new Laya.UnlitMaterial();
            this._whiteMat.albedoColor = new Laya.Vector4(1, 1, 1, 1);
        }
        return this._whiteMat;
    }

}