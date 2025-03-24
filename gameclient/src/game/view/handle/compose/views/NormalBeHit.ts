import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { FightFactory } from "../FightFactory";
import { DizzySkill } from "./DizzySkill";
/**普通受击 */
export class NormalBeHit extends DizzySkill{
    protected onInit(){
        this._frameAvatr = FightFactory.createDefaultFrame(`res/atlas/hit/0`,this._scale);
        this._frameAvatr.play(EAvatarAnim.TowerIdle,this,this.onPlayEnd);
    }
    private onPlayEnd(){
        this.dispose();
    }
    protected onFrameLoop() {
        if (this._target && this._target.coreSpine && 
            this._target.coreSpine.skeleton && 
            this._target.coreSpine.skeleton.parent) 
        {
            this.setView();
        }
    }
}