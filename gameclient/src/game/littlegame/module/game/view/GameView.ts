import {BaseUIView} from "../../../rb/BaseUIView";
import { mvc } from "../../../rb/Mvc";
import {GameContext} from "../context/GameContext";
import {CompleteView} from "./main/CompleteView";
import {FaileView} from "./main/FaileView";
import {MainView} from "./main/MainView";

export class GameView extends mvc.BaseView { 


    
    _mainView: MainView;
    get mainView() {
        return this._mainView = this._mainView || new MainView();
    }

    _failView: FaileView;
    get loseView() {
        return this._failView = this._failView || new FaileView();
    }

    _completeView: CompleteView;
    get compView() {
        return this._completeView = this._completeView || new CompleteView();
    }


    openedView: BaseUIView[];

    pushInOpenView(v: BaseUIView) {
        if (this.openedView.indexOf(v) == -1) {
            this.openedView.push(v);
        }
    }

    removeOpenView(v: BaseUIView) {
        let idx = this.openedView.indexOf(v);
        if (idx != -1) {
            this.openedView.splice(idx, 1);
        }
    }

    removeAll() {
        let views: BaseUIView[] = this.openedView.concat();

        for (let i = 0; i < views.length; i++) {
            let v = views[i];
            v && v.close(true);
        }
    }


    constructor(c: GameContext) {
        super(c);
        this.openedView = [];
    }

    init() {
        super.init();
    }

    open(param?: any) {
        super.open();
    }

    close() {
        this.removeAll();
        super.close();
        
    }

    destroy() {
        if(this.mainView){
            this.mainView.destroy();
        }
        if(this.compView){
            this.compView.destroy();
        }
        if(this.loseView){
            this.loseView.destroy();
        }
     

        super.destroy();
    }

    // doInit() {
    //     this.gotoPackStationView();
    // }


    showView(pageid: number = 1,params:any = null) {

        switch (pageid) {
            case 1:
                this.mainView.open();//就是射箭游戏
                break;
        }


    }

    // get model(): GameModel {
    //     return this.context.model as GameModel;
    // }

}