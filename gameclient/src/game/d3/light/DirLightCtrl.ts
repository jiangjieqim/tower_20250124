
export class DirLightCtrl extends Laya.Script {

    private _dirLight: Laya.DirectionLight;//直射灯

    public OnInit() {
        this._dirLight = this.owner as Laya.DirectionLight;

        // //灯光强度
        // this._dirLight.intensity = 2.5;
        // this._dirLight.lightmapBakedType = Laya.LightSprite.LIGHTMAPBAKEDTYPE_MIXED;
        //实时阴影
        this._dirLight.shadowMode = Laya.ShadowMode.SoftHigh;//阴影模糊
        // this._dirLight.shadowDistance = 25;//最大阴影距离
        // this._dirLight.shadowResolution = 256;//阴影贴图分辨率
        // this._dirLight.shadowCascadesMode = Laya.ShadowCascadesMode.NoCascades;//级联模式
        // this._dirLight.shadowNormalBias = 0.4;
        // this._dirLight.shadowStrength = 0.5;
        // this._dirLight.shadowNearPlane = 0.2;
    }

    public OnClear() {
        this._dirLight = null;
        this.destroy();
    }

}