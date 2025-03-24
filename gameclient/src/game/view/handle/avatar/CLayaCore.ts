export function texGetPixel(tex:Laya.Texture,x, y, width, height){
    var offsetX = tex.offsetX;
    var offsetY = tex.offsetY;

    var texw = tex['_w'];
    var texh = tex['_h'];

    var tex2d = tex.bitmap; 

    let draww = width;
    let drawh = height;
    ////////////////////////////////
    let dst,i;
    var tex2dw = tex2d.width;
    var tex2dh = tex2d.height;

    var ctx = new Laya.Context();

    ctx.size(width, height);
    ctx.asBitmap = true;
    var uv = null;
    let rePosX = x > offsetX ? x - offsetX : 0;
    let rePosY = y > offsetY ? y - offsetY : 0;
    if (x != 0 || y != 0 || width != tex2dw || height != tex2dh) {
        uv = tex['_uv'].slice();
        var stu = uv[0];
        var stv = uv[1];
        var uvw = uv[2] - stu;
        var uvh = uv[7] - stv;
        var uk = uvw / texw;
        var vk = uvh / texh;
        uv = [stu + rePosX * uk, stv + rePosY * vk,
            stu + (rePosX + draww) * uk, stv + rePosY * vk,
            stu + (rePosX + draww) * uk, stv + (rePosY + drawh) * vk,
            stu + rePosX * uk, stv + (rePosY + drawh) * vk];
    }
    let marginL = offsetX > x ? offsetX - x : 0;
    let marginT = offsetY > y ? offsetY - y : 0;
    var wstride = width * 4;

    
    ctx['_drawTextureM'](tex, marginL, marginT, draww, drawh, null, 1.0, uv);
    let _targets = ctx["_targets"];
    _targets.start();
    ctx.flush();
    _targets.end();
    _targets.restore();
    var dt = _targets.getData(0, 0, width, height);
    ctx.destroy();//bitmap.destroy()...
    let ret = new Uint8Array(width * height * 4);
    let st = 0;
    dst = (height - 1) * wstride;
    for (i = height - 1; i >= 0; i--) {
        ret.set(dt.slice(dst, dst + wstride), st);
        st += wstride;
        dst -= wstride;
    }
    return ret;
}