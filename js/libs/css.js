import Dom from './libs/dom'
import Music from './libs/music'

window.ctx = canvas.getContext('2d')
var width = canvas.width, height = canvas.height;
if (window.devicePixelRatio) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.height = height * window.devicePixelRatio;
    canvas.width = width * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
ctx.fillStyle = '#7B459D';
ctx.fillRect(0, 0, canvas.width, canvas.height); 

function p(s) {
    console.log(s); 
}  

/** --------------------------------------------------------------------------
 * 游戏主函数
 */
export default class Main {
    constructor() {
        if (0 && window.navigator.platform == 'devtools') {
            this.sUrl = 'http://llx/new.php';
        } else {
            this.sUrl = 'https://hutxy.cn/new.php';
        }        
        this.ww = window.innerWidth; 
        this.wh = window.innerHeight; 
        this.bli= this.ww/1000;
        this.gk = {};
        this.us = {};
        this.config = { CY_fxTxt: ['超好玩的益智小游戏，不用下载即可畅玩'], CY_fxImg: 'img/1.jpg',CY_fxCS:''};
        this.dom = {};
        this.dombg = {};
        this.syin = true;
        this.iniVar();
        //this.opt = wx.geShowOptionsSync();
        this.fid = 0;
        this.qzt = 0;
        this.scene = 0;
        let that = this;
        wx.onShow(function (t) {
            if(undefined!=t.query.fid){
                that.fid = t.query.fid;
            } 
            if (undefined != t.query.qz) {
                that.qzt = t.query.qz;
            } 
            that.scene = t.scene;
        });

        //p(this.opt);

        // 维护当前requestAnimationFrame的id
        this.aniId = 0;
        //ctxOnTH();
        this.getConfig();
        
    }
    iniVar() {
        var that = this;
        this.aPos = {}; //走线坐标
        this.nX = 5;
        this.nY = 5;

        this.nIX = 5;
        this.nIY = 5;

        this.Fx = 0;  //走线框X宽   
        this.Fy = 0;  //走线框Y高
        this.Fr = 0;  //走线框圆半径  

        this.tp = 100; //顶部
        this.bk = 40; //边框
        this.kh = this.wh / 2 - this.bk;

        this.cuDH = this.tp + this.kh + 10;
        this.bTS = false;
        this.arO = [];
        this.indArO = []; 
        this.PlayArO = [];
        this.NextGG = [];
        this.ThisGG = 0;
        this.ThisGK = 1; 
        this.ThisPH = [];
        this.gDDN   = false;
        this.qzTime = 0; //求助时间
        
        this.HLine = true;  //画线锁

        this.aColor = ["#e78cc9", "#a9e445", "#FFFFFF", "#78bff6", '#ff0066', '#ff00ff', '#cc0066', '#666666', '#663366', '#339966', '#000066', '#0033cc', '#0099cc', '#66cccc', '#9966ff', '#3300ff'];

        let yunw = this.rand(30, 100), yunh = this.rand(10, 20),yunx = this.rand(0,this.ww);
        for (var n=0;n<=7;n++){
            this.dombg['yun' + n] = new Dom('allPage', 'img', 'src:img/yun.png;mv:'+this.rand(1,10)+';width:' + yunw + ';height:' + yunw * 0.73 + ';x:' + yunx+';y:' + yunh + ';')
            yunh += yunw * 0.73 + this.rand(10, 50);
            yunw = this.rand(60, 80);
            yunx = this.rand(0, this.ww);
        }

		this.buildStartBtn();
    }

