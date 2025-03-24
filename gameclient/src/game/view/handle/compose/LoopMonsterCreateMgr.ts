import { stMonsterBirth } from "../../../network/protocols/BaseProto";
import { LoopBaseDecorator } from "./LoopBaseDecorator";
import { LoopMonsterCreateVo, newStMonsterBirth } from "./vos/EFightEnum";

/**怪物创建计时管理器 */
export class LoopMonsterCreateMgr extends LoopBaseDecorator {
    private dataList: LoopMonsterCreateVo[] = [];
    private _tempTime: number = 0;
    private get delayMs(): number {
        return 50;
    }
    start() {
        // this._tempTime = 0;
        LogSys.Log(`LoopMonsterCreateMgr start...`);
        for (let i = 0; i < this.dataList.length; i++) {
            let cell = this.dataList[i];
            cell.clienttime = this.model.curAdapter.clockTimeMs;
        }
        Laya.timer.frameLoop(1, this, this.onLoop);
    }

    stop() {
        LogSys.Log(`LoopMonsterCreateMgr stop...`);
        Laya.timer.clear(this, this.onLoop);
    }
    
    onLoop() {
        this._tempTime += Laya.timer.delta;
        if (this._tempTime > this.delayMs) {
            // LogSys.Log(`cur time is ${Laya.timer.currTimer}`);
            this._tempTime = 0;
            this.updateLoop();
        }
    }

    private updateLoop() {
        this.update();
    }

    private update(){
        let _list: newStMonsterBirth[] = [];
        // LogSys.Log("LoopMonsterCreateMgr:length"+this.dataList.length);
        for (let i = 0; i < this.dataList.length; i++) {
            let cell = this.dataList[i];
            // if(cell.monsterList)
            let l = cell.monsterList;

            for (let n = 0; n < l.length; n++) {
                let o: stMonsterBirth = l[n];
                
                l.splice(n, 1);
                let _newObj: newStMonsterBirth = o as newStMonsterBirth;
                _newObj.birthTime = this.model.curAdapter.clockTimeMs + _newObj.time;
                _list.push(_newObj);
                n--;
                // }
            }
            if (l.length <= 0) {
                this.dataList.splice(i, 1); 
                LogSys.Log(`LoopMonsterCreateMgr 移除索引${i}`);
                i--;
            }
        }

        if (_list.length) {
            // ComposeModel.Ins.event(ComposeEvent.CreateMonster,[_list]);
            // this.fight &&
            if(this.fight){
                this.fight.onCreateMonsterList(_list);
            }else{
                LogSys.Error(`fight未初始化`);
            }
        }

        // this.model.event(ComposeEvent.MonsterCountUpdate);
        this.fight && this.fight.updateMonsterCount();
    }
    createMonsters(l: stMonsterBirth[]) {
        // LogSys.Log(`createMonsters======>${JSON.stringify(l)}`);
        let cell = new LoopMonsterCreateVo();
        cell.clienttime = this.model.curAdapter.clockTimeMs;
        cell.monsterList = l;
        this.add(cell);
    }

    /**怪物出生之后添加出生列表中 */
    private add(vo: LoopMonsterCreateVo) {
        this.dataList.push(vo);
        // LogSys.Log(`怪物出生信息:${JSON.stringify(vo)}`);
        this.dataList = this.dataList.sort((a: LoopMonsterCreateVo, b: LoopMonsterCreateVo) => {
            if (a.clienttime < b.clienttime) {
                return -1;
            }
            else if (a.clienttime > b.clienttime) {
                return 1;
            }
            return 0;
        });
    }

    updateScale(uid: number, scale: number) {
        let l = this.dataList;
        for (let i = 0; i < l.length; i++) {
            let o = l[i];
            let monsterList = o.monsterList;
            for (let n = 0; n < monsterList.length; n++) {
                let monster = monsterList[n];
                if(monster.uid == uid){
                    (monster as newStMonsterBirth).scale = scale;
                }
            }
        }
    }
}