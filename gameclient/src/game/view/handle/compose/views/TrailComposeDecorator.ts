import { stElement } from "../../../../network/protocols/BaseProto";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightUtils } from "../FightUtils";
import { EInnerSoundType, t_Inner_Sound } from "../t_Inner_Sound";
import { EComposeUpdateType } from "../vos/EComposeUpdateType";
import { IDelHeroUpdate } from "../vos/EFightEnum";
import { EMonsterPos } from "../vos/FightValueConfig";
import { ITrailDecorator } from "./TrailDecorator";
/**合成弹道轨迹装饰器 */
export class TrailComposeDecorator implements ITrailDecorator {
    private _target: ITrailDecorator;
    constructor(target: ITrailDecorator) {
        this._target = target;
    }

    play(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[]) {
        this.convert(o, type, delList);
        this.startPlay();
    }

    private get model() {
        return ComposeModel.Ins;
    }

    convert(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[]) {
        this._target.convert(o, type, delList);
        if (type == EComposeUpdateType.Compose && delList && delList.length > 0) {
            let cell = delList.shift();
            let isoX = cell.x;
            let isoY = cell.y;
            let _fight = this.model.fightView;
            this.setXY( FightUtils.IsoxToPosX(isoX) + _fight.x + ComposeConfig.cellW / 2,
                        FightUtils.IsoyToPosY(isoY, EMonsterPos.Owner) + _fight.y + ComposeConfig.cellH / 2);

            t_Inner_Sound.Ins.play(EInnerSoundType.ComposeHero);
        }
    }
    setXY(x:number,y:number){
        this._target.setXY(x,y);
    }
    startPlay() {
        this._target.startPlay();
    }
}