    del(v){
        for(var dx in this.dom){
            if (undefined !== this.dom[dx].attr['class'] && this.dom[dx].attr['class']==v){
                delete this.dom[dx];
            }
        }
        this.iniDoms();
    }
    btm_btn(h){
        let that = this;
        if (undefined !== this.dom['b1']) {
            return;
        }
        let btnw = 146 * this.bli, btnh = 184 * this.bli, btnkx = (this.ww - 80 - 4 * btnw) / 3;
        this.dom.b1 = new Dom('index', 'img', 'src:img/b1.png;width:' + btnw + ';height:' + btnh + ';x:40;y:' + h + ';', { click: function () { that.ts_qiandao(); } });
        this.dom.b2 = new Dom('index', 'img', 'src:img/b2.png;width:' + btnw + ';height:' + btnh + ';x:' + (40 + btnkx + btnw) + ';y:' + h + ';',{click:function(){that.restart('order')}});
        this.dom.b3 = new Dom('index', 'img', 'src:img/b3.png;width:' + btnw + ';height:' + btnh + ';x:' + (40 + 2 * btnkx + 2 * btnw) + ';y:' + h + ';', { click: function () { that.fx() } });
        this.dom.b4 = new Dom('index', 'img', 'src:img/b4.png;width:' + btnw + ';height:' + btnh + ';x:' + (40 + 3 * btnkx + 3 * btnw) + ';y:' + h + ';', { click: function () { that.ts_fuli();}});
    }
    ts_bg(s){
        let that = this;
        this.start.hide();
        if (undefined !== this.dom['ts_wh']) {
            return;
        }

        this.dom.ts_wh = new Dom('index', 'img', 'class:ts;src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { } });
        this.dom.ts_bg = new Dom('index', 'img', 'class:ts;src:img/ttbg.png;width:' + 729 * this.bli + ';height:' + 934 * this.bli + ';x:' + (this.ww - 729 * this.bli) / 2 + ';y:' + (this.wh - 934 * this.bli) / 2 + ';');
        this.dom.ts_titbg = new Dom('index', 'img', 'class:ts;src:img/ttit.png;width:' + 762 * this.bli + ';height:' + 106 * this.bli + ';x:' + (this.ww - 762 * this.bli) / 2 + ';y:' + ((this.wh - 934 * this.bli) / 2 - 5) + ';');

        this.dom.ts_tit = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:16px 微软雅黑;textalign:center;valign:middle;x:' + this.ww / 2 + ';y:' + (this.dom.ts_titbg.attr.y + 93 * this.bli / 2) + ';', { text: s })

        this.dom.ts_close = new Dom('index', 'img', 'class:ts;src:img/lt4.png;width:' + 81 * this.bli + ';height:' + 81 * this.bli + ';x:' + (this.ww - 81 * this.bli) / 2 + ';y:' + (this.dom.ts_bg.attr.y + this.dom.ts_bg.attr.height) + ';',{click:function(){
            that.del('ts');that.start.show();
        }});
    }
    ts_fuli() {
        this.ts_bg('邀好友领福利');
        if (undefined !== this.dom['qd5_1'] || undefined === this.config || undefined === this.config.yq) {
            return;
        }
        let that = this;

        let xw = (this.dom.ts_bg.attr.width - 20);
        let xh = (this.dom.ts_bg.attr.height - this.dom.ts_titbg.attr.height - 60) / 5;

        let xx = this.dom.ts_bg.attr.x + 10, xy = this.dom.ts_titbg.attr.y + this.dom.ts_titbg.attr.height + 10;

        for (var i = 1; i <= 5; i++) {    
            this.dom['qd6_1_' + i] = new Dom('allPage', 'div', 'class:ts;background:#DFCEEA;border:#999;radius:5;width:' + xw + ';height:' + xh + ';x:' + xx + ';y:' + xy + ';');

            if (i == 1){
                this.dom['qd6_2_' + i] = new Dom('allPage', 'img', 'class:ts;src:img/123.jpg;yuan:18;width:' + xh * 0.6 + ';height:' + xh * 0.6 + ';x:' + (xx + xh * 0.2) + ';y:' + (xy + xh * 0.2) + ';');
            }else {
                this.dom['qd6_2_' + i] = new Dom('allPage', 'img', 'class:ts;src:img/jia.png;width:' + xh * 0.6 + ';height:' + xh * 0.6 + ';x:' + (xx + xh * 0.2) + ';y:' + (xy + xh * 0.2) + ';',{click:function(){that.fx()}});
            }

            this.dom['qd6_3_' + i] = new Dom('allPage', 'font', 'class:ts;color:#000;font:14px 微软雅黑;textalign:left;valign:top;x:' + (xx + xh * 0.2 + xh * 0.6 + 10) + ';y: ' + (xy + xh * 0.2) + ';', { text: '邀请第' + i + '位好友' });

            this.dom['qd6_5_' + i] = new Dom('allPage', 'img', 'class:ts;src:img/jinbi.png;width:' + (xh * 0.3) + ';height:' + (xh * 0.3 / 52 * 58)+';x:' + (xx + xh * 0.2 + xh * 0.6 + 10) + ';y: ' + (xy + xh * 0.2 + 16) + ';');

            this.dom['qd6_6_' + i] = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:14px 微软雅黑;textalign:left;valign:top;x:' + (xx + xh * 0.2 + xh * 0.6 + 10 + xh * 0.4) + ';y: ' + (xy + xh * 0.2 + 18) + ';', { text: '+ ' + this.config.yq[i]});

            this.dom['qd6_4_' + i] = new Dom('allPage', 'img', 'class:ts;src:img/lqu_off.png;width:' + 140 * this.bli + ';height:' + 53 * this.bli + ';x:' + (xx + xw - xh * 0.2 - 140 * this.bli) + ';y:' + (xy + xh / 2 - 53 * this.bli/2) + ';');

            xy += xh + 10;
        }
		this.iniDoms();
    }

    ts_guiz(){
		this.start.hide();
        let that = this;
        let gzw = (this.ww - 40);
        let gzh = gzw * 0.54;
        this.dom.gzbg = new Dom('index', 'img', 'class:guiz;src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () {} });
        this.dom.gzs = new Dom('index', 'img', 'class:guiz;src:img/gzs.png;width:' + gzw + ';height:' + gzw * 0.54 + ';x:20;y:' + (this.wh - gzh) / 2 + ';');
        this.dom['gzx'] = new Dom('index', 'img', 'class:guiz;src:img/xx.png;width:30;height:30;x:' + (this.ww - 30) / 2 + ';y:' + ((this.wh - gzh) / 2 + gzh + 10) + ';', {
            click: function () {that.del('guiz');that.start.show();}
        });     
		this.iniDoms();
    }
    ts_qiandao(){        
        this.ts_bg('每日签到奖励');
        if (undefined !== this.dom['qd5_1'] || undefined === this.config || undefined === this.config.qd){
            return;
        }

        let xw = (this.dom.ts_bg.attr.width-40)/3;
        let xh = (this.dom.ts_bg.attr.height - this.dom.ts_titbg.attr.height - 40)/3;
        let xx = this.dom.ts_bg.attr.x + 10, xy = this.dom.ts_titbg.attr.y + this.dom.ts_titbg.attr.height+10,xx2 = xx;
        for (var i=1;i<=7;i++){            
            this.dom['qd5_' + i] = new Dom('allPage', 'div', 'class:ts;background:#DFCEEA;border:#999;radius:5;width:' + xw + ';height:' + xh + ';x:' + xx + ';y:' + xy+';', {})
            if (i==7){
                this.dom['qd5f_' + i] = new Dom('allPage', 'font', 'class:ts;color:#000;font:12px 微软雅黑;textalign:center;valign:middle;x:' + (this.ww / 2) + ';y:' + (xy + xh * 0.2) + ';', { text: '连续领取 第 ' + i + ' 天' })
            } else {
                this.dom['qd5f_' + i] = new Dom('allPage', 'font', 'class:ts;color:#000;font:12px 微软雅黑;textalign:center;valign:middle;x:' + (xx + xw / 2) + ';y:' + (xy + xh*0.2) + ';', { text: '第 ' + i + ' 天' });
            }

            this.dom['qd5i_' + i] = new Dom('index', 'img', 'class:ts;src:img/jinbi.png;width:' + 52 * this.bli + ';height:' + 58 * this.bli + ';x:' + (xx + xw / 2 - 52 * this.bli - 10) + ';y:' + (xy + xh * 0.5 - (58 * this.bli)/2) + ';');

            this.dom['qd5b_' + i] = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:16px 微软雅黑;textalign:left;valign:middle;x:' + (xx + xw / 2 - 10) + ';y:' + (xy + xh * 0.5) + ';', { text: ' +' + this.config.qd[i] });

            if (i == 1){
                this.dom['qd5gx_' + i] = new Dom('index', 'img', 'class:ts;src:img/gou.png;width:' + 66 * this.bli + ';height:' + 55 * this.bli + ';x:' + (xx + xw / 2 - 66 * this.bli / 2) + ';y:' + (xy + xh - xh * 0.2 - (55 * this.bli) / 2) + ';');
            }else{
                this.dom['qd5x_' + i] = new Dom('index', 'img', 'class:ts;src:img/lqu.png;width:' + 140 * this.bli + ';height:' + 53 * this.bli + ';x:' + (xx + xw / 2 - 140 * this.bli/2) + ';y:' + (xy + xh - xh * 0.2 - (53 * this.bli) / 2) + ';');
            }
            xx += xw + 10;
            if (i == 6) {
                xw = (this.dom.ts_bg.attr.width - 20);
                xy += xh + 10;
                xx = xx2;
            } else if (i == 3) {
                xy += xh + 10;
                xx = xx2;
            }
        }
		this.iniDoms();
    }

    restart(s) {
        this.gDDN  = false;
        this.qzTime= 0
        this.shanK = false;
        this.ThisGG = 0;
        this.NextGG = [];
        this.bTS = false;
        let that = this;
        this.clickMove = false;
        this.dom ={};
        this.HLine = true;
        this.ThisPH = [];
        that.music = new Music();
        if (s == 'level') {
            this.start.hide()
            var open = that.us.data.dj_open == '' ? {} : JSON.parse(that.us.data.dj_open);
            var level = that.us.data.dj_level == '' ? {} : JSON.parse(that.us.data.dj_level);
            this.dom.goHome = new Dom('level', 'img', 'src:img/lt1.png;width:' + this.bli * 70 + ';height:' + this.bli * 70 +';x:20;y:15;', { click: function () { that.restart(); } })
            //this.dom.lev = new Dom('level', 'div', 'line:1;width:' + (this.ww - 20) + ';height:' + (this.wh * 0.7) + ';x:10;y:45;', {})
            this.cuDH = 60;
            let levw = (this.ww - 60) / 3;
            let levh = (this.wh * 0.7 / 7 - 10);
            let levl = 20;
            let gka = {};
            var ji = 1;
            for (var i = 4; i <= 10; i++) {
                this.cuDH += 10;
                var k = 1;
                for (var j = i; j <= i + 2; j++) { 
                    var key = j + '_' + i; 
                    if (undefined === open[key] || open[key] != 1) {
                        this.dom['div_' + (key)] = new Dom('level', 'div', 'line:1;border:#ccc;background:#B59AC5;width:' + levw + ';height:' + levh + ';x:' + levl + ';y:' + this.cuDH + ';', {
                            h: j, l: i, ji: ji,
                            click: function (t) { wx.showToast({ title: '锁定', image: 'img/tips.png' }) }
                            //, f: this.dom.lev
                        });
                        this.dom['suo_' + (key)] = new Dom('level', 'img', 'src:img/suo.png;width:24;height:30;x:' + (levl + levw / 2 - 12) + ';y:' + (this.cuDH + levh / 2 - 15) + ';', { f: this.dom.lev });
                    } else {
                        this.dom['div_' + (key)] = new Dom('level', 'div', 'line:1;border:#ccc;background:#B59AC5;width:' + levw + ';height:' + levh + ';x:' + levl + ';y:' + this.cuDH + ';', {
                            h: j, l: i, ji: ji,
                            click: function (t) { that.restart('play', t.attr.h, t.attr.l, t.attr.ji) }
                            //, f: this.dom.lev
                        });

                        this.dom['lv_' + (key)] = new Dom('level', 'font', 'color:#3C214B;font:16px bold 微软雅黑;textalign:center;valign:center;x:' + (levl + levw / 2) + ';y:' + (this.cuDH + levh / 2) + ';', { text: '大师 ' + (ji++) + ' 级'
                            //, f: this.dom.lev 
                        });	//j + 'x' + i
                        this.dom['guan_' + (key)] = new Dom('level', 'font', 'color:#fff;font:12px 微软雅黑;textalign:right;x:' + (levl + levw - 3) + ';y:' + (this.cuDH + levh - 5) + ';', { text: that.gk[key] != undefined ? ' ' + (level[key] == undefined ? 0 : level[key]) + ' / ' + that.gk[key] : ''
                            //, f: this.dom.lev 
                        });
                    }
                    //echo '<option value="'.$i.'x'.$j.'">'.$j.' 行 - '.$i.' 列</option>';
                    k += 1;
                    if (k > 3) {
                        this.cuDH += levh
                        levl = 20;
                        k = 1;
                    } else {
                        levl += 10 + levw;
                    }
                }
            }
            //this.domlev.attr.height = this.cuDH + 10;
            canvas.removeEventListener('touchstart', this.touchHandler);
            this.hasEventBind = false;
            this.bindLoop = this.level.bind(this)
        } else if (s == 'play') {
            this.ThisGG = arguments[3];
            this.start.hide()
            this.tp = 80; //顶部
            this.bk = 10; //边框
            this.kh = this.wh * 0.6 - this.bk;
            this.cuO = -1;
            this.OcuO = -1;	//之前点了的点

            this.HLine = false;
            if (arguments.length >= 3) {
                this.nX = arguments[1]; this.nY = arguments[2];
                that.posXY(that.nX, that.nY, (this.wh * 0.6 - this.bk));
            } else {
                this.restart('level');
                return;
            }
            this.MicroT = this.now_m();
            this.PlayArO = [];
            this.buShu = 0;
            this.dom[0] = new Dom('level', 'img', 'src:img/lt1.png;width:' + this.bli * 70 + ';height:' + this.bli * 70 + ';x:10;y:15;', { click: function () { that.restart(); } })
            this.dom[1] = new Dom('level', 'img', 'src:img/lt2.png;width:' + this.bli * 70 + ';height:' + this.bli * 70 + ';x:' + (this.dom[0].attr.width+20)+';y:15;', { click: function () { that.restart('level'); } })
            this.dom[2] = new Dom('play', 'font', 'color:#FFF;font:16px 微软雅黑;textalign:center;x:'+this.ww/2+';y:40;', { text: '大师 ' + this.ThisGG + ' 级' })
            this.dom[3] = new Dom('play', 'font', 'color:#FFF;font:14px 微软雅黑;textalign:left;x:'+this.bk+';y:70;', { text: '步数：' + that.buShu })
            this.dom[4] = new Dom('play', 'font', 'color:#FFF;font:14px 微软雅黑;textalign:center;x:' + this.ww / 2 + ';y:70;', { text: '金币：' + that.us.jbi })
            this.dom[5] = new Dom('play', 'img', 'src:img/icon_chonglai.png;width:40;height:40;x:10;y:' + (this.kh + 10 + this.tp) + ';', { click: function () { that.restart(); } })
            this.dom[6] = new Dom('play', 'img', 'src:img/icon_help.png;width:107;height:40;x:' + (this.ww - 234) + ';y:' + (this.kh + 10 + this.tp) + ';', { click: function () { p('分享提示'); that.fx(1); } })
            this.dom[7] = new Dom('play', 'img', 'src:img/icon_tishi.png;width:107;height:40;x:' + (this.ww - 117) + ';y:' + (this.kh + 10 + this.tp) + ';', { click: function () { p('金币提示'); that.tiShi() } })

            this.post({ act: 'gLine', h: this.nX, l: this.nY }, function (t) {
                if (t.line != undefined) {
                    that.arO = t.line.data;
                    that.ThisGK = t.line.guan;
                    that.ThisPH = t.ph;
                    that.dom[2].attr.text = '大师' + that.ThisGG + '级 第' + t.line.guan + '关'
                    that.NextGG = t.next;
                    that.MicroT = that.now_m();
                    for (var i = 0; i < that.arO.length; i++) {
                        if (that.arO[i].length > 0) {
                            var x0 = that.arO[i][0]; x0[x0.length] = i; x0[x0.length] = -1;

                            that.PlayArO[that.PlayArO.length] = [x0,];
                            x0 = that.arO[i][that.arO[i].length - 1]; x0[x0.length] = i;x0[x0.length] = -1;
                            that.PlayArO[that.PlayArO.length] = [x0,];
                        }
                    }
                }
            });

			/*
            //弹出窗口
            let btww = Math.sqrt(this.ww*this.ww+this.wh*this.wh)
            this.dom['altBG1'] = new Dom('allPage', 'img', 'src:img/bjgang.png;z:1;width:' + btww + ';height:' + btww + ';x:' + (this.ww - btww) / 2 + ';y:'+ (this.wh-btww)/2+';', { click: function () { p('点了对话背景') } })
            let altY = ((this.wh - 400) / 2);
            this.dom['altBG2'] = new Dom('allPage', 'img', 'src:img/tc.png;width:320;height:340;x:' + ((this.ww - 320) / 2) + ';y:' + (altY) + ';')
            altY += 20;
            let altX = (this.ww / 2);
            p(altX);
            this.dom['f1'] = new Dom('play', 'font', 'color:#D9CAE6;textalign:center;font:14px 微软雅黑;x:' + altX + ';y:' + altY + ';', { text: '大师1级 通关' })

            altY += 25;
            this.dom['f2'] = new Dom('play', 'font', 'color:#FFF;font:24px 微软雅黑;textalign:center;x:' + altX + ';y:' + altY + ';', { text: '最小步数过关' })

            altY += 25;
            this.dom['f3'] = new Dom('play', 'font', 'color:#D9CAE6;font:16px 微软雅黑;textalign:center;x:' + altX + ';y:' + altY + ';', { text: '第16关' })

            altY += 30;
            this.dom['lihai'] = new Dom('allPage', 'div', 'background:red;radius:5;border:red;font:14px 微软雅黑;color:#FFF;textAlign:center;valign:middle;width:90;height:25;x:' + (altX - 45) + ';y:' + altY + ';', { text: '太厉害了！' })

            //altY += 10;  //通大关
            this.dom['gdg'] = new Dom('allPage', 'img', 'src:img/zan.png;width:140;height:185;x:' + (altX - 70) + ';y:' + (altY+10) + ';')
            
            altY += 70;
            this.dom['f4'] = new Dom('allPage', 'font', 'color:#804727;font:80px 微软雅黑;textalign:center;x:' + (altX - 30) + ';y:' + altY + ';', { text: '6' })
            this.dom['f5'] = new Dom('allPage', 'font', 'color:#804727;font:30px 微软雅黑;textalign:center;x:' + (altX + 30) + ';y:' + (altY+15) + ';', { text: '步' })

            altY += 50;
            this.dom['f6'] = new Dom('allPage', 'font', 'color:#804727;font:14px 微软雅黑;textAlign:center;width:250;height:25;x:' + altX + ';y:' + altY + ';', { text: '用时　　　　超过全国　　　　玩家' })
            this.dom['f6_2'] = new Dom('allPage', 'font', 'color:#F60;font:14px 微软雅黑;textAlign:center;width:250;height:25;x:' + altX + ';y:' + altY + ';', { text: '0秒　　　　　0%' })

            altY += 20;
            this.dom['f7'] = new Dom('allPage', 'div', 'color:#804727;background:#FDF5DB;border:#F9E08A;radius:5;font:14px 微软雅黑;textAlign:center;valign:middle;width:300;height:88;x:' + (altX - 150) + ';y:' + altY + ';', {})

            altY += 8;
            let pyi = 85;
            this.dom['r1_1'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX - pyi) + ';y:' + altY + ';', { text: '1' })
            this.dom['r1_t'] = new Dom('allPage', 'img', 'src:img/1.gif;width:36;height:36;x:' + (altX - pyi - 18) + ';y:' + (altY + 8) + ';')
            this.dom['r1_2'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX - pyi) + ';y:' + (altY + 55) + ';', { text: '姓名' })
            this.dom['r1_3'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX - pyi) + ';y:' + (altY + 70) + ';', { text: '4步' })

            this.dom['r2_1'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX) + ';y:' + altY + ';', { text: '2' })
            this.dom['r2_t'] = new Dom('allPage', 'img', 'src:img/1.gif;width:36;height:36;x:' + (altX - 18) + ';y:' + (altY + 8) + ';')
            this.dom['r2_2'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX) + ';y:' + (altY + 55) + ';', { text: '姓名' })
            this.dom['r2_3'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX) + ';y:' + (altY + 70) + ';', { text: '4步' })

            this.dom['r3_1'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX + pyi) + ';y:' + altY + ';', { text: '3' })
            this.dom['r3_t'] = new Dom('allPage', 'img', 'src:img/1.gif;width:36;height:36;x:' + (altX + pyi - 18) + ';y:' + (altY + 8) + ';')
            this.dom['r3_2'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX + pyi) + ';y:' + (altY + 55) + ';', { text: '姓名' })
            this.dom['r3_3'] = new Dom('allPage', 'font', 'color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX + pyi) + ';y:' + (altY + 70) + ';', { text: '4步' })

            this.dom['fxbtn'] = new Dom('allPage', 'img', 'src:img/fxbtn.png;width:140;height:47;x:' + ((this.ww - 320) / 2 + 10) + ';y:' + (altY + 100) + ';', { click: function () { that.fx() } })
            this.dom['xxbtn'] = new Dom('allPage', 'img', 'src:img/xxbtn.png;width:140;height:47;x:' + ((this.ww - 320) / 2 + 10) + ';y:' + (altY + 100) + ';', { click: function () { that.altGGHide(); that.restart('level') } })
            this.dom['nxbtn'] = new Dom('allPage', 'img', 'src:img/nxbtn.png;width:140;height:47;x:' + (altX + 10) + ';y:' + (altY + 100) + ';', { click: function () { that.restart('play', that.NextGG[0], that.NextGG[1], that.NextGG[2])}});
            that.altGGHide();


			
			
            this.dom.tsbg = new Dom('index', 'img', 'src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { } });
            let ddw = this.ww - 100;
            let ddh = ddw * 1.172;
            this.dom.ddai = new Dom('index', 'img', 'src:img/ddai.png;width:' + ddw + ';height:' + ddh + ';x:' + (this.ww - ddw) / 2 + ';y:' + (this.wh - ddh) / 2 + ';', { click: function () { } });
            this.dom.ddz = new Dom('index', 'img', 'src:img/zzz.png;z:50;width:' + ddw * 0.228 + ';height:' + ddw * 0.228 + ';x:' + (this.ww - ddw * 0.228) / 2 + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.03) + ';', { click: function () { } });
            this.dom.ddtx = new Dom('index', 'img', 'src:img/123.jpg;yuan:' + (ddw * 0.114) + ';width:' + ddw * 0.228 + ';height:' + ddw * 0.228 + ';x:' + (this.ww - ddw * 0.228) / 2 + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.03) + ';', { click: function () { } });
            this.dom.ddwz = new Dom('index', 'font', 'color:#7B459D;font:40px sans-serif;valign:middle;textalign:center;x:' + (this.ww / 2) + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.15) + ';', { text: '' })
            this.dom.ddNA = new Dom('index', 'font', 'color:#FFF;font:28px sans-serif;valign:middle;textalign:center;x:' + (this.ww / 2) + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.36) + ';', { text: '' })
            this.dom.ddbtn = new Dom('index', 'img', 'src:img/bden.png;width:' + ddw * 0.44 + ';height:' + ddw * 0.14 + ';x:' + (this.ww - ddw * 0.44) / 2 + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.93) + ';', { click: function () { that.ddHide(); } });
            this.ddHide();
			*/

            /*let altH = 180;
            this.dom['altBG'] = new Dom('allPage', 'img', 'src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { p('点了对话背景') } })
            this.dom['altK'] = new Dom('allPage', 'div', 'background:#FFF;yy:#000;yyk:10;width:' + this.ww / 4 * 3 + ';height:' + altH + ';x:' + (this.ww - this.ww / 4 * 3) / 2 + ';y:' + ((this.wh - altH) / 2) + ';')
            this.dom['altTit'] = new Dom('allPage', 'div', 'background:#7B459D;font:14px 微软雅黑;color:#FFF;textAlign:center;valign:middle;width:' + (this.ww / 4 * 3 - 4) + ';height:40;x:2;y:2;', { f: that.dom['altK'], text: '对话框' })
            this.dom['altTxt'] = new Dom('allPage', 'div', 'background:#FFF;font:14px 微软雅黑;color:#333;textAlign:center;valign:middle;width:' + this.ww / 4 * 3 + ';height:40;x:0;y:60;', { f: that.dom['altK'], text: '对话框对话框对话框对话框对话框' })
            this.dom['OK'] = new Dom('allPage', 'div', 'background:#7B459D;font:16px 微软雅黑;color:#FFF;textAlign:center;valign:middle;yy:#000000;yyk:5;width:' + this.ww / 3 + ';height:40;x:10;y:' + (altH - 50) + ';', {
                f: that.dom['altK'], text: '确定',
                click: function () {
                    that.restart('play', that.NextGG[0], that.NextGG[1], that.NextGG[2])
                }
            })
            this.dom['Can'] = new Dom('allPage', 'div', 'background:#666;font:16px 微软雅黑;color:#BBB;textAlign:center;valign:middle;yy:#000000;yyk:5;width:' + this.ww / 3 + ';height:40;x:' + (20 + this.ww / 3) + ';y:' + (altH - 50) + ';', { f: that.dom['altK'], text: '取消', click: function () { that.altHide(); that.restart('level') } })
            this.altHide();*/

            canvas.removeEventListener('touchstart', this.touchHandler);
            canvas.removeEventListener('touchmove', this.touchMVHandler);
            this.hasEventBind = false;

            this.bindLoop = this.play.bind(this)

		} else if (s == 'order') { //排行榜页面
			this.start.hide();

			
			this.dom[0] = new Dom('order', 'img', 'src:img/lt1.png;width:' + this.bli * 70 + ';height:' + this.bli * 70 + ';x:10;y:15;', { click: function () { that.restart(); } })
			this.dom[1] = new Dom('order', 'font', 'color:#FFF;font:18px 微软雅黑;valign:middle;textalign:center;x:'+this.ww/2+';y:30;',{text:'大师排行榜'})

			let kw = this.ww-20;
			let tabH = 0.17 * kw/2;
			this.dom[2] = new Dom('order', 'img', 'src:img/or1.png;width:' + kw/2 + ';height:' + tabH  + ';x:10;y:60;');
			this.dom[3] = new Dom('order', 'img', 'src:img/or2.png;width:' + kw/2 + ';height:' + 0.149 * kw/2  + ';x:'+(kw/2+10)+';y:'+(60+(tabH-0.149 * kw/2))+'60;');
			this.dom[4] = new Dom('index', 'font', 'color:#333;font:16px 微软雅黑;valign:middle;textalign:center;x:'+(this.dom[2].attr.width/2)+';y:'+(this.dom[2].attr.height/2)+';', {f:this.dom[2], text: '全国排名' });
			this.dom[5] = new Dom('index', 'font', 'color:#333;font:16px 微软雅黑;valign:middle;textalign:center;x:'+(this.dom[3].attr.width/2)+';y:'+(this.dom[3].attr.height/2)+';', {f:this.dom[3], text: '好友排名' });

			for (var i=0; i<=20; i++){			
				this.dom[6] = new Dom('index', 'div', 'background:#FDF5DB;border:#F9E08A;width:'+kw+';height:'+this.wh*0.7+';x:10;y:' + (this.dom[2].attr.x+this.dom[2].attr.height) + ';');

			}
p(this.dom[6]); 
            canvas.removeEventListener('touchstart', this.touchHandler);
            this.hasEventBind = false;
            //this.index();
            this.bindLoop = this.order.bind(this);

        } else { //index
			this.start.show();
            this.tp = 100; //顶部
            this.bk = 40; //边框
            this.kh = this.wh / 2 - this.bk;
            this.cuDH = this.tp + this.kh + 10;
            that.arO = that.indArO;
            that.nX = that.nIX;
            that.nY = that.nIY;
            that.posXY(that.nX, that.nY, (this.wh / 2 - this.bk));
            this.dom.logo = new Dom('index', 'img', 'src:img/logo.png;width:' + (178 * this.ww / 420) + ';height:' + (42 * this.ww / 420) + ';x:' + ((this.ww - (178 * this.ww / 420)) / 2) + ';y:55;');
            this.dom.guiz = new Dom('index', 'img', 'src:img/guiz.png;width:40;height:20;x:20;y:67;', { click: function () { that.ts_guiz();}});
            this.dom.start = new Dom('index', 'img', 'src:img/start.png;width:250;height:51;x:' + ((this.ww - 250) / 2) + ';y:' + this.cuDH + ';');
            this.cuDH += 51 + 10
            this.dom.fx = new Dom('index', 'img', 'src:img/fxt.png;width:250;height:48;x:' + ((this.ww - 250) / 2) + ';y:' + this.cuDH + ';', { click: function () { that.fx() } })
            this.cuDH += 60;
            this.btm_btn(this.cuDH);
            this.dom.muxi = new Dom('index', 'img', 'src:img/sy_' + (this.syin ? 'on' : 'off') + '.png;width:' + 70 * this.bli + ';height:' + 70 * this.bli + ';x:20;y:15;', { click: function () { if (that.syin) { that.syin = false; that.dom.muxi.sSrc('img/sy_off.png'); } else { that.syin = true; that.dom.muxi.sSrc('img/sy_on.png');} }});
            this.dom.jbbg = new Dom('index', 'img', 'src:img/jbix.png;width:' + 182 * this.bli + ';height:' + 70 * this.bli + ';x:' + (70 * this.bli + 30) +';y:15;');
            this.dom.jbs = new Dom('index', 'font', 'color:#FFF30E;font:16px sans-serif;valign:middle;textalign:center;x:' + (this.dom.jbbg.attr.x + 70 * this.bli + (182 * this.bli - 70 * this.bli) / 2) + ';y:' + (this.dom.jbbg.attr.y+ 2 + 70 * this.bli/2)+';', { text: '23' })

            canvas.removeEventListener('touchstart', this.touchHandler);
            this.hasEventBind = false;
            //this.index();
            this.bindLoop = this.index.bind(this);
        }
		this.iniDoms();
        // 清除上一局的动画 
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }


	ts_gg(){ //过关提示
		let that = this;
		let btww = Math.sqrt(this.ww*this.ww+this.wh*this.wh)
		this.dom['altBG1'] = new Dom('allPage', 'img', 'class:gguan;src:img/bjgang.png;z:1;width:' + btww + ';height:' + btww + ';x:' + (this.ww - btww) / 2 + ';y:'+ (this.wh-btww)/2+';', { click: function () { p('点了对话背景') } })
		let altY = ((this.wh - 400) / 2);
		this.dom['altBG2'] = new Dom('allPage', 'img', 'class:gguan;src:img/tc.png;width:320;height:340;x:' + ((this.ww - 320) / 2) + ';y:' + (altY) + ';')
		altY += 20;
		let altX = (this.ww / 2);
		p(altX);
		this.dom['f1'] = new Dom('play', 'font', 'class:gguan;color:#D9CAE6;textalign:center;font:14px 微软雅黑;x:' + altX + ';y:' + altY + ';', { text: '大师1级 通关' })

		altY += 25;
		this.dom['f2'] = new Dom('play', 'font', 'class:gguan;color:#FFF;font:24px 微软雅黑;textalign:center;x:' + altX + ';y:' + altY + ';', { text: '最小步数过关' })

		altY += 25;
		this.dom['f3'] = new Dom('play', 'font', 'class:gguan;color:#D9CAE6;font:16px 微软雅黑;textalign:center;x:' + altX + ';y:' + altY + ';', { text: '第16关' })

		altY += 30;
		this.dom['lihai'] = new Dom('allPage', 'div', 'class:gguan;background:red;radius:5;border:red;font:14px 微软雅黑;color:#FFF;textAlign:center;valign:middle;width:90;height:25;x:' + (altX - 45) + ';y:' + altY + ';', { text: '太厉害了！' })

		//altY += 10;  //通大关
		this.dom['gdg'] = new Dom('allPage', 'img', 'class:gguan;src:img/zan.png;width:140;height:185;x:' + (altX - 70) + ';y:' + (altY+10) + ';')
		
		altY += 70;
		this.dom['f4'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:80px 微软雅黑;textalign:center;x:' + (altX - 30) + ';y:' + altY + ';', { text: '6' })
		this.dom['f5'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:30px 微软雅黑;textalign:center;x:' + (altX + 30) + ';y:' + (altY+15) + ';', { text: '步' })

		altY += 50;
		this.dom['f6'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:14px 微软雅黑;textAlign:center;width:250;height:25;x:' + altX + ';y:' + altY + ';', { text: '用时　　　　超过全国　　　　玩家' })
		this.dom['f6_2'] = new Dom('allPage', 'font', 'class:gguan;color:#F60;font:14px 微软雅黑;textAlign:center;width:250;height:25;x:' + altX + ';y:' + altY + ';', { text: '0秒　　　　　0%' })

		altY += 20;
		this.dom['f7'] = new Dom('allPage', 'div', 'class:gguan;color:#804727;background:#FDF5DB;border:#F9E08A;radius:5;font:14px 微软雅黑;textAlign:center;valign:middle;width:300;height:88;x:' + (altX - 150) + ';y:' + altY + ';', {})

		altY += 8;
		let pyi = 85;
		this.dom['r1_1'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX - pyi) + ';y:' + altY + ';', { text: '1' })
		this.dom['r1_t'] = new Dom('allPage', 'img', 'class:gguan;src:img/1.gif;width:36;height:36;x:' + (altX - pyi - 18) + ';y:' + (altY + 8) + ';')
		this.dom['r1_2'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX - pyi) + ';y:' + (altY + 55) + ';', { text: '姓名' })
		this.dom['r1_3'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX - pyi) + ';y:' + (altY + 70) + ';', { text: '4步' })

		this.dom['r2_1'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX) + ';y:' + altY + ';', { text: '2' })
		this.dom['r2_t'] = new Dom('allPage', 'img', 'class:gguan;src:img/1.gif;width:36;height:36;x:' + (altX - 18) + ';y:' + (altY + 8) + ';')
		this.dom['r2_2'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX) + ';y:' + (altY + 55) + ';', { text: '姓名' })
		this.dom['r2_3'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX) + ';y:' + (altY + 70) + ';', { text: '4步' })

