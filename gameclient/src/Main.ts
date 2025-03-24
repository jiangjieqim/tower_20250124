import { overrideCore } from "./frame/view/OverrideCore";
import { E } from "./game/G";
import { GameConfig } from "./GameConfig";
class Main {
	constructor() {
		overrideCore();
		let refreshweb = window["refreshweb"];
		if(refreshweb){
			clearTimeout(refreshweb);
			console.log("clearTimeout refreshweb...");
		}
		if(initConfig.disableSpineCache){
            GameConfig.spineCache = false;
        }
		E.Init();
	}	
}
new Main();//激活启动类