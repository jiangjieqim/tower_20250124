import { ELayerType as ELayerType, LayerMgr } from "../../layer/LayerMgr";

export class LayerHelper {

    public static GetLayer(layerType: ELayerType) {
        // sceneLayer = 1,//场景层
        // sceneMaskLayer = 2,//场景遮罩层
        // battleLayer = 3,//战斗层
        // navLayer = 4,//导航层
        // flyLayer = 5,//飘物层
        // frameLayer = 6,//窗口层
        // subFrameLayer = 7,//二级窗口层
        // alertLayer = 8,//警告确认层
        // screenEffectLayer = 9,//屏幕特效层
        // rollMessageLayer = 10,//滚动信息层
        // guideLayer = 11,//引导层
        // smallLoadingLayer = 12,//小loading层
        // noteLayer = 13,//公告层
        // debugLayer = 14,//调试层
        // if (layerType == ELayerType.sceneLayer) return LayerMgr.Ins.sceneLayer;
        // if (layerType == ELayerType.sceneMaskLayer) return LayerMgr.Ins.sceneMaskLayer;
        // else if (layerType == ELayerType.battleLayer) return LayerMgr.Ins.battleLayer;
        // else if (layerType == ELayerType.navLayer) return LayerMgr.Ins.navLayer;
        if (layerType == ELayerType.flyLayer) return LayerMgr.Ins.flyLayer;
        else if (layerType == ELayerType.frameLayer) return LayerMgr.Ins.frameLayer;
        else if (layerType == ELayerType.subFrameLayer) return LayerMgr.Ins.subFrameLayer;
        else if (layerType == ELayerType.alertLayer) return LayerMgr.Ins.alertLayer;
        else if (layerType == ELayerType.screenEffectLayer) return LayerMgr.Ins.screenEffectLayer;
        // else if (layerType == ELayerType.rollMessageLayer) return LayerMgr.Ins.rollMessageLayer;
        // else if (layerType == ELayerType.guideLayer) return LayerMgr.Ins.guideLayer;
        else if (layerType == ELayerType.smallLoadingLayer) return LayerMgr.Ins.smallLoadingLayer;
        else if (layerType == ELayerType.noteLayer) return LayerMgr.Ins.noteLayer;
        // else if (layerType == ELayerType.debugLayer) return LayerMgr.Ins.debugLayer;
        // else if (layerType == ELayerType.fightLayer) return LayerMgr.Ins.fightLayer;
        else {
            return LayerMgr.Ins.rootLayer;
        }
    }


}