import { AssetConfig } from "../../avatar/spine/AssetConfig";

class AtlasVo {
    url: string;
    count: number;
}

/**图集管理器 */
export class AtlasMgr {
    private atlasList: AtlasVo[] = [];
    load(url: string) {
        let cell = this.atlasList.find(o => o.url == url);
        if (cell) {
            cell.count++;
        }
        else {
            cell = new AtlasVo();
            cell.count = 1;
            cell.url = url;
            this.atlasList.push(cell);
        }
    }

    dispose(url: string) {
        let cell = this.atlasList.find(o => o.url == url);
        let need: boolean;
        if (cell) {
            cell.count--;

            if (cell.count <= 0) {
                need = true;
            }
        }else{
            need = true;
        }
        if (need) {
            AssetConfig.clearTextureRes(url);
        }
    }
}