		this.dom['r3_1'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX + pyi) + ';y:' + altY + ';', { text: '3' })
		this.dom['r3_t'] = new Dom('allPage', 'img', 'class:gguan;src:img/1.gif;width:36;height:36;x:' + (altX + pyi - 18) + ';y:' + (altY + 8) + ';')
		this.dom['r3_2'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX + pyi) + ';y:' + (altY + 55) + ';', { text: '姓名' })
		this.dom['r3_3'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (altX + pyi) + ';y:' + (altY + 70) + ';', { text: '4步' })

		this.dom['fxbtn'] = new Dom('allPage', 'img', 'class:gguan;src:img/fxbtn.png;width:140;height:47;x:' + ((this.ww - 320) / 2 + 10) + ';y:' + (altY + 100) + ';', { click: function () { that.fx() } })
		this.dom['xxbtn'] = new Dom('allPage', 'img', 'class:gguan;src:img/xxbtn.png;width:140;height:47;x:' + ((this.ww - 320) / 2 + 10) + ';y:' + (altY + 100) + ';', { click: function () { that.del('gguan'); that.restart('level') } })
		this.dom['nxbtn'] = new Dom('allPage', 'img', 'class:gguan;src:img/nxbtn.png;width:140;height:47;x:' + (altX + 10) + ';y:' + (altY + 100) + ';', { click: function () { that.restart('play', that.NextGG[0], that.NextGG[1], that.NextGG[2])}});
		that.altGGHide();
		this.iniDoms();
	}

	ts_qouz(usN,usP){//求助提示
        if (this.bTS){
            this.gDDN = false;
            wx.showToast({ title: '已经有提示'});
            return;
        }
		let that = this;
		this.dom.tsbg = new Dom('index', 'img', 'class:qouz;src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { } });
		let ddw = this.ww - 100;
		let ddh = ddw * 1.172;
		this.dom.ddai = new Dom('index', 'img', 'class:qouz;src:img/ddai.png;width:' + ddw + ';height:' + ddh + ';x:' + (this.ww - ddw) / 2 + ';y:' + (this.wh - ddh) / 2 + ';', { click: function () { } });
		this.dom.ddz = new Dom('index', 'img', 'class:qouz;src:img/zzz.png;z:50;width:' + ddw * 0.228 + ';height:' + ddw * 0.228 + ';x:' + (this.ww - ddw * 0.228) / 2 + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.03) + ';', { click: function () { } });
		this.dom.ddtx = new Dom('index', 'img', 'class:qouz;src:img/123.jpg;yuan:' + (ddw * 0.114) + ';width:' + ddw * 0.228 + ';height:' + ddw * 0.228 + ';x:' + (this.ww - ddw * 0.228) / 2 + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.03) + ';', { click: function () { } });
		this.dom.ddwz = new Dom('index', 'font', 'class:qouz;color:#7B459D;font:40px sans-serif;valign:middle;textalign:center;x:' + (this.ww / 2) + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.15) + ';', { text: '' })
		this.dom.ddNA = new Dom('index', 'font', 'class:qouz;color:#FFF;font:28px sans-serif;valign:middle;textalign:center;x:' + (this.ww / 2) + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.36) + ';', { text: '' })
		this.dom.ddbtn = new Dom('index', 'img', 'class:qouz;src:img/bden.png;width:' + ddw * 0.44 + ';height:' + ddw * 0.14 + ';x:' + (this.ww - ddw * 0.44) / 2 + ';y:' + ((this.wh - ddh) / 2 + ddw * 0.93) + ';', { click: function () {that.gDDN = false;that.del('qouz'); } });
		
        this.gDDN = false;
        that.dom.ddtx.dis = false; that.dom.ddNA.dis = false;
        that.dom.tsbg.dis = false; that.dom.ddai.dis = false; that.dom.ddbtn.dis = false;
        that.dom.ddz.dis = false; that.dom.ddwz.dis = false;
        if (usN == ''){
            this.bTS = false;
            this.gDDN = true;
            this.dom.ddai.sSrc('img/ddai.png');
            this.dom.ddbtn.sSrc('img/bden.png');
            this.dom.ddtx.dis = false; this.dom.ddNA.dis = false;
            this.dom.tsbg.dis = true; this.dom.ddai.dis = true; this.dom.ddbtn.dis = true;
            this.dom.ddz.dis = true; this.dom.ddwz.dis = true;
            this.gDD(31);
        }else {
            this.gDDN = false;
            this.dom.ddai.sSrc('img/dts.png');
            this.dom.ddbtn.sSrc('img/zdao.png');
            this.dom.ddtx.sSrc(usP);
            this.dom.ddNA.attr.text = usN;
            this.dom.ddtx.dis = true; this.dom.ddNA.dis = true;
            this.dom.tsbg.dis = true; this.dom.ddai.dis = true; this.dom.ddbtn.dis = true;
            this.dom.ddz.dis = false; this.dom.ddwz.dis = false;
            this.bTS = true;
        }
		this.iniDoms();
	}
    iniDoms(){
        this.doms = [];
        for (var domk in this.dom) {
            this.doms[this.doms.length] = domk;
        }
	}
    gDD(n) { //求助好友
        if (this.gDDN) {
            var that = this;
            n = n - 1;
            this.dom.ddwz.attr.text = n;
            if (this.dom.ddwz.attr.text <= 0) {
                this.del('qouz'); 
                this.gDDN = false;
                wx.showToast({ title: '没有获得帮助', image: 'img/tips.png' });
                return;
            }
            if (n % 2 == 0){
                this.post({act:'bDD',n:n,qz:this.qzTime},function(t){
                    if (null !== t.qz && undefined !== t.qz.bname && t.qz.bname!=''){
                        that.ts_qouz(t.qz.bname, t.qz.bpic);
                    }
                });
            }
            setTimeout(function () { that.gDD(n) }, 1000);
        }
    }
    fx(i) {
        let that = this;
        that.qzTime = this.now();

        p(that.config.CY_fxCS == '' ? 'qz=' + that.qzTime : that.config.CY_fxCS + '&qz=' + that.qzTime);
        wx.shareAppMessage({
            title: that.config.CY_fxTxt[0],
            imageUrl: that.config.CY_fxImg,
            query: that.config.CY_fxCS == '' ? 'qz=' + that.qzTime : that.config.CY_fxCS+'&qz='+that.qzTime,
            withShareTicket: true,
            success: function (t) {
                that.ts_qouz('', '');
                //o.getQunRankInfo(t.shareTickets[0]), r.onClose() 
                if (i == 1) {
                    //that.ddShow('', '');
                    //that.fxTS(t);
                }
            }
            , fail: function (t) {
                console.log("match share failed >>>>>>>>>>")
            }
        });
		if (window.navigator.platform == 'devtools'){
			that.ts_qouz('','');
		}		
        p('进了 fx');
        
    }
    altGG(bu,s) {
		this.ts_gg();
        bu = parseInt(bu)
        let xbu = this.arO.length;
        let miao = (((xbu * 100) / (bu * 100+s))*100).toFixed(2);
        
        this.dom['f3'].attr.text = '第' + this.ThisGK + '关';
        this.dom['f4'].attr.text = bu;
        this.dom['f6_2'].attr.text = s.toFixed(1) + '秒　　　　　' + miao+'%';

        let ar = 'altBG1,altBG2,f1,f2,f3,lihai,f4,f5,f6,f6_2,f7,fxbtn,xxbtn,nxbtn,gdg'.split(',');
        for (var i = 0; i < ar.length; i++) { 
            this.dom[ar[i]].dis = true;
        }

        ar = 'r1_1,r1_t,r1_2,r1_3,r2_1,r2_t,r2_2,r2_3,r3_1,r3_t,r3_2,r3_3'.split(',');
        for (var i = 0; i < ar.length; i++) {
            this.dom[ar[i]].dis = false;
        }

        if (this.nX == this.NextGG[0] && this.nY == this.NextGG[1]) {    //小关
            this.dom['f1'].attr.text = '大师' + this.ThisGG + '级 过关';
            ar = 'gdg,xxbtn'.split(',');
            for (var i = 0; i < ar.length; i++) {
                this.dom[ar[i]].dis = false;
            }
            this.dom['f2'].attr.text = (bu <= xbu ? '最小步数过关' : '恭喜过关');

            this.dom['f6_2'].attr.y = this.dom['f4'].attr.y+50;
            this.dom['f6'].attr.y = this.dom['f4'].attr.y + 50;


            let ph = [];
            let ord = false;
            if (this.ThisPH.length > 0) {
                for (var i = 0; i < this.ThisPH.length; i++) {
                    if (!ord && ((bu == this.ThisPH[i]['bu'] && s * 100 < this.ThisPH[i]['sec']) || bu < this.ThisPH[i]['bu'])) {
                        ord = true;
                        ph[ph.length] = { "bu": bu, "name": this.us.us_name, "pic": this.us.us_pic }
                        ph[ph.length] = this.ThisPH[i];
                    } else {
                        ph[ph.length] = this.ThisPH[i]
                    }
                }
            }

            if (!ord && ph.length < 3) {
                ph[ph.length] = { "bu": bu, "name": this.us.us_name, "pic": this.us.us_pic }
            }

            if (ph.length == 1) {
                this.dom['r2_1'].dis = true;
                this.dom['r2_t'].dis = true;
                this.dom['r2_2'].dis = true;
                this.dom['r2_3'].dis = true;

                this.dom['r2_1'].attr.text = '1';
                this.dom['r2_t'].sSrc(ph[0]['pic']);
                this.dom['r2_2'].attr.text = ph[0]['name'];
                this.dom['r2_3'].attr.text = ph[0]['bu'] + '步';
            } else if (ph.length > 1) {
                for (var k = 1; k <= ph.length; k++) {
                    this.dom['r' + k + '_1'].dis = true;
                    this.dom['r' + k + '_t'].dis = true;
                    this.dom['r' + k + '_2'].dis = true;
                    this.dom['r' + k + '_3'].dis = true;

                    this.dom['r' + k + '_1'].attr.text = k;
                    this.dom['r' + k + '_t'].sSrc(ph[k - 1]['pic']);
                    this.dom['r' + k + '_2'].attr.text = ph[k - 1]['name'];
                    this.dom['r' + k + '_3'].attr.text = ph[k - 1]['bu'] + '步';
                    if (k >= 3) {
                        break
                    }
                }
            }


        }else {
            this.dom['f1'].attr.text = '大师' + this.ThisGG + '级 通关';
            ar = 'f4,f5,f7,fxbtn'.split(',');
            for (var i = 0; i < ar.length; i++) {
                this.dom[ar[i]].dis = false;
            }
            this.dom['f2'].attr.text = '终结所有关卡';

            this.dom['f6_2'].attr.y = this.dom['gdg'].attr.y + 200;
            this.dom['f6'].attr.y = this.dom['gdg'].attr.y + 200;

        }
        this.post({ act: 'upGK', h: this.nX, l: this.nY, gk: this.ThisGK,bu:bu,s:s }, function (t) {});
    }
    altGGHide(){
        let ar = 'altBG1,altBG2,f1,f2,f3,lihai,f4,f5,f6,f6_2,f7,r1_1,r1_t,r1_2,r1_3,r2_1,r2_t,r2_2,r2_3,r3_1,r3_t,r3_2,r3_3,fxbtn,xxbtn,nxbtn,gdg'.split(',');
        for(var i=0;i<ar.length;i++){
            this.dom[ar[i]].dis = false;
        }
    }
    alt(tit, txt, ar, okBG) {
        this.HLine = true;
        this.dom['altTit'].attr.text = tit;
        this.dom['altTxt'].attr.text = txt;

        this.dom['altK'].dis = true;
        this.dom['altBG'].dis = true;
        this.dom['altTxt'].dis = true;
        this.dom['altTit'].dis = true;
        this.dom['OK'].dis = true;
        this.dom['Can'].dis = true;
    }
    altHide() {
        this.dom['altK'].dis = false;
        this.dom['altBG'].dis = false;
        this.dom['altTxt'].dis = false;
        this.dom['altTit'].dis = false;
        this.dom['OK'].dis = false;
        this.dom['Can'].dis = false;
    }

    getConfig() {
		let that = this;

		that.restart('order');
		return
        
        this.post({ act: 'config' }, function (a) {
            that.config = a.config;
            if (a.line != undefined) {
                that.nX = a.line.h; that.nY = a.line.l;
                that.nIX = a.line.h; that.nIY = a.line.l;

                that.indArO = a.line.data;
                that.arO = a.line.data;
                that.posXY(that.nX, that.nY, (that.wh / 2 - that.bk));
                //p(" that.config = ");
                //p(a.config)
                that.restart();
                for (let g in a.gka) {
                    that.gk[g] = a.gka[g];
                }
            }
        })
    }


    order() {
        this.iniBG();

        for (var dm in this.dom) {
            this.dom[dm].w();
        }
        if (!this.hasEventBind) {
            this.hasEventBind = true
            this.touchHandler = this.ckClick.bind(this)
            canvas.addEventListener('touchstart', this.touchHandler)
        }
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }
    index() {
        this.iniBG();
        this.indexBG(this.nX, this.nY);
        for (var dm in this.dom) {
            this.dom[dm].w();
        }
        if (!this.hasEventBind) {
            this.hasEventBind = true
            this.touchHandler = this.ckClick.bind(this)
            canvas.addEventListener('touchstart', this.touchHandler)
        }
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }
    level() {
        this.iniBG();
        for (var dm in this.dom) {
            this.dom[dm].w();
        }

        if (!this.hasEventBind) {
            this.hasEventBind = true
            this.touchHandler = this.ckClick.bind(this)
            canvas.addEventListener('touchstart', this.touchHandler)
        }
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }
    play() {
        this.iniBG();
        this.playBG(this.nX, this.nY);

        this.playDraw();

        for (var dm in this.dom) {
            this.dom[dm].w();
        }


        if (!this.hasEventBind) {
            this.hasEventBind = true
            this.touchHandler = this.playClick.bind(this);
            this.touchMVHandler = this.playMove.bind(this);
            canvas.addEventListener('touchmove', this.touchMVHandler);
            canvas.addEventListener('touchstart', this.touchHandler);
        }
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }
    tiShi() {
        var that = this;
        if (that.bTS) {
            wx.showToast({ title: '已有提示' });
            return;
        }
        if (this.us.jbi >= 50) {
            that.post({ act: 'kbi' }, function (d) {
                if (undefined != d.jbi) {
                    that.us.jbi = d.jbi;
                    that.dom[4].attr.text = '金币：' + d.jbi;
                }
                if (d.code == 200) {
                    wx.showToast({ title: '成功扣50金币' });
                    that.bTS = true;
                } else {
                    wx.showToast({ title: '金币不足', image: 'img/tips.png' });
                }
            })
        } else {
            wx.showToast({ title: '金币不足', image: 'img/tips.png' });
        }
		/*wx.showModal({
			title:'金币不足',
			content:'金币不足，分享赚金币',
			confirmText:'立即分享',
			success:function(t){
				if(t.confirm){
					that.fx();
				}
			}
		})*/
    }
    iniBG(){
        ctx.clearRect(0, 0, this.ww, this.wh);
        ctx.fillStyle = '#7B459D';
        ctx.fillRect(0, 0, this.ww, this.wh);
        ctx.closePath();
        ctx.restore();
        for (var dm in this.dombg) {
            this.dombg[dm].w();
        }
    }

    playDraw() {
        ctx.globalAlpha = 1;
        ctx.save();

        if (this.bTS) {
            ctx.globalAlpha = 0.2;
            for (var i = 0; i < this.arO.length; i++) {
                ctx.beginPath();
                ctx.strokeStyle = this.aColor[i];
                ctx.lineWidth = 15;
                for (var j = 0; j < this.arO[i].length; j++) {
                    var x1 = this.arO[i][j][0];
                    var y1 = this.arO[i][j][1];
                    if (j <= 0) {
                        ctx.moveTo(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy']);
                    } else {
                        ctx.lineTo(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy']);
                    }
                }
                //ctx.closePath();
                ctx.stroke();

            }
            ctx.strokeStyle = "#B59AC5";
        }

        //ctx.beginPath();
        for (var i = 0; i < this.PlayArO.length; i++) {

            if (this.PlayArO[i][0][3] < 0) {
                ctx.globalAlpha = 0.4;
                ctx.lineWidth = 5;
            } else {
                ctx.globalAlpha = 1;
                ctx.lineWidth = 8;
            }
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.aColor[this.PlayArO[i][0][2]];

            for (var j = 0; j < this.PlayArO[i].length; j++) {
                var x1 = this.PlayArO[i][j][0];
                var y1 = this.PlayArO[i][j][1];
                if (j <= 0) {
                    ctx.moveTo(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy']);
                } else {
                    ctx.lineTo(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy']);
                }
            }
            //ctx.closePath();
            ctx.stroke();
        }

        for (var i = 0; i < this.PlayArO.length; i++) {
            if (this.PlayArO[i].length > 0) {
                var x1 = this.PlayArO[i][0][0];
                var y1 = this.PlayArO[i][0][1];
                this.d(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy'], this.aPos[x1][y1]['d1'], this.aColor[this.PlayArO[i][0][2]]);
            }
        }
        ctx.globalAlpha = 1;

    }
    playBG(x, y) {
        let kw = this.ww - this.bk;
        let kh = this.wh * 0.6 - this.bk;

        ctx.save();
        ctx.beginPath();
        //ctx.globalAlpha = .5;

        ctx.strokeStyle = "#9870B1";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        /*ctx.lineCap="butt|round|square";*/
        ctx.lineWidth = 2;
        ctx.moveTo(this.bk, this.tp);
        ctx.lineTo(kw, this.tp);
        ctx.lineTo(kw, this.tp + kh);
        ctx.lineTo(this.bk, this.tp + kh);

        let xx = (this.ww - 2 * this.bk) / y;
        for (var i = 1; i < y; i++) {
            ctx.closePath();
            ctx.moveTo(this.bk + xx * i, this.tp);
            ctx.lineTo(this.bk + xx * i, this.tp + kh);
        }
        let yy = kh / x;
        for (var i = 1; i < x; i++) {
            ctx.closePath();
            //p(tp + bk + yy * i);
            ctx.moveTo(this.bk, this.tp + yy * i);
            ctx.lineTo(kw, this.tp + yy * i);
        }
        ctx.stroke();

        if (this.shanK) {
            ctx.fillStyle = this.now() % 2 == 0 ? '#FF0000' : '#FF6600';
            for (var a1 in this.aPos) {
                for (var a2 in this.aPos[a1]) {
                    if (this.aPos[a1][a2]['se'] == 0) {
                        ctx.beginPath();

                        if (this.aPos[a1][a2]['t'] == 1) {
                            //ctx.globalAlpha = 0.4;
                            //ctx.fillStyle = "#FFFFFF";
                        } else {
                            //ctx.globalAlpha = 0.1;
                            //ctx.fillStyle = "#FF0000";
                        }

                        ctx.globalAlpha = 0.2;

                        ctx.fillRect(this.aPos[a1][a2]['x'], this.aPos[a1][a2]['y'], this.aPos[a1][a2]['width'], this.aPos[a1][a2]['height']);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
        }
        //ctx.globalAlpha = 1;
    }
    indexBG(x, y) {
        let kw = this.ww - this.bk;
        let kh = this.wh / 2 - this.bk;

        ctx.beginPath();
        //ctx.globalAlpha = .5;

        ctx.strokeStyle = "#9870B1";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        /*ctx.lineCap="butt|round|square";*/
        ctx.lineWidth = 2;
        ctx.moveTo(this.bk, this.tp);
        ctx.lineTo(kw, this.tp);
        ctx.lineTo(kw, this.tp + kh);
        ctx.lineTo(this.bk, this.tp + kh);

        let xx = (this.ww - 2 * this.bk) / y;
        for (var i = 1; i < y; i++) {
            ctx.closePath();
            ctx.moveTo(this.bk + xx * i, this.tp);
            ctx.lineTo(this.bk + xx * i, this.tp + this.kh);
        }
        let yy = kh / x;
        for (var i = 1; i < x; i++) {
            ctx.closePath();
            //p(tp + bk + yy * i);
            ctx.moveTo(this.bk, this.tp + yy * i);
            ctx.lineTo(kw, this.tp + yy * i);
        }
        ctx.stroke();

        ctx.strokeStyle = "#B59AC5";
        //ctx.globalAlpha = 1;
        for (var i = 0; i < this.arO.length; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.aColor[i];
            ctx.lineWidth = 5;
            for (var j = 0; j < this.arO[i].length; j++) {
                var x1 = this.arO[i][j][0];
                var y1 = this.arO[i][j][1];
                if (j <= 0) {
                    ctx.moveTo(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy']);
                } else {
                    ctx.lineTo(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy']);
                }
            }
            ctx.stroke();
        }
        for (var i = 0; i < this.arO.length; i++) {
            if (this.arO[i].length > 0) {
                var x1 = this.arO[i][0][0];
                var y1 = this.arO[i][0][1];
                this.d(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy'], this.aPos[x1][y1]['d2'], this.aColor[i]);
                if (this.arO[i].length > 1) {
                    var x2 = this.arO[i][this.arO[i].length - 1][0];
                    var y2 = this.arO[i][this.arO[i].length - 1][1];
                    this.d(this.aPos[x2][y2]['ox'], this.aPos[x2][y2]['oy'], this.aPos[x2][y2]['d1'], this.aColor[i]);
                }
            }
        }
    }

    post(q) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function () { };
        q['phpsessid'] = wx.getStorageSync("phpsessid");
        wx.request({
            url: this.sUrl, data: q, method: "POST", header: { "content-type": "application/x-www-form-urlencoded" },
            success: function (a) {
                if (a.statusCode == 200) {
                    n(a.data);
                    if (a.data.phpsessid != undefined) {
                        wx.setStorageSync("phpsessid", a.data.phpsessid);
                    }
                } else {
                    p('request error url:' + this.sUrl + ' code:' + a.statusCode)
                }
            },
            fail: function (e) { p('request error' + e); }
        })
    }
    posXY(x, y, kh) {
        let xx = ((this.ww - 2 * this.bk) / y);
        let yy = (kh / x);
        this.Fx = (xx);
        this.Fy = (yy);
        this.Fr = ((xx > yy ? xx : yy) / 2);
        var pos = {}
        for (var j = 0; j < x; j++) {
            var posx = {}
            for (var i = 0; i < y; i++) {
                //if ((i + 1) % 2 != 0 || (j + 1) % 2 != 0) {
                let x1 = (this.bk + (i + 1) * xx);
                let y1 = (this.tp + (j + 1) * (yy));
                posx[i] = { 'x': parseInt(x1 - xx), 'y': parseInt(y1 - yy), 'width': xx, 'height': yy, 'd1': xx / 6, 'd2': xx / 10, 'line': xx / 12, 'o': 0, 'ox': x1 - xx / 2, 'oy': y1 - yy / 2, 't': 0 };
                //}
            }
            pos[j] = posx;
        }
        this.aPos = pos;
    }
    d(x, y, r, color) {
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#FFF';
        ctx.arc(x, y, r + 3, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
        ctx.stroke();
    }
    fxTS(t) {
        p('分享后：');
        p(t)
        if (undefined === t.shareTickets){
            wx.showToast({ title: '请分享到群', image: 'img/tips.png'});
        }else {
            let that = this;
            wx.getShareInfo({
                shareTicket: t.shareTickets[0],
                success: function (t) {
                    p(t);
                    //that.bTS = true;
                    that.post({ act: 'fxTS', encryptedData: t.encryptedData, iv: t.iv}, function (d) {
                        p(d);
                        if (d.code == 200) {
                            that.bTS = true;
                        } else {
                            wx.showToast({ title: d.mess, image: 'img/tips.png' });
                        }
                    });
                }
            })
        }
    }
    ckClick(e) {
        e.preventDefault()
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        for (var i = this.doms.length - 1; i >= 0; i--) {
            if (this.dom[this.doms[i]].dis && this.dom[this.doms[i]].attr.click) {
                var dom1 = this.dom[this.doms[i]];
                var kz = 0;
                if (undefined != dom1.attr.r) {
                    var d = { x: dom1.attr.x, y: dom1.attr.y, r: dom1.attr.r, width: 0, height: 0 }
                } else {

                    var d = { x: dom1.attr.x, y: dom1.attr.y, width: dom1.attr.width, height: dom1.attr.height }
                }
                if (undefined != dom1.attr.f) {
                    d.x = dom1.attr.f.attr.x + d.x;
                    d.y = dom1.attr.f.attr.y + d.y
                }
                if (undefined != dom1.attr.line && dom1.attr.line > 1) {
                    kz = parseInt(dom1.attr.line / 2);
                }
                if (this.inQ(x, y, d, kz)) {
                    if (d.height != this.wh) {
                        this.music.ck(this.syin);
                    }

                    p('点了 ' + this.doms[i]);
                    this.dom[this.doms[i]].attr.click(this.dom[this.doms[i]]);
                    break;
                }
            }
        }
    }
    playMove(e) {
        e.preventDefault()
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        for (var a1 in this.aPos) {
            for (var a2 in this.aPos[a1]) {
                if (this.inQ(x, y, this.aPos[a1][a2], 0)) {
                    this.addPos(a1, a2, 2);
                }
            }
        }
    }
    playClick(e) {
        e.preventDefault()
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;

        let ck = false;
        for (var i = this.doms.length - 1; i >= 0; i--) {
            if (this.dom[this.doms[i]].dis && this.dom[this.doms[i]].attr.click) {
                var dom1 = this.dom[this.doms[i]];
                var kz = 0;
                if (undefined != dom1.attr.r) {
                    var d = { x: dom1.attr.x, y: dom1.attr.y, r: dom1.attr.r }
                } else {

                    var d = { x: dom1.attr.x, y: dom1.attr.y, width: dom1.attr.width, height: dom1.attr.height }
                }
                if (undefined != dom1.attr.f) {
                    d.x = dom1.attr.f.attr.x + d.x;
                    d.y = dom1.attr.f.attr.y + d.y
                }
                if (undefined != dom1.attr.line && dom1.attr.line > 1) {
                    kz = parseInt(dom1.attr.line / 2);
                }
                if (this.inQ(x, y, d, kz)) {
                    ck = true;
                    this.music.ck(this.syin);
                    p('点了 ' + this.doms[i]);
                    this.dom[this.doms[i]].attr.click(this.dom[this.doms[i]]);
                    break;
                }
            }
        }

        if (!ck) {
            for (var a1 in this.aPos) {
                for (var a2 in this.aPos[a1]) {
                    if (this.inQ(x, y, this.aPos[a1][a2], 0)) {
                        this.addPos(a1, a2, 1);
                    }
                }
            }
        }
    }

    addPos(x1, y1, t) {		//t=1点，=2划过
        if (this.HLine) {
            return;
        }
        if (t == 1) {
            this.cuO = -1;
        } else if (t == 2 && this.cuO < 0) {
            return;
        }
        this.shanK = false;
        var has = false;
        var con = false;
        for (var i = 0; i < this.PlayArO.length; i++) {
            var ar = [];
            for (var j = 0; j < this.PlayArO[i].length; j++) {
                if (this.PlayArO[i][j][0] == x1 && this.PlayArO[i][j][1] == y1) {
                    if (t == 2 && j == 0 && i != this.cuO && this.PlayArO[i][0][2] != this.PlayArO[this.cuO][0][2]) {
                        this.cuO = -1;
                        return;
                    }
                    p('has + ' + j);
                    has = true;
                }
                if (has) {
                    if (this.cuO == -1) {
                        this.cuO = i;
                        if (j == 0 && this.PlayArO[this.cuO][0][3] >= 0) {
                            this.PlayArO[this.PlayArO[this.cuO][0][3]][0][3] = -1;
                            this.PlayArO[this.PlayArO[this.cuO][0][3]] = [this.PlayArO[this.PlayArO[this.cuO][0][3]][0],];
                            this.PlayArO[this.cuO][0][3] = -1;
                            this.PlayArO[this.cuO] = [this.PlayArO[this.cuO][0],];
                        }
                    }
                    if (this.PlayArO[this.cuO][0][3] >= 0) {
                        this.PlayArO[this.PlayArO[this.cuO][0][3]][0][3] = -1;
                        this.PlayArO[this.cuO][0][3] = -1;
                    }


                    if (t == 1 || (t == 2 && this.cuO == i)) {
                        ar[j] = this.PlayArO[i][j];
                    } else {
                        if (i != this.cuO && this.PlayArO[i][0][2] == this.PlayArO[this.cuO][0][2]) {
                            if (j == 0 && this.PlayArO[this.cuO][0][3] <= 0) {
                                this.PlayArO[this.cuO][0][3] = i;
                                this.PlayArO[i][0][3] = this.cuO;
                                con = true;
                                this.music.con(this.syin);

                            } else if (j > 0 && this.PlayArO[this.cuO][0][3] >= 0) {
                                this.PlayArO[this.cuO][0][3] = -1;
                                this.PlayArO[i][0][3] = -1;
                                con = false;
                            }

                            if (j == 0) {
                                ar[j] = this.PlayArO[i][j];
                            }
                        } else if (j == 0) {
                            ar[j] = this.PlayArO[i][j];
                        }
                    }
                    this.PlayArO[i] = ar;
                    break;
                } else {
                    ar[j] = this.PlayArO[i][j];
                }
            }
            if (has) {
                break;
            }
        }

        if (!has && t == 2) { //新点
            //if (this.PlayArO[this.cuO].length > 0) {
            var x2 = this.PlayArO[this.cuO][this.PlayArO[this.cuO].length - 1][0];
            var y2 = this.PlayArO[this.cuO][this.PlayArO[this.cuO].length - 1][1];
            if ((x1 == x2 || y1 == y2) && (Math.abs(x1 - x2) == 0 && Math.abs(y1 - y2) <= 1) || (Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) == 0)) {
                this.PlayArO[this.cuO][this.PlayArO[this.cuO].length] = [x1, y1];
            }
            //}
            //p('move'+this.cuO);
            //p(this.PlayArO);
            //p(' 共 ' + arO.length + ' 条线，点当前 ' + this.cuO + ' 线 ');

            this.ckLineOK();
        } else if (t == 2 && undefined != this.PlayArO[this.cuO]) {
            var x2 = this.PlayArO[this.cuO][this.PlayArO[this.cuO].length - 1][0];
            var y2 = this.PlayArO[this.cuO][this.PlayArO[this.cuO].length - 1][1];
            //p(x1 + ' == '+ x2 +' && '+ y1+' == '+y2);
            if (!(x1 == x2 && y1 == y2) && ((Math.abs(x1 - x2) == 0 && Math.abs(y1 - y2) <= 1) || (Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) == 0))) {		//(x1==x2 || y1 == y2) 

                //p(this.PlayArO[this.cuO].length)
                this.PlayArO[this.cuO][this.PlayArO[this.cuO].length] = [x1, y1];
            }
            //p(this.PlayArO);
            //p(' 共 ' + this.PlayArO.length + ' 条线，划当前 ' + this.cuO + ' 线 ');


        }

        if (this.cuO >= 0 && this.OcuO != this.cuO) {
            this.OcuO = this.cuO;
            this.buShu += 1;
            this.dom[3].attr.text = '步数：' + this.buShu;
        }


        if (con) {
            this.ckLineOK();
            this.cuO = -1;
        }
    }

    ckLineOK() {
        this.shanK = false;
        var that = this;
        var xx = {}
        for (var a1 in this.PlayArO) {
            if (this.PlayArO[a1][0][3] < 0) {
                //p('还有未选空格1');
                return;
            }
            for (var a2 in this.PlayArO[a1]) {
                xx[this.PlayArO[a1][a2][0] + '_' + this.PlayArO[a1][a2][1]] = 1;
            }
        }
        let ckWan = true;
        for (var a1 in this.aPos) {
            for (var a2 in this.aPos[a1]) {
                if (undefined === xx[a1 + '_' + a2]) {
                    ckWan = false;
                    this.aPos[a1][a2]['se'] = 0;
                } else {
                    this.aPos[a1][a2]['se'] = 1;
                }
            }
        }

        if (!ckWan) {
            this.shanK = true;
            //p('还有未选空格2');
        } else {
            this.HLine = true;
            this.post({ act: 'gg', h: this.nX, l: this.nY }, function (d) {
                if (d.data != undefined) {
                    if (d.config) {
                        for (var k in d.config) {
                            that.config[k] = d.config[k];
                        }
                    }
                    that.us.data = d.data;
                }
            }, 'json');

            //(m,bu,xbu,s) { 
            this.altGG(this.buShu, ((this.now_m() - this.MicroT) / 1000) );
            //this.alt('恭喜过关', '用了' + this.buShu + '步，耗时' + ((this.now_m() - this.MicroT) / 1000) + '秒\n赢得此局胜利，继续下一关！')
            p('完整');
        }
    }

	buildStartBtn(){
		let that = this;
		this.start = wx.createUserInfoButton({
            type: 'image',
            text: '获取用户信息',
            image: 'img/start.png',
            style: {
                left: ((this.ww - 250) / 2),
                top: this.cuDH,
                width: 250,
                height: 51,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });

        this.start.onTap((e) => {
            if (that.us.data!=undefined && that.config.uid > 0){
                that.music.con(that.syin);
                that.restart('level');
            }else{
                if (e.errMsg == 'getUserInfo:ok') {
                    p('开始按扭');
                    p(e);
                    wx.login({
                        success: function (t) {
                            that.post({
                                act: 'usLogin', fid: that.fid, qzt: that.qzt,scene:that.scene, data: e.rawData, 
                                code: t.code, iv: e.iv, encryptedData: e.encryptedData }, 

                                function (d) {
                                if (d.code == 200) {
                                    if (d.config) {
                                        for (var k in d.config) {
                                            that.config[k] = d.config[k];
                                        }
                                    }
                                    that.us = d;
                                    that.music.con(that.syin);
                                    that.restart('level');
                                }
                            }, 'json');
                        }
                    });
                }
            }
        })
	}



    /**********************************常用函数******************************/
    rand(n1,n2){
        return Math.floor(Math.random() * (n2-n1) + n1)
    }
    now(n) {  //当前秒数
        if (undefined === n || n <= 0) {
            var d = new Date;
        } else {
            var d = new Date(n * 1000);
        }
        return Math.ceil(d.getTime() / 1000);
    }
    now_m(n) {  //当前微秒
        if (undefined === n || n <= 0) {
            var d = new Date;
        } else {
            var d = new Date(n * 1000);
        }
        return d.getTime();
    }
    date(s, n) {
        if (undefined === n || s <= 0) {
            const date = new Date;
        } else {
            const date = new Date(n * 1000);
        }
        var str = '';
        if (undefined === s || s == '') {
            str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        } else {
            str = s.replace(/Y/, date.getFullYear());
            str = str.replace(/m/, date.getMonth() + 1);
            str = str.replace(/d/, date.getDate());
            str = str.replace(/H/, date.getHours());
            str = str.replace(/i/, date.getMinutes());
            str = str.replace(/s/, date.getSeconds());
        }
        str = str.replace(/([^\d])([\d])([^\d])/g, '$10$2$3');
        str = str.replace(/([^\d])([\d])([^\d])/g, '$10$2$3');
        str = str.replace(/([^\d])([\d])([^\d])/g, '$10$2$3');
        str = str.replace(/([^\d])([\d])$/g, '$10$2');
        return str;
    }
    inQ(x, y, q, sz) {  //sz 边框收展数值
        if (undefined == sz || null == sz) { sz = 0; }//扩展区
        if (undefined != q.r) {//半径
            q.r += sz;
            return Math.abs(q.x - x) <= q.r && Math.abs(q.y - y) <= q.r;
        } else {
            return (x >= q.x - sz && y >= q.y - sz && x <= q.x + q.width + sz && y <= q.y + q.height + sz)
        }
    }
    jgT(n) {
        nj = now() - n;
        if (nj > 86400) {
            n = date('m-d H:i', n);
        } else if (nj > 3600) {
            n = Math.floor(nj / 3600) + '小时前';
        } else if (nj > 60) {
            n = Math.floor(nj / 60) + '分钟前';
        } else {
            n = nj + '秒前';
        }
        return n;
    }

}