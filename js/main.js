import Dom     from './libs/dom'
import Music   from './libs/music'
import Mv      from './libs/mv'
import Number  from './libs/number'
import Jfen    from './libs/jfen'
import Opacity from './libs/opacity'
import Lianji  from './libs/lianji'
import Dx      from './libs/dx'
import {gAds} from './libs/ggao'

window.ctx = canvas.getContext('2d');
window.clip = false;
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
window.fontBL = window.innerWidth / 414;	//文字比例
 
/** --------------------------------------------------------------------------
 * 游戏主函数
 */
export default class Main {
    constructor() {
        let that = this;

        if (0 && window.navigator.platform == 'devtools') {
            this.sUrl = 'http://xxx/xxx.php';
        } else { 
            this.sUrl = 'https://szxxds.aslk2018.com/xxx.php'; 
        }
        this.more_appid = 'wx3df1cf2a43a6b16d';
        this.more_appph = 'pages/index/index';
        this.app_btn_ad = false;
        this.app_btn_ls = [];


		this.local = window.navigator.platform == 'devtools'
		if(this.local){
			this.adOK = false;	//底部广告
			this.vadOK= false;	//视频广告
		}else{
			this.adOK = (window.innerHeight/window.innerWidth)<1.65?false:true;	//底部广告
			this.vadOK= true;	//视频广告
		}
		this.adTime = 0;
		this.jgTime = 10;
        this.show = false;
        this.jinBi= '钻石';
		this.fhVAD= false;	//看视频复活
		this.fhVNUM = 2;    //看视频复活次数

		this.openD  = wx.getOpenDataContext();	
		this.shVas = this.openD.canvas;
		this.shVas.width = 2*this.shVas.width;
		this.shVas.height = 2*this.shVas.height

        this.ww = window.innerWidth;
        this.wh = window.innerHeight;
		this.lineWidth = 5;
        this.bli = this.ww / 1000;
        this.gk = {};
        this.us = {};
        this.config = { CY_fxTxt: ['超好玩的益智小游戏，不用下载即可畅玩'], CY_fxImg: 'img/1.jpg', CY_fxCS: '' };
        this.dom = {};
        this.dombg = {};
        this.syin = true;
        this.iniVar();
        this.moveDom;	//当前移动的元素
        this.clickDom;	//当前点击的元素
        this.clickPos = { x: 0, y: 0 }	//点击的点位置
        //this.opt = wx.geShowOptionsSync();
        this.fid = 0;
        this.qzt = 0;
        this.scene = 0;
        this.ph = {};
        this.adHeight = 0;
		this.conMusic = '';	 //上一个播放连接声音的点

		this.liuhai = (window.innerHeight/window.innerWidth)>1.9?90*window.innerWidth/ 1000:0;

        //p(this.opt);
        // 维护当前requestAnimationFrame的id
        this.aniId = 0;
        //ctxOnTH();
        this.getConfigTime = 0;

		this.adID  = '';
		this.vadID = '';

        //this.getConfig();
        this.restart();	//play
		this.xxIng = false;	//正在消失或移动操作	
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
        this.InitPos = [];
        this.NextGG = [];
        this.ThisGG = 0;
        this.ThisGK = 1;
        this.ThisPH = [];
        this.gDDN = false;
        this.qzTime = 0; //求助时间

        this.HLine = true;  //画线锁
        this.aColor = ["#e78cc9", "#a9e445", "#00FF00", "#78bff6", '#ff0066', '#ff00ff', '#cc0066', '#666666', '#663366', '#339966', '#000066', '#0033cc', '#0099cc', '#66cccc', '#9966ff', '#FFCC00','#FF9966','#006600','#33FFFF','#FF0000','#666633'];
		this.dombg['bg'] = new Dom ('index','img','src:i/bg.png;x:0;y:0;width:'+this.ww+';height:'+this.wh+';');

        let yunw = this.rand(30, 100), yunh = this.rand(10, 20), yunx = this.rand(0, this.ww);
        for (var n = 0; n <= 7; n++) {
            this.dombg['yun' + n] = new Dom('allPage', 'img', 'src:img/yun.png;mv:' + this.rand(1, 10) + ';width:' + yunw + ';height:' + yunw * 0.73 + ';x:' + yunx + ';y:' + yunh + ';')			
            yunh += yunw * 0.73 + this.rand(10, 50);
            yunw = this.rand(60, 80);
            yunx = this.rand(0, this.ww);
        }

		this.xtPos = [];	//记录相同点
		this.xiaoMC= 1;		//消除的声音
		this.deFen = 0;		//本局得分
		this.buildPos = [];
		this.randMax  = 6;

		this.bStartBtn = true;	//是否显示此按扭
        this.buildStartBtn();
    }

    del(v) {
		p(v);
		if (/(endphts|endts|djts)/.test(v)){
			this.openD.postMessage({cmd:'echo',n:0,uid:this.config.uid,fen:this.deFen});
		}
		
        for (var dx in this.dom) {
            if (undefined !== this.dom[dx].attr['class'] && this.dom[dx].attr['class'] == v) {
                delete this.dom[dx];
            }
        }
        this.iniDoms();
    }
    btm_btn() {	//首页下按扭
        let that = this;
        if (undefined !== this.dom['b1']) {
            return;
        }
		let h = 1200*this.bli;
        let btnw = 180 * this.bli, btnh = 182 * this.bli, btnkx = (this.ww - 180* this.bli - 4 * btnw) / 3;
        this.dom.b1 = new Dom('index', 'img', 'src:i/b1.png;width:' + btnw + ';height:' + btnh + ';x:'+90* this.bli+';y:' + h + ';', { click: function () { that.ts_qiandao(); } });
        this.dom.b2 = new Dom('index', 'img', 'src:i/b2.png;width:' + btnw + ';height:' + btnh + ';x:' + (90* this.bli + btnkx + btnw) + ';y:' + h + ';', { click: function () { that.restart('order') } });
        this.dom.b3 = new Dom('index', 'img', 'src:i/b3.png;width:' + btnw + ';height:' + btnh + ';x:' + (90* this.bli + 2 * btnkx + 2 * btnw) + ';y:' + h + ';', { click: function () { that.fx() } });
        this.dom.b4 = new Dom('index', 'img', 'src:i/b4.png;width:' + btnw + ';height:' + btnh + ';x:' + (90* this.bli + 3 * btnkx + 3 * btnw) + ';y:' + h + ';', { click: function () { that.ts_fuli(); } });

    }
    ts_bg(s) { //通用弹窗背景
        let that = this;
        if (undefined !== this.dom['ts_wh']) {
            return;
        }
        this.dom.ts_wh = new Dom('index', 'img', 'class:ts;src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { p(1); } });
        this.dom.ts_bg = new Dom('index', 'img', 'class:ts;src:img/ttbg.png;width:' + 729 * this.bli + ';height:' + 934 * this.bli + ';x:' + (this.ww - 729 * this.bli) / 2 + ';y:' + (this.wh - 934 * this.bli) / 2.4 + ';');
        this.dom.ts_titbg = new Dom('index', 'img', 'class:ts;src:img/ttit.png;width:' + 762 * this.bli + ';height:' + 106 * this.bli + ';x:' + (this.ww - 762 * this.bli) / 2 + ';y:' + ((this.wh - 934 * this.bli) / 2.4 - 5) + ';');
        this.dom.ts_tit = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:16px 微软雅黑;textalign:center;valign:middle;x:' + this.ww / 2 + ';y:' + (this.dom.ts_titbg.attr.y + 93 * this.bli / 2) + ';', { text: s })
        this.dom.ts_close = new Dom('index', 'img', 'class:ts;src:img/lt4.png;width:' + 81 * this.bli + ';height:' + 81 * this.bli + ';x:' + (this.ww - 81 * this.bli) / 2 + ';y:' + (this.dom.ts_bg.attr.y + this.dom.ts_bg.attr.height) + ';', {
            click: function () {
                that.del('ts');
            }
        });
    }
    ts_fuli() { //福利
        this.ad()
        //this.ts_bg('每天邀好友领福利');
        if (undefined !== this.dom['qd5_1'] || undefined === this.config || undefined === this.config.yq) {
            this.iniDoms();
            return;
        }

        this.dom.ts_wh = new Dom('index', 'img', 'class:ts;src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { p(1); } });
        this.dom.ts_bg = new Dom('index', 'img', 'class:ts;src:i/popup-gift.png;width:' + 910 * this.bli + ';height:' + 1027 * this.bli + ';x:' + (1000-910) * this.bli/2 + ';y:' + 300 * this.bli + ';');
        this.dom.ts_close = new Dom('index', 'img', 'class:ts;src:i/popup-close.png;width:' + 95 * this.bli + ';height:' + 95 * this.bli + ';x:' + (this.ww-130 * this.bli) + ';y:' + 300 * this.bli + ';', {
            click: function () {
                that.del('ts');
            }
        });


        let that = this;
        let xw = 739 * this.bli;
        let xh = 143 * this.bli;
        let xx = (this.ww-xw)/2, xy = 500 * this.bli, xx2 = xx;

        for (var i = 1; i <= 5; i++) {
            if (undefined !== this.us.yq[i - 1]) {
				this.dom['qd6_1_' + i] = new Dom('allPage', 'img', 'class:ts;src:i/popup-gift-btn.png;width:' + xw + ';height:' + xh + ';x:'+xx+';y:'+xy+';');
				this.dom['qd6_2_' + i] = new Dom('allPage', 'img', 'class:ts;src:' + this.us.yq[i - 1]['pic'] + ';yy:black;yyk:10;yuan:'+xh * 0.3+';width:' + xh * 0.6 + ';height:' + xh * 0.6 + ';x:' + (xx + xh * 0.2) + ';y:' + (xy + xh * 0.2) + ';');
                this.dom['qd6_4_' + i] = new Dom('allPage', 'img', 'class:ts;src:i/btn-get-' + (this.us.yq[i - 1]['lbi'] > 0 ? 'off' : 'on') + '.png;width:' + 188 * this.bli + ';height:' + 78 * this.bli + ';x:' + (xx + xw - xh * 0.2 - 188 * this.bli) + ';y:' + (xy + xh / 2 - 78 * this.bli / 2) + ';', { fuliid: that.us.yq[i - 1]['id'], fulin: i, click: function (d) { that.lin_fuli(d.attr.fuliid, d.attr.fulin) } });
            } else {				
				this.dom['qd6_1_' + i] = new Dom('allPage', 'img', 'class:ts;src:i/popup-gift-btn.png;width:' + xw + ';height:' + xh + ';x:'+xx+';y:'+xy+';', { click: function () { that.fx() } });
				this.dom['qd6_2_' + i] = new Dom('allPage', 'img', 'class:ts;src:i/jia.jpg;width:' + xh * 0.6 + ';height:' + xh * 0.6 + ';x:' + (xx + xh * 0.2) + ';y:' + (xy + xh * 0.2) + ';', { click: function () { that.fx() } });
                this.dom['qd6_4_' + i] = new Dom('allPage', 'img', 'class:ts;src:i/btn-get-off.png;width:' + 188 * this.bli + ';height:' + 78 * this.bli + ';x:' + (xx + xw - xh * 0.2 - 188 * this.bli) + ';y:' + (xy + xh / 2 - 78 * this.bli / 2) + ';');
            }


            this.dom['qd6_3_' + i] = new Dom('allPage', 'font', 'class:ts;color:#401900;font:14px 微软雅黑;textalign:left;valign:top;x:' + (xx + xh * 0.2 + xh * 0.8) + ';y: ' + (xy + xh * 0.2) + ';', { text: '邀请第' + i + '位好友' });
            this.dom['qd6_5_' + i] = new Dom('allPage', 'img', 'class:ts;src:i/icon-gold.png;width:' + 44 * this.bli + ';height:' + 44 * this.bli + ';x:' + (xx + xh * 0.2 + xh * 0.8) + ';y: ' + (xy + xh * 0.5) + ';');
            this.dom['qd6_6_' + i] = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:14px 微软雅黑;textalign:left;valign:top;x:' + (xx + xh * 0.2 + xh * 0.8 + xh * 0.4) + ';y: ' + (xy + xh * 0.5) + ';', { text: '+' + this.config.yq[i] });


			/*
            if (undefined !== this.us.yq[i - 1]) {
                this.dom['qd6_2_' + i] = new Dom('allPage', 'img', 'class:ts;src:' + this.us.yq[i - 1]['pic'] + ';yuan:18;width:' + xh * 0.6 + ';height:' + xh * 0.6 + ';x:' + (xx + xh * 0.2) + ';y:' + (xy + xh * 0.2) + ';');
                this.dom['qd6_4_' + i] = new Dom('allPage', 'img', 'class:ts;src:img/lqu' + (this.us.yq[i - 1]['lbi'] > 0 ? '_ok' : '') + '.png;width:' + 140 * this.bli + ';height:' + 53 * this.bli + ';x:' + (xx + xw - xh * 0.2 - 140 * this.bli) + ';y:' + (xy + xh / 2 - 53 * this.bli / 2) + ';', { fuliid: that.us.yq[i - 1]['id'], fulin: i, click: function (d) { that.lin_fuli(d.attr.fuliid, d.attr.fulin) } });
            } else { 
                this.dom['qd6_2_' + i] = new Dom('allPage', 'img', 'class:ts;src:img/jia.png;width:' + xh * 0.6 + ';height:' + xh * 0.6 + ';x:' + (xx + xh * 0.2) + ';y:' + (xy + xh * 0.2) + ';', { click: function () { that.fx() } });
                this.dom['qd6_4_' + i] = new Dom('allPage', 'img', 'class:ts;src:img/lqu_off.png;width:' + 140 * this.bli + ';height:' + 53 * this.bli + ';x:' + (xx + xw - xh * 0.2 - 140 * this.bli) + ';y:' + (xy + xh / 2 - 53 * this.bli / 2) + ';');
            }
			*/


            xy += xh + 16*this.bli;
        }
        this.iniDoms();
    }
    lin_fuli(id, n) {
        let that = this;
        that.post({ act: 'gFuli', id: id, n: n }, function (d) {
            if (d.code == 200) {
				wx.showToast({ title: '领取成功' });
                that.us.yq = d.yq;
                that.del('ts');
                that.ts_fuli();
                that.us.jbi = d.jbi
                that.dom.jbs.attr.text = d.jbi;
            }
        });
    }
    qian_dao() {
        let that = this;
        that.post({ act: 'qianDao' }, function (d) {
            if (d.code == 200) {
				wx.showToast({ title: '领取成功' });
                that.us.qd = d.qd;
                that.del('ts');
                that.ts_qiandao();
                that.us.jbi = d.jbi;
                that.dom.jbs.attr.text = d.jbi;
            }
        });
    }
    ts_guiz() {	//规则
        let that = this;
        this.dom.gzbg = new Dom('index', 'img', 'class:guiz;src:i/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { } });
        this.dom.gzs = new Dom('index', 'img', 'class:guiz;src:i/gz.png;width:' + 910 * this.bli + ';height:' + 670 * this.bli + ';x:'+45*this.bli+';y:' + 422 * this.bli + ';');
        this.dom.ts_close = new Dom('index', 'img', 'class:guiz;src:i/popup-close.png;width:' + 95 * this.bli + ';height:' + 95 * this.bli + ';x:' + (this.ww-95 * this.bli)/2 + ';y:' + (670+422) * this.bli + ';', {
            click: function () {
                that.del('guiz');
            }
        });
        this.iniDoms();
    }
    ts_qiandao() {  //签到       
        this.ad()
        //this.ts_bg('每日签到奖励');
        if (undefined !== this.dom['qd5_1'] || undefined === this.config || undefined === this.config.qd) {
            this.iniDoms();
            return;
        }
        let that = this;


        this.dom.ts_wh = new Dom('index', 'img', 'class:ts;src:img/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { p(1); } });
        this.dom.ts_bg = new Dom('index', 'img', 'class:ts;src:i/popup-sign.png;width:' + 910 * this.bli + ';height:' + 1027 * this.bli + ';x:' + (1000-910) * this.bli/2 + ';y:' + 300 * this.bli + ';');
        this.dom.ts_close = new Dom('index', 'img', 'class:ts;src:i/popup-close.png;width:' + 95 * this.bli + ';height:' + 95 * this.bli + ';x:' + (this.ww-130 * this.bli) + ';y:' + 300 * this.bli + ';', {
            click: function () {
                that.del('ts');
            }
        });
        let xw = 175 * this.bli;
        let xh = 226 * this.bli;
        let xx = 120 * this.bli, xy = 560 * this.bli, xx2 = xx;
		let lqu = false;
		for (var i = 1; i <= 7; i++) {
			let tu = 'sign';
			if (i == 7){
				tu = 'sign2';
			}			
			if (i < this.us.qd[0] || (i == parseInt(this.us.qd[0]) && 1 == this.us.qd[1])) {
				this.dom['qd5x_' + i] = new Dom('index', 'img', 'class:ts;src:i/'+tu+'-off.png;width:' + xw + ';height:' + xh + ';x:' + xx + ';y:' + xy + ';');

				this.dom['qd5b_' + i] = new Dom('allPage', 'font', 'class:ts;color:#DDD;font:14px 微软雅黑;textalign:center;valign:middle;x:' + xw/2 + ';y:' + 180 * this.bli + ';', { text: '+' + this.config.qd[i] ,f:this.dom['qd5x_' + i]});
				this.dom['qd5f_' + i] = new Dom('allPage', 'font', 'class:ts;color:#DDD;font:14px 微软雅黑;textalign:center;valign:middle;x:' + xw/2 + ';y:' + 44 * this.bli + ';', { text: '第' + i + '天' ,f:this.dom['qd5x_' + i]});

			} else if (i == this.us.qd[0]) {
				lqu = true;
				this.dom['qd5x_' + i] = new Dom('index', 'img', 'class:ts;src:i/'+tu+'-current.png;width:' + xw + ';height:' + xh + ';x:' + xx + ';y:' + xy + ';');

				this.dom['qd5b_' + i] = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:14px 微软雅黑;textalign:center;valign:middle;x:' + xw/2 + ';y:' + 180 * this.bli + ';', { text: '+' + this.config.qd[i] ,f:this.dom['qd5x_' + i]});
				this.dom['qd5f_' + i] = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:14px 微软雅黑;textalign:center;valign:middle;x:' + xw/2 + ';y:' + 44 * this.bli + ';', { text: '第' + i + '天' ,f:this.dom['qd5x_' + i]});
			}else {
				this.dom['qd5x_' + i] = new Dom('index', 'img', 'class:ts;src:i/'+tu+'-on.png;width:' + xw + ';height:' + xh + ';x:' + xx + ';y:' +xy + ';');
				this.dom['qd5b_' + i] = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:14px 微软雅黑;textalign:center;valign:middle;x:' + xw/2 + ';y:' + 180 * this.bli + ';', { text: '+' + this.config.qd[i] ,f:this.dom['qd5x_' + i]});
				this.dom['qd5f_' + i] = new Dom('allPage', 'font', 'class:ts;color:#FFF;font:14px 微软雅黑;textalign:center;valign:middle;x:' + xw/2 + ';y:' + 44 * this.bli + ';', { text: '第' + i + '天' ,f:this.dom['qd5x_' + i]});
			}
            xx += xw + 20 * this.bli;
            if (i == 4) {
                xy += xh + 22 * this.bli;
                xx = xx2;
            }
			if (i == 6) {
                xw = 369 * this.bli;
            }
		}
		if(lqu){
			this.dom['qd5btn_' + i] = new Dom('index', 'img', 'class:ts;src:i/btn-receive.png;width:' + 320 * this.bli + ';height:' + 100 * this.bli + ';x:' + 340 * this.bli + ';y:' +1124 * this.bli + ';',{ click: function () { that.qian_dao() }});
		}else {
			this.dom['qd5btn_' + i] = new Dom('index', 'img', 'class:ts;src:i/btn-receive-yes.png;width:' + 320 * this.bli + ';height:' + 100 * this.bli + ';x:' + 340 * this.bli + ';y:' +1124 * this.bli + ';');
		}
        this.iniDoms();
    }
	timeJG(){
		if (this.currPlay){ //游戏页
			//p(this.us.ggnum);
			//p(this.deFen);
		}		
		this.ad();
	}
    ad() {
		p('底广告ID'+this.adID);
        if (!this.adOK || this.adID==''){ return}
		
		let that = this;
        this.adHeight = 0;
        if (undefined !== this.bannerAd) {
            this.bannerAd.destroy()
        }
        if (undefined === wx.createBannerAd) {
            return;
        }
        this.bannerAd = wx.createBannerAd({
            adUnitId: that.adID,
            style: {
                left: 0,
                top: this.wh * 0.85,
                width: this.ww
            }
        })
        //this.bannerAd.destroy()
        this.bannerAd.show()
    }
    vad() {
		//this.onVad();return;
        if (!this.vadOK){ return }
		if (this.vadID==''){
			this.ts_fuli();
			return;
		}		
        let that = this;
        if (undefined === wx.createRewardedVideoAd){
            return;
        }
        this.bannerVad = wx.createRewardedVideoAd({
            adUnitId: that.vadID
        });
        this.bannerVad.load().then(function () {
			if (undefined !== that.bannerAd) {
				that.bannerAd.destroy()
			}

            return that.bannerVad.onClose(function (res) {
                if (res && res.isEnded || res === undefined) {
                    that.onVad();
                    p('正常播放结束，可以下发游戏奖励')
                }
                else {
                    that.fhVAD = false;
                    that.offVad();
                    p('播放中途退出，不下发游戏奖励')
                }
                that.bannerVad.offClose();//, that.onVad();
				that.ad();
            }), 
            that.bannerVad.show();
        }).catch(err => {
            p('视频广告加载失败');
            //this.bannerVad.load().then(() => this.bannerVad.show())
        })
	}
    offVad(){
		that.fhVAD = false;
        wx.showToast({ title: '视频播放失败，未获得'+this.jinBi+'奖励',icon:'none'});
        //p('用户未到时关闭');
    }
    onVad(){
		let that = this;
		if (that.fhVAD){	//看视频复活
			wx.showToast({ title: '成功复活'});
			that.setJiHui(5);
			that.del('endts');
		}else {
			this.post({act:'vadJB'}, function(data){
				if(data.code == 200){
					that.us.jbi = data.jbi;
					if (undefined!==that.dom.jbs){
						p('has jbs');
						that.dom.jbs.attr.text = data.jbi;
					}else {
						p('no jbs');	
					}
					if (undefined !== that.dom.v2){
						that.us.vadnum = data.vadnum;
						that.dom.v2.attr.text = '今日剩余次数 '+that.us.vadnum+'/'+that.config.vadNum;
					}
					wx.showToast({ title: '恭喜，获得50'+that.jinBi+'奖励',icon:'none'});
				}
			},'json');
			p('到时间关闭');
		}
    }

    restart(s) {
        this.InitPos = [];
        this.gDDN = false;
        this.qzTime = 0
        this.shanK = false;
        this.ThisGG = 0;
        this.NextGG = [];
        this.bTS = false;
        let that = this;
        this.clickMove = false;
        this.dom = {};
        this.HLine = true;
        this.ThisPH = [];

		that.music = new Music();
		/*if(undefined !==this.music && undefined !==this.music.bg){
			p(this.music.bg);
			this.music.bg.loog = false;
			this.music.bg.pause = true;
		}*/

		

		if (undefined!==this.dombg['play_bgk']){
			delete this.dombg['play_bgk'];
		}
		
		this.xtPos = [];
        
        this.currPage = s;
        this.adOK = (window.innerHeight/window.innerWidth)<1.65?false:true;	//底部广告

		this.adTime = this.now();
		this.currPlay = false;
        if (s == 'play') {

			//this.openD.postMessage({cmd:'echo',n:1}) //显示即将超过
			this.openD.postMessage({cmd:'echo',n:0,uid:this.config.uid,fen:0});

			this.fhVNUM   = 3;  //可视频几次复活
			this.xiaoMC   = 1;
			this.currPlay = true;
            //this.music.playbg(this.syin)
			
			this.ThisGG = arguments[3];
			
			this.dombg['play_bgk'] = new Dom('play', 'img', 'src:i/k.png;width:'+this.bli * 945+';height:'+this.bli * 955+';x:' + ((1000-915-30) * this.bli)/2 + ';y:' + (330 * this.bli-15*this.bli) + ';');

            this.tp = (330 * this.bli+this.liuhai); //顶部
            this.bk = ((1000-915) * this.bli)/2; //边框
            this.kh = this.bli * 927;
            this.cuO = -1;
            this.OcuO = -1;	//之前点了的点

            this.HLine = false;

			this.nX = 5;
			this.nY = 5; 
			this.randMax  = 6;

			this.posXY(that.nX, that.nY, this.kh);

            this.PlayArO = [];
            this.MicroT = this.now_m();
            this.buShu = 5;
			this.deFen = 0;
			this.jiaFenNum = 0;
			this.buildPos  = [];
			this.djTS_Time = 150;

            this.dom.goHome = new Dom('play', 'img', 'src:i/lt1.png;width:' + this.bli * 100 + ';height:' + this.bli * 100 + ';x:'+40 * this.bli+';y:' + 27 * this.bli + ';', { click: function () { that.play_gohome(); } })
			this.dom.jbbg = new Dom('play', 'img', 'src:i/jbix.png;width:' + 325 * this.bli + ';height:' + 100 * this.bli + ';x:' + (164 * this.bli) + ';y:' + 27 * this.bli + ';', { text: that.us.jbi,click: function () { that.vad(); } });
			this.dom.jbs = new Dom('play', 'font', 'color:#0074B8;font:16px sans-serif;valign:middle;textalign:center;x:' + (330 * this.bli) + ';y:' + 76 * this.bli + ';', { text: (undefined === that.us || undefined === that.us.jbi ? '0' : that.us.jbi) })

            this.dom.v1 = new Dom('index', 'font', 'color:#666;font:11px 微软雅黑;valign:middle;textalign:left;x:' + (500 * this.bli) + ';y:' + 65 * this.bli + ';', { text: '观看视频 +'+this.config.vadJB+this.jinBi });
            this.dom.v2 = new Dom('index', 'font', 'color:#666;font:11px 微软雅黑;valign:middle;textalign:left;x:' + (500 * this.bli) + ';y:' + 95 * this.bli + ';', { text: '今日剩余次数 '+this.us.vadnum+'/'+this.config.vadNum+'' });

            //this.dom[0] = new Dom('play', 'img', 'src:img/lt1.png;width:' + this.bli * 70 + ';height:' + this.bli * 70 + ';x:10;y:15;', { click: function () { that.restart(); } })
            //this.dom[1] = new Dom('play', 'img', 'src:img/lt2.png;width:' + this.bli * 70 + ';height:' + this.bli * 70 + ';x:' + (this.dom[0].attr.width + 20) + ';y:15;', { click: function () { that.restart('level'); } })

			this.dom[1] = new Dom('play', 'font', 'color:#3572AA;font:bold 35px 微软雅黑;valign:top;textalign:left;x:' + (40*this.bli) + ';y:' + (210 * this.bli+0.5) + ';', { text: '0' })
            this.dom[2] = new Dom('play', 'font', 'color:#FFF;font:bold 35px 微软雅黑;textalign:left;x:' + (40*this.bli) + ';y:'+(210 * this.bli)+';', { text: '0' });

			this.dom['x1'] = new Dom('play', 'img', 'src:i/x.png;width:' + this.bli * 86 + ';height:' + this.bli * 86 + ';x:'+(this.ww-(15+96) * this.bli)+';y:' + 1280 * this.bli + ';');
			this.dom['x2'] = new Dom('play', 'img', 'src:i/x.png;width:' + this.bli * 86 + ';height:' + this.bli * 86 + ';x:'+(this.ww-(15+2*96) * this.bli)+';y:' + 1280 * this.bli + ';');
			this.dom['x3'] = new Dom('play', 'img', 'src:i/x.png;width:' + this.bli * 86 + ';height:' + this.bli * 86 + ';x:'+(this.ww-(15+3*96) * this.bli)+';y:' + 1280 * this.bli + ';');
			this.dom['x4'] = new Dom('play', 'img', 'src:i/x.png;width:' + this.bli * 86 + ';height:' + this.bli * 86 + ';x:'+(this.ww-(15+4*96) * this.bli)+';y:' + 1280 * this.bli + ';');
			this.dom['x5'] = new Dom('play', 'img', 'src:i/x.png;width:' + this.bli * 86 + ';height:' + this.bli * 86 + ';x:'+(this.ww-(15+5*96) * this.bli)+';y:' + 1280 * this.bli + ';');

			//this.dom[4] = new Opacity('play', 'font', 'color:#FFF;font:16px sans-serif;textalign:right;valign:top;opacity:0;x:' + (this.ww-(25+5*96) * this.bli) + ';y:'+206 * this.bli+';', { text: '' });
			this.dom[4] = new Lianji(this);


			//this.dom['x6'] = new Dom('play', 'img', 'src:i/n11.png;width:' + this.bli * 86 + ';height:' + this.bli * 86 + ';x:'+50 * this.bli+';y:' + 1280 * this.bli + ';',{click:function(){that.endTS()}});
			//this.dom['x7'] = new Dom('play', 'img', 'src:i/n12.png;width:' + this.bli * 86 + ';height:' + this.bli * 86 + ';x:'+150 * this.bli+';y:' + 1280 * this.bli + ';',{click:function(){that.endPHTS()}});
			

			//this.dom[0] = new Dom('play', 'img', 'src:i/tips-step.png;width:' + this.bli * 177 + ';height:' + this.bli * 84 + ';x:'+40 * this.bli+';y:' + 162 * this.bli + ';')
            //this.dom[3] = new Dom('play', 'font', 'color:#FFF;font:13px 微软雅黑;textalign:left;valign:middle;x:' + this.bli * 62 + ';y:'+this.bli * 198+';', { text: '机会 : ' + that.buShu })

            //this.dom[4] = new Dom('play', 'img', 'src:img/jbix.png;width:' + 182 * this.bli + ';height:' + 70 * this.bli + ';x:' + (this.ww / 2 - 182 * this.bli * 0.65) + ';y:' + (60 - 70 * this.bli / 2) + ';');
            //this.dom[40] = new Dom('play', 'font', 'color:#FFF;font:14px 微软雅黑;textalign:center;x:' + this.ww / 2 + ';y:60;', { text: that.us.jbi })

			//this.dom['dd'] = new Dom('play', 'font', 'color:#3495E4;font:14px sans-serif;textalign:center;x:' + (this.ww / 2+0.5) + ';y:' + (1300 * this.bli) + ';', { text: '点击有数字的框格，里面的数字+1' });
			//this.dom['dd2'] = new Dom('play', 'font', 'color:#3495E4;font:14px sans-serif;textalign:center;x:' + (this.ww / 2+0.5) + ';y:' + (1350 * this.bli) + ';', { text: '三个以上一样的数字连一起，合成一个+1的格子！' });

            //this.dom[5] = new Dom('play', 'img', 'src:i/icon-replay.png;width:'+this.bli * 111+';height:'+this.bli * 111+';x:'+40 * this.bli+';y:' + (1274 * this.bli) + ';', { click: function () {that.altGG(0); p('确认重新开始一局？');} })

            //if (this.config['CY_fxts'] == 1) {
            //    this.dom[6] = new Dom('play', 'img', 'src:i/btn-share.png;width:'+this.bli * 329+';height:'+this.bli * 111+';x:' + this.bli * 277 + ';y:' + (1274 * this.bli) + ';', { click: function () { p('分享提示'); that.fx(1); } })
            //}
            //this.dom[7] = new Dom('play', 'img', 'src:i/btn-tips50.png;width:'+this.bli * 329+';height:'+this.bli * 111+';x:' + (this.ww - this.bli * 329 - 40 * this.bli) + ';y:' + (1274 * this.bli) + ';', { click: function () { p('金币提示'); that.tiShi() } })
			//that.dom['szi'] = new Mv('play', 'img', 'src:i/x3.png;movesd:3;width:'+that.bli * 117+';height:'+that.bli * 154+';x:'+posXY[0][0]+';y:'+posXY[0][1]+';',{movexy:posXY});
			


			

			if (this.vadID==''){
				this.dom.v1.dis = false;
				this.dom.v2.dis = false;			
			}


			this.ckKong();

            canvas.removeEventListener('touchstart', this.touchHandler);
            canvas.removeEventListener('touchmove', this.touchMVHandler);
			canvas.removeEventListener('touchend', this.touchEDHandler);
            this.hasEventBind = false;

            this.bindLoop = this.play.bind(this)

        } else if (s == 'order') { //排行榜页面 
			this.openD.postMessage({cmd:'echo',n:0,uid:this.config.uid,fen:0});

            this.dom.goHome = new Dom('level', 'img', 'src:i/lt1.png;width:' + this.bli * 100 + ';height:' + this.bli * 100 + ';x:'+40 * this.bli+';y:' + 27 * this.bli + ';', { click: function () { that.restart(); } })
            this.dom.jbbg = new Dom('index', 'img', 'src:i/jbix.png;width:' + 325 * this.bli + ';height:' + 100 * this.bli + ';x:' + (164 * this.bli) + ';y:' + 27 * this.bli + ';', { text: that.us.jbi,click: function () { that.vad(); } });
			this.dom.jbs = new Dom('index', 'font', 'color:#0074B8;font:16px sans-serif;valign:middle;textalign:center;x:' + (330 * this.bli) + ';y:' + 76 * this.bli + ';', { text: (undefined === that.us || undefined === that.us.jbi ? '0' : that.us.jbi) })

            let kw = this.ww - 20;
            let tabH = 0.17 * kw / 2;
            this.dom[2] = new Dom('order', 'img', 'src:i/tab-qgpm-on.png;2-src:i/tab-qgpm-off.png;width:' + this.bli * 455 + ';height:' + this.bli * 114 + ';x:'+(this.ww/2-this.bli * 455)+';y:'+this.bli * 168 +';', { click: function () { that.seOrd(0) } });
            this.dom[3] = new Dom('order', 'img', 'src:i/tab-hypm-off.png;2-src:i/tab-hypm-on.png;width:' + this.bli * 455 + ';height:' + this.bli * 114 + ';x:'+this.ww/2+';y:' + this.bli * 168 + ';', { click: function () { that.seOrd(2) } });
			this.dom[5] = new Dom('order', 'img', 'src:i/ord.png;width:' + this.bli * 920 + ';height:' + this.bli * 1089 + ';x:'+40*this.bli+';y:'+this.bli * 320 +';');

            this.dom[6] = new Dom('order', 'div', 'border:#FEFAEF;width:' + this.bli * 880 + ';radius:10;height:' + this.bli * 1049 + ';x:'+60*this.bli+';y:'+this.bli * 340 +';', { overflow: true, ofx: 2, mousemove: true });

			//this.dom['tgph'] = new Dom('order', 'div', 'border:#FEFAEF;width:' + this.bli * 880 + ';radius:10;height:' + this.bli * 1049 + ';x:'+60*this.bli+';y:'+this.bli * 340 +';', { overflow: true, ofx: 2, mousemove: true });
            this.dom[7] = new Dom('order', 'font', 'color:#CCC;font:14px 微软雅黑;opacity:1;valign:middle;textalign:center;x:' + (this.dom[6].attr.width / 2) + ';y:' + (this.dom[6].attr.height * 0.1) + ';', { f: this.dom[6], text: '数据加载中...' });
            //this.dom['k'] = new Dom('order', 'div', 'border:#C2A4D6;width:'+(this.dom[6].attr.width-20)+';height:'+(this.dom[6].attr.height*0.3)+';x:10;y:10;',{f:this.dom[6]});

            this.seOrd(0);

			//this.openD.postMessage({cmd:'echo',n:4,uid:this.config.uid,fen:0});

            canvas.removeEventListener('touchstart', this.touchHandler);
            canvas.removeEventListener('touchmove', this.touchMVHandler);
            canvas.removeEventListener('touchend', this.touchEDHandler);
            this.hasEventBind = false;
            //this.index();
            this.bindLoop = this.order.bind(this);

        } else { //index
            this.tp = 85 * this.ww / 420; //顶部
            this.bk = 40 * this.ww / 420; //边框
            this.kh = this.wh / 2.3 - this.bk;
            this.cuDH = this.tp + this.kh + 10 * this.ww / 420;
            that.arO = that.indArO;
            that.nX = that.nIX;
            that.nY = that.nIY;
	

            that.posXY(that.nX, that.nY, (this.wh / 2.3 - this.bk));
            //this.dom.logo = new Dom('index', 'img', 'src:img/logo.png;width:' + (178 * this.ww / 420) + ';height:' + (42 * this.ww / 420) + ';x:' + ((this.ww - (178 * this.ww / 420)) / 2) + ';y:' + 40 * this.ww / 420 + ';');
            
			this.dom.logo = new Dom('index', 'img', 'src:i/banner.png;width:'+720 * this.bli+';height:'+540 * this.bli+';x:'+((this.ww-720 * this.bli)/2)+';y:'+189 * this.bli+';');

			this.dom.gguan = new Dom('index', 'font', 'color:#FFF;font:bold 18px sans-serif;valign:middle;textalign:center;x:' + (this.ww/ 2) + ';y:' + 800 * this.bli + ';', { text:'最高得 '+(undefined===this.us.ggnum?0:this.us.ggnum)+' 分',dis:true})

            this.dom.start = new Dom('index', 'img', 'src:i/start.png;width:' + 535 * this.bli + ';height:' + 160 * this.bli + ';x:' + ((this.ww - 554 * this.bli) / 2) + ';y:' + 852 * this.bli + ';', { click: function () { that.restart('play'); } });
            //this.cuDH += 51 * this.ww / 420 + 10 * this.ww / 420
            //this.dom.fx = new Dom('index', 'img', 'src:img/fxt.png;width:' + 250 * this.ww / 420 + ';height:' + 48 * this.ww / 420 + ';x:' + ((this.ww - 250 * this.ww / 420) / 2) + ';y:' + this.cuDH + ';', { click: function () { that.fx() } })
            //this.cuDH += 48 * this.ww / 420 + 10 * this.ww / 420;

            this.dom.morebtn = new Dom('index', 'img', 'src:i/more_btn.png;width:' + 377 * this.bli + ';height:' + 118 * this.bli + ';x:' + ((this.ww - 377 * this.bli) / 2) + ';y:' + 1046 * this.bli + ';', { click: function(){that.goAPPID();}} );


            this.btm_btn();
            //p(that.gc('sy',1)); 
            if (that.gc('sy', 1) == 1) {
                this.syin = true;
            } else {
                this.syin = false;
            }
            this.dom.muxi = new Dom('index', 'img', 'src:i/sy_' + (this.syin ? 'on' : 'off') + '.png;width:' + 100 * this.bli + ';height:' + 100 * this.bli + ';x:'+40 * this.bli+';y:' + 27 * this.bli + ';', { click: function () { if (that.syin) {that.syin = false; that.dom.muxi.sSrc('i/sy_off.png'); that.sc('sy', 0); } else { that.syin = true; that.dom.muxi.sSrc('i/sy_on.png'); that.sc('sy', 1); } } });

			this.dom.guiz = new Dom('index', 'img', 'src:i/guiz.png;width:' + 100 * this.bli + ';height:' + 100 * this.bli + ';x:'+164 * this.bli+';y:' + 27 * this.bli + ';', { click: function () { that.ts_guiz(); } });

            this.dom.jbbg = new Dom('index', 'img', 'src:i/jbix.png;width:' + 325 * this.bli + ';height:' + 100 * this.bli + ';x:' + (287 * this.bli) + ';y:' + 27 * this.bli + ';', { click: function () { that.vad();} });
            this.dom.jbs = new Dom('index', 'font', 'color:#0074B8;font:16px sans-serif;valign:middle;textalign:center;x:' + (455 * this.bli) + ';y:' + 76 * this.bli + ';', { text: (undefined === that.us || undefined === that.us.jbi ? '0' : that.us.jbi) })


			//this.dom.wan = new Dx('index', 'img', 'src:i/wan.png;width:' + 100 * this.bli + ';height:' + 100 * this.bli + ';x:' + (40 * this.bli) + ';y:' + 200 * this.bli + ';', { click: function () { that.goAPPID();} });

            this.currPage = 'index';
            this.adOK     = false;
            if (undefined!==this.bannerAd){
                this.bannerAd.destroy();
            }
            if (that.app_btn_ad){
                gAds(that.iniAdTu,that);
            }
            this.getConfig(0);
            canvas.removeEventListener('touchstart', this.touchHandler);
            this.hasEventBind = false;
            //this.index();
            this.bindLoop = this.index.bind(this);

        }
        this.ad();
        this.iniDoms();
        // 清除上一局的动画 
        window.cancelAnimationFrame(this.aniId);
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }
    goAPPID(id,p) {
        if (undefined===id){
            id = this.more_appid;
            p  = this.more_appph;
        }
        var e = this;
        wx.navigateToMiniProgram ? wx.navigateToMiniProgram({
            appId: id,
            path: p,
            success: function () {
                //p("底部发现更多游戏成功跳转到appId为 wxa0526df46dfc97a1 的小程序");
            },
            fail: function () { },
            complete: function () { }
        }) : wx.previewImage({
            //urls: [ 'i/jbix.png','i/jbix.png' ]
        });
    }

    iniAdTu(ls,t){
        if (t.currPage == 'index'){
            if (undefined!==ls.box_list.appid){
                t.more_appid = ls.box_list.appid;
                t.more_appph = ls.box_list.path;
                console.log(ls.box_list.title);
            }
            
            let m  = ls.app_link_list.length;
            let bk = t.ww-m*288*t.bli;
            let mw = (t.ww - bk)/m;
            let lge= ((t.ww - bk)/m - 248*t.bli)/2;
            for (var i=1; i<=m; i++){
                let o = ls.app_link_list[i-1];
                t.dom['ad_'+i] = new Dom('index', 'img', 'src:'+o['app_icon']+';width:' + 248 * t.bli + ';height:' + 200 * t.bli + ';x:' + (mw*(i-1)+lge+bk/2) + ';y:' + 1430 * t.bli + ';', { click: function () { t.goAPPID(o['appid'], o['link_path']); } });
            }
            t.iniDoms();
        }              
    }

    iniPlayPos() {
        this.PlayArO = [];
        let that = this;
        for (var i = 0; i < that.arO.length; i++) { 
			/*for (var ij in that.arO[i]){ 
				var x0 = that.arO[i][ij]; x0[x0.length] = i; x0[x0.length] = -1;
				that.PlayArO[that.PlayArO.length] = [x0,];
			}*/
			
            if (that.arO[i].length > 0) {
                var x0 = that.arO[i][0]; x0[x0.length] = i; x0[x0.length] = -1;
                that.PlayArO[that.PlayArO.length] = [x0,];
                x0 = that.arO[i][that.arO[i].length - 1]; x0[x0.length] = i; x0[x0.length] = -1;
                that.PlayArO[that.PlayArO.length] = [x0,];
            }
        }
    }
    seOrd(n) {
        let that = this;	
        this.dom[3].sAttr(n);
        this.dom[2].sAttr(n);
        this.del('ordls');

        if (undefined !== this.ph[2] && this.ph[2].length > 0) {
            that.seOrdOK(n);
			that.dom[7].dis = false;
        } else {
            this.post({ act: 'order' }, function (t) {
				that.dom[7].dis = false;
                that.ph = { 0: t.ord1, 2: t.ord2 };
                that.seOrdOK(n);
            });
        }		
    }
    seOrdOK(n) {
        var that = this;
        if (undefined !== that.ph[n] && that.ph[n].length > 0) {
            let kkh = 160*this.bli;
            that.dom[6].attr.offset.x = that.dom[6].attr.x;
            that.dom[6].attr.offset.y = that.dom[6].attr.y;
            that.dom[6].my = that.dom[6].attr.y;
            that.dom[6].attr.offset.h = that.dom[6].attr.height;
            for (var i = 1; i <= that.ph[n].length; i++) {
				let co = '#4D4E50';
				if (i==1){
					co = '#FF1C56';
				}else if(i == 2){
					co = '#FF7500';
				}else if(i == 3){
					co = '#008EFF';
				}
				
                that.dom['k_' + i] = new Dom('order', 'div', 'class:ordls;line:1;border:#DFD1BC;width:' + (that.dom[6].attr.width + 10) + ';height:' + kkh + ';x:-5;y:' + ((i - 1) * kkh) + ';', { f: that.dom[6] });

				that.dom['knax_' + i] = new Dom('order', 'font', 'class:ordls;color:'+co+';font:' + (i > 3 ? 18 : 20) + 'px 微软雅黑;valign:middle;textalign:center;x:' + 70*this.bli + ';y:' + ((i - 1) * kkh + kkh * 0.5) + ';', { f: that.dom[6], text:i });

                that.dom['ki_' + i] = new Dom('order', 'img', 'class:ordls;src:' + that.ph[n][i - 1]['pic'] + ';width:' + 100*this.bli + ';height:' + 100*this.bli + ';x:' + 150*this.bli + ';y:' + ((i - 1) * kkh + (kkh-100*this.bli)/2) + ';', { f: that.dom[6] });
                that.dom['kna_' + i] = new Dom('order', 'font', 'class:ordls;color:#6E6D6A;font:16px 微软雅黑;valign:middle;textalign:left;x:' + 280*this.bli + ';y:' + ((i - 1) * kkh + kkh * 0.5) + ';', { f: that.dom[6], text: that.ph[n][i - 1]['name'] });

                that.dom['kg0_' + i] = new Dom('order', 'div', 'class:ordls;background:#F2FBFE;width:' + (that.dom[6].attr.width * 0.3) + ';height:' + (kkh-2) + ';x:' + (that.dom[6].attr.width * 0.7) + ';y:' + ((i - 1) * kkh+1) + ';', { f: that.dom[6] });

                ///that.dom['kg1_' + i] = new Dom('order', 'font', 'class:ordls;color:#444;font:14px 微软雅黑;valign:middle;textalign:right;x:' + (that.dom[6].attr.width - 20) + ';y:' + ((i - 1) * kkh + kkh * 0.30) + ';', { f: that.dom[6], text: '大师'+that.ph[n][i - 1]['j']+'级' });
                that.dom['kg2_' + i] = new Dom('order', 'font', 'class:ordls;color:#F33009;font:15px 微软雅黑;valign:middle;textalign:right;x:' + (that.dom[6].attr.width - 20) + ';y:' + ((i - 1) * kkh + kkh * 0.5) + ';', { f: that.dom[6], text: that.ph[n][i - 1]['g']+'分' });
p(((i - 1) * kkh)+ kkh)
				//that.dom['kl_'+i] = new Dom('order','line','class:ordls;color:red;line:1',{f: that.dom[6],path:[[0,((i - 1) * kkh)+ kkh+20],[this.bli * 880+30,((i - 1) * kkh)+ kkh+20],[]]});
            }
        } else {
            this.dom[7].attr.text = '无相关排行数据！';
        }

        that.iniDoms();
    }
    ordThEnd(e) { //放手
        if (undefined !== this.moveDom && undefined !== this.moveDom.attr && this.moveDom.move) {
            e.preventDefault()
            this.moveDom.thMoveEnd(e);
        }
    }
    ordMove(e) {	//排行榜
        if (undefined !== this.moveDom && undefined !== this.moveDom.attr) {
            e.preventDefault()
            this.moveDom.thMove(e, this.clickPos.x, this.clickPos.y);
        }
    }
    order() {
        this.iniBG();
        for (var dm in this.dom){
            this.dom[dm].w();
        }
        if (clip) { //前面有裁没闭合
            clip = false;
            ctx.restore();
        }

		//ctx.scale(0.5,0.5);
		//ctx.drawImage(this.shVas, 0, 0);
		//ctx.scale(2,2);

        if (!this.hasEventBind) {
            this.hasEventBind = true
            this.touchHandler = this.ckClick.bind(this);
            this.touchMVHandler = this.ordMove.bind(this);
            this.touchEDHandler = this.ordThEnd.bind(this);
            canvas.addEventListener('touchstart', this.touchHandler)
            canvas.addEventListener('touchmove', this.touchMVHandler);
            canvas.addEventListener('touchend', this.touchEDHandler);
        }
        this.aniId = window.requestAnimationFrame(this.bindLoop, canvas)
    }

    ts_gg() { //过关提示
		this.ad();
        let that = this;
        let btww = Math.sqrt(this.ww * this.ww + this.wh * this.wh);
		this.dom['altBG0'] = new Dom('allPage', 'img', 'class:gguan;src:i/2.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;')
        this.dom['altBG1'] = new Dom('allPage', 'img', 'class:gguan;src:i/bjgang.png;z:1;width:' + btww + ';height:' + btww + ';x:' + (this.ww - btww) / 2 + ';y:' + (this.wh - btww) / 2 + ';', { click: function () { p('点了对话背景') } })
		//this.dom['alt5JX'] = new Dom('allPage', 'img', 'class:gguan;src:i/3x.png;width:' + 347*this.bli + ';height:' + 100*this.bli + ';x:' + (this.ww - 347*this.bli) / 2 + ';y:' + 66*this.bli + ';');
		this.dom['altggt'] = new Dom('allPage', 'img', 'class:gguan;src:i/success-head.png;width:' + 564*this.bli + ';height:' + 154*this.bli + ';x:' + (this.ww - 564*this.bli) / 2 + ';y:' + 214*this.bli + ';');

        let altY = ((this.wh - 400) / 2);

        this.dom['altBG2'] = new Dom('allPage', 'img', 'class:gguan;src:i/tc.png;width:'+(773*this.bli)+';height:'+(773*this.bli)+';x:' + ((this.ww - 773*this.bli) / 2) + ';y:' + (380*this.bli) + ';')
        altY += 20;
        let altX = (this.ww / 2); 
        p(altX);
        this.dom['f1'] = new Dom('play', 'font', 'class:gguan;color:#7F4625;textalign:center;font:bold 16px 微软雅黑;x:' + altX + ';y:' + 457*this.bli + ';', { text: '大师1级 第16关' })

        altY += 25;
        //this.dom['f2'] = new Dom('play', 'font', 'class:gguan;color:#FFF;font:24px 微软雅黑;textalign:center;x:' + altX + ';y:' + altY + ';', { text: '最小步数过关' })

        
        this.dom['lihai'] = new Dom('allPage', 'div', 'class:gguan;background:red;radius:5;line:1;border:red;font:14px 微软雅黑;color:#FFF;textAlign:center;valign:middle;width:50;height:25;x:' + (altX - 25) + ';y:' + 420*this.bli + ';', { text: '得分' })
        altY += 25;
        this.dom['f3'] = new Dom('play', 'font', 'class:gguan;color:#F60;font:50px Sans-serif;textalign:center;x:' + altX + ';y:' + altY + ';', { text: '0' })
		altY += 30;


        //altY += 10;  //通大关
        //this.dom['gdg'] = new Dom('allPage', 'img', 'class:gguan;src:img/zan.png;width:140;height:185;x:' + (altX - 70) + ';y:' + 570*this.bli + ';')

        altY += 70;
        this.dom['f4'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:80px 微软雅黑;textalign:center;x:' + (altX - 30) + ';y:' + 737*this.bli + ';', { text: '6' })
        this.dom['f5'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:30px 微软雅黑;textalign:center;x:' + (altX + 30) + ';y:' + 770*this.bli + ';', { text: '步' })
		this.dom['zgf'] = new Dom('play', 'font', 'class:gguan;color:#FDA617;font:18px Sans-serif;textalign:center;x:' + altX + ';y:' + (910 *this.bli) + ';', { text: '最高分：0' })
		this.dom['fxx'] = new Dom('allPage', 'img', 'class:gguan;src:i/btn-haoyou.png;width:'+660*this.bli+';height:'+112*this.bli+';x:' + ((this.ww) / 2 - 330*this.bli) + ';y:' + (950 *this.bli) + ';', { click: function () { that.fx()}});

        altY += 50;
        this.dom['f6'] = new Dom('allPage', 'div', 'class:gguan;background:#FDF9E6;font:14px 微软雅黑;textAlign:center;width:200;height:25;x:' + (altX-100) + ';y:' + 835*this.bli + ';', {click:function(){that.restart('order');}})
        this.dom['f6_2'] = new Dom('allPage', 'font', 'class:gguan;color:#F60;font:bold 16px 微软雅黑;textAlign:center;width:250;height:25;x:' + altX + ';y:' + 844*this.bli + ';', { text: ''})

        altY += 20;
        this.dom['f7'] = new Dom('allPage', 'div', 'class:gguan;color:#804727;background:#FDF5DB;border:#FDF5DB;radius:5;width:'+726*this.bli+';height:'+216*this.bli+';x:' + (altX - 726*this.bli/2) + ';y:' + 911*this.bli + ';', {})

        altY += 8;
        let pyi = 185*this.bli;
        this.dom['r1_1'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + 172*this.bli + ';y:' + 10*this.bli + ';', {f:this.dom['f7'], text: '1' })
        this.dom['r1_t'] = new Dom('allPage', 'img', 'class:gguan;src:img/1.gif;width:'+88*this.bli+';height:'+88*this.bli+';x:' + (172*this.bli-44*this.bli) + ';y:' + 34*this.bli + ';', {f:this.dom['f7']})
        this.dom['r1_2'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + 172*this.bli + ';y:' + 145*this.bli + ';', {f:this.dom['f7'], text: '姓名' })
        this.dom['r1_3'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + 172*this.bli + ';y:' + 185*this.bli + ';', {f:this.dom['f7'], text: '4步' })

        this.dom['r2_1'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + 726*this.bli/2 + ';y:' + 10*this.bli + ';', {f:this.dom['f7'], text: '2' })
        this.dom['r2_t'] = new Dom('allPage', 'img', 'class:gguan;src:img/1.gif;width:'+88*this.bli+';height:'+88*this.bli+';x:' + (726*this.bli/2-44*this.bli) + ';y:' + 34*this.bli + ';', {f:this.dom['f7']})
        this.dom['r2_2'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + 726*this.bli/2 + ';y:' + 145*this.bli + ';', {f:this.dom['f7'], text: '姓名' })
        this.dom['r2_3'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + 726*this.bli/2 + ';y:' + 185*this.bli + ';', {f:this.dom['f7'], text: '4步' })

        this.dom['r3_1'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (726*this.bli-172*this.bli) + ';y:' + 10*this.bli + ';', {f:this.dom['f7'], text: '3' })
        this.dom['r3_t'] = new Dom('allPage', 'img', 'class:gguan;src:img/1.gif;width:'+88*this.bli+';height:'+88*this.bli+';x:' + (726*this.bli-172*this.bli-44*this.bli) + ';y:' + 34*this.bli + ';', {f:this.dom['f7']})
        this.dom['r3_2'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (726*this.bli-172*this.bli) + ';y:' + 145*this.bli + ';', {f:this.dom['f7'], text: '姓名' })
        this.dom['r3_3'] = new Dom('allPage', 'font', 'class:gguan;color:#804727;font:12px 微软雅黑;textalign:center;x:' + (726*this.bli-172*this.bli) + ';y:' + 185*this.bli + ';', {f:this.dom['f7'], text: '4步' })

        this.dom['fxbtn'] = new Dom('allPage', 'img', 'class:gguan;src:i/btn-jixu.png;width:'+330*this.bli+';height:'+112*this.bli+';x:' + ((this.ww) / 2 - 360*this.bli) + ';y:' + (1194 *this.bli) + ';', { click: function () { that.kJB50() } })
        this.dom['xxbtn'] = new Dom('allPage', 'img', 'class:gguan;src:i/btn-re.png;width:'+330*this.bli+';height:'+112*this.bli+';x:' + ((this.ww) / 2 + 30*this.bli) + ';y:' + (1194 *this.bli) + ';', { click: function () { that.del('gguan'); that.restart('play') } })

        this.dom['fxbtn2'] = new Dom('allPage', 'img', 'class:gguan;src:i/btn-top.png;width:'+330*this.bli+';height:'+112*this.bli+';x:' + ((this.ww) / 2 - 360*this.bli) + ';y:' + (1194 *this.bli) + ';', { click: function () { that.restart('play') } })
        this.dom['xxbtn2'] = new Dom('allPage', 'img', 'class:gguan;src:i/btn-rest.png;width:'+330*this.bli+';height:'+112*this.bli+';x:' + ((this.ww) / 2 + 30*this.bli) + ';y:' + (1194 *this.bli) + ';', { click: function () { that.restart('play')}});

        that.altGGHide();
        this.iniDoms();		
    }
	play_gohome(){
		let that = this;
		if (this.buShu > 0 && this.deFen > 0){		
			wx.showModal({
				title:'退出游戏',
				content:'游戏还在继续，确认退出将不记录此局得分，继续请点【确定】',
				confirmText:'确定',
				success:function(t){
					if(t.confirm){
						that.restart();
					}
				}
			});
		}else {
			that.restart();
		}
	}
    ts_qouz(usN, usP) {//求助提示
        if (this.bTS) {
            this.gDDN = false;
            wx.showToast({ title: '已经有提示' });
            return;
        }
        let that = this;
        this.dom.tsbg = new Dom('index', 'img', 'class:qouz;src:i/1.png;width:' + this.ww + ';height:' + this.wh + ';x:0;y:0;', { click: function () { } });

		this.dom.ddbg = new Dom('index', 'img', 'class:qouz;src:i/qz.png;width:' + 749*this.bli + ';height:' + 780*this.bli + ';x:'+(this.ww-749*this.bli)/2+';y:'+323*this.bli+';', { click: function () { } });
		this.dom.ddai = new Dom('index', 'img', 'class:qouz;src:i/qzdd.png;width:' + 718*this.bli + ';height:' + 288*this.bli + ';x:' + (this.ww - 718*this.bli) / 2 + ';y:' + 562*this.bli + ';', { click: function () { } });
		this.dom.ddai2 = new Dom('index', 'img','class:qouz;src:i/qzok.png;width:' + 718*this.bli + ';height:' + 113*this.bli + ';x:' + (this.ww - 718*this.bli) / 2 + ';y:' + 677*this.bli + ';', { click: function () { } });

		this.dom.ddz  = new Dom('index', 'img', 'class:qouz;z:50;src:i/zzz.png;width:' + 166*this.bli + ';height:' + 166*this.bli + ';x:' + (this.ww-166*this.bli)/2 + ';y:' + 335*this.bli + ';', { click: function () { } });
        this.dom.ddtx = new Dom('index', 'img', 'class:qouz;src:i/123.jpg;yuan:' + 83*this.bli + ';width:' + 166*this.bli + ';height:' + 166*this.bli + ';x:' + (this.ww-166*this.bli)/2 + ';y:' + 335*this.bli + ';', { click: function () { } });
        this.dom.ddNA = new Dom('index', 'font', 'class:qouz;color:#703B0F;font:bold 22px sans-serif;valign:top;textalign:center;x:' + (this.ww / 2) + ';y:' + 555*this.bli + ';', { text: '' })
		this.dom.ddwz = new Dom('index', 'font', 'class:qouz;color:#333;font:26px sans-serif;valign:middle;textalign:center;x:' + (this.ww / 2) + ';y:' + 417*this.bli + ';', { text: '31' })
        this.dom.ddbtn = new Dom('index', 'img', 'class:qouz;src:i/btn-bdl.png;width:' + 329*this.bli + ';height:' + 111*this.bli + ';x:' + (this.ww-329*this.bli)/2 + ';y:' + 913*this.bli + ';', { click: function () { that.gDDN = false; that.del('qouz'); } });



        this.gDDN = false;
        that.dom.ddtx.dis = false; that.dom.ddNA.dis = false;
        that.dom.tsbg.dis = false; that.dom.ddai.dis = false;
        that.dom.ddz.dis = false; that.dom.ddwz.dis = false;
		that.dom.ddai2.dis = false;
        if (usN == '') {
            this.bTS = false;
            this.gDDN = true;
            //this.dom.ddai.sSrc('i/qzdd.png');
            this.dom.ddbtn.sSrc('i/btn-bdl.png');
            this.dom.ddtx.dis = false; this.dom.ddNA.dis = false;
            this.dom.tsbg.dis = true; this.dom.ddai.dis = true;
            this.dom.ddz.dis = true; this.dom.ddwz.dis = true;
            this.gDD(31);
        } else {
            this.gDDN = false;

			this.dom.ddai.dis = false;

            //this.dom.ddai.sSrc('img/qzdd.png');
            this.dom.ddbtn.sSrc('i/btn-continue.png');
            this.dom.ddtx.sSrc(usP);
            this.dom.ddNA.attr.text = usN;
			that.dom.ddai2.dis = true;
            this.dom.ddtx.dis = true; this.dom.ddNA.dis = true;
            this.dom.tsbg.dis = true; this.dom.ddbtn.dis = true;
            this.dom.ddz.dis = false; this.dom.ddwz.dis = false;
            this.bTS = true;
        }
        this.iniDoms();
    }
    iniDoms() {
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
            if (n % 2 == 0) {
                this.post({ act: 'bDD', n: n, qz: this.qzTime }, function (t) {
                    if (null !== t.qz && undefined !== t.qz.bname && t.qz.bname != '') {
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


        let fxt = that.config.CY_fxTxt[0];
        let fxi = that.config.CY_fxImg;

        if (i == 1) {
            fxt = that.config.CY_qzTxt;
            fxi = that.config.CY_qzImg;
        }
        p('分享参数： ' + that.config.CY_fxCS == '' ? 'qz=' + that.qzTime : that.config.CY_fxCS + '&qz=' + that.qzTime);
        wx.shareAppMessage({
            title: fxt,
            imageUrl: fxi,
            query: that.config.CY_fxCS == '' ? 'qz=' + that.qzTime : that.config.CY_fxCS + '&qz=' + that.qzTime,
            withShareTicket: true,
            success: function (t) {
                //o.getQunRankInfo(t.shareTickets[0]), r.onClose() 
                if (i == 1) {
                    that.ts_qouz('', '');
                    //that.ddShow('', '');
                    //that.fxTS(t);
                }
            }
            , fail: function (t) {
                console.log("match share failed >>>>>>>>>>")
            }
        });
        if (i == 1 && window.navigator.platform == 'devtools') {
            that.ts_qouz('', '');
        }
        p('进了 fx');

    }
    altGG(fen) {
        this.ts_gg();
		this.dom['f3'].attr.text = ''+fen;
		if (this.us.ggnum > fen){
			this.dom['zgf'].attr.text = '最高分：'+this.us.ggnum;
		}else {	
			this.us.ggnum = fen;
			this.dom['zgf'].attr.text = '最高分：'+fen;
		}
        fen = parseInt(fen)
        let xbu = this.arO.length;
        this.dom['f6_2'].attr.text = '排行榜>>';

        let ar = 'altBG1,altBG2,f1,lihai,f4,f5,f6,f6_2,f7'.split(',');
        for (var i = 0; i < ar.length; i++) {
            this.dom[ar[i]].dis = true;
        }

        ar = 'r1_1,r1_t,r1_2,r1_3,r2_1,r2_t,r2_2,r2_3,r3_1,r3_t,r3_2,r3_3,fxbtn2,xxbtn2'.split(',');
        for (var i = 0; i < ar.length; i++){
            this.dom[ar[i]].dis = false;
        }
		this.dom['f1'].attr.text = '大师' + this.ThisGG + '级 第' + this.ThisGK + '关';


            //this.dom['f1'].attr.text = '大师' + this.ThisGG + '级 通关';
            this.dom['f6_2'].attr.y = 1100*this.bli+this.liuhai;
            this.dom['f6'].attr.y = 1070*this.bli+this.liuhai;

                ar = 'f4,f5,f7,f1'.split(',');
                for (var i = 0; i < ar.length; i++) {
                    this.dom[ar[i]].dis = false;
                }


        this.post({ act: 'upGK',dfen: fen}, function (t) { });
    }
    altGGHide() {
        let ar = 'altBG1,altBG2,f1,f4,f5,f6,f6_2,f7,r1_1,r1_t,r1_2,r1_3,r2_1,r2_t,r2_2,r2_3,r3_1,r3_t,r3_2,r3_3'.split(',');
        for (var i = 0; i < ar.length; i++) {
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

    index() {
        this.iniBG();
        //this.indexBG(this.nX, this.nY);
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

	djTS(){	//操作提示

		if (this.djTS_Time>0 && this.us.ggnum<=0 && undefined === this.dom['tishibg']){
			 
			this.dom['tishibg'] = new Dom('play', 'img', 'class:djts;src:i/1.png;width:'+this.ww+';height:'+this.bli * 400+';x:0;y:' + (600 * this.bli) + ';', {click: function () { p(1); }});
			//this.dom['tishi'] = new Dom('play', 'font', 'color:#FFF;font:bold 35px 微软雅黑;textalign:left;x:' + (40*this.bli) + ';y:'+(206 * this.bli)+';', { text: '0' });
			this.dom['tishiwz1'] = new Dom('play', 'font', 'class:djts;color:#FFF;font:24px 微软雅黑;textalign:center;x:' + this.ww/2 + ';y:'+this.bli * 700+';', {text: '点击有数字的框格，里面的数字+1' });
			this.dom['tishiwz2'] = new Dom('play', 'font', 'class:djts;color:#FFF;font:24px 微软雅黑;textalign:center;x:' + this.ww/2 + ';y:'+this.bli * 800+';', {text: '三个以上一样的数字连一起' });
			this.dom['tishiwz3'] = new Dom('play', 'font', 'class:djts;color:#FFF;font:24px 微软雅黑;textalign:center;x:' + this.ww/2 + ';y:'+this.bli * 900+';', {text: '合成一个+1的格子' });
			this.iniDoms();
		}
		if (this.djTS_Time > 0){
			this.djTS_Time -= 1;
		}else if(undefined !== this.dom['tishibg']) {
			this.djTS_Time = 0;
			this.del('djts');
		}
				
	}
	endTS(){	//结束提示
		let that = this;
		if (undefined === this.dom['endts']){
			this.openD.postMessage({cmd:'echo',n:2,uid:this.config.uid,fen:this.deFen})
			this.dom['endts'] = new Dom('play', 'img', 'class:endts;src:i/1.png;width:'+this.ww+';height:'+this.wh+';x:0;y:0;', {click: function () { p(1); }});
			this.dom['endts1'] = new Dom('play', 'img', 'class:endts;src:i/s/t1.png;width:'+565*this.bli+';height:'+151*this.bli+';x:'+218*this.bli+';y:'+151*this.bli+';');
			this.dom['endts2'] = new Dom('play', 'font', 'class:endts;color:#FFF;font:35px 微软雅黑;textalign:center;x:' + this.ww/2 + ';y:'+this.bli * 383+';', {text: this.deFen+'分' });
			if (that.fhVNUM > 0){
				this.dom['endts21'] = new Dom('play', 'img', 'class:endts;src:i/s/btn4.png;width:'+533*this.bli+';height:'+161*this.bli+';x:'+(this.ww/2-533/2*this.bli)+';y:'+684*this.bli+';',{click:function(){that.fhVNUM-=1;that.fhVAD=true;that.vad();}});
			}
			this.dom['endts3'] = new Dom('play', 'img', 'class:endts;src:i/s/btn3.png;width:'+533*this.bli+';height:'+161*this.bli+';x:'+(this.ww/2-533/2*this.bli)+';y:'+887*this.bli+';',{click:function(){p('钻石复活'); that.kJB50()}});
			this.dom['endts4'] = new Dom('play', 'font', 'class:endts;color:#FFF;underline:2;font:18px 微软雅黑;textalign:center;x:' + this.ww/2 + ';y:'+this.bli * 1121+';', {text: '点击跳过>>',click: function () {that.del('endts');that.endPHTS();}});
			this.iniDoms();
		}
	}
	endPHTS(){	//结束提示
		let that = this;
		if (undefined === this.dom['endphts']){
			this.openD.postMessage({cmd:'echo',n:3,uid:this.config.uid,fen:this.deFen,time:this.now()})
			this.dom['endphts'] = new Dom('play', 'img', 'class:endphts;src:i/1.png;width:'+this.ww+';height:'+this.wh+';x:0;y:0;', {click: function () { p(1); }});
			this.dom['endphts1'] = new Dom('play', 'img', 'class:endphts;src:i/s/t2.png;width:'+565*this.bli+';height:'+151*this.bli+';x:'+218*this.bli+';y:'+151*this.bli+';');
			this.dom['endphts2'] = new Dom('play', 'font', 'class:endphts;color:#FFF;font:35px 微软雅黑;textalign:center;x:' + this.ww/2 + ';y:'+this.bli * 383+';', {text: this.deFen+'分' });

			this.dom['endphts3'] = new Dom('play', 'img', 'class:endphts;src:i/s/k.png;width:'+880*this.bli+';height:'+503*this.bli+';x:' + (this.ww/2-440*this.bli) + ';y:'+this.bli * 459+';');

			this.dom['endphts41'] = new Dom('play', 'font', 'class:endphts;color:#000;font:16px 微软雅黑;textalign:left;x:' + 101*this.bli + ';y:'+this.bli * 519+';', {text: '排行榜' });
			this.dom['endphts42'] = new Dom('play', 'font', 'class:endphts;underline:1;color:#000;font:16px 微软雅黑;textalign:center;x:' + 760*this.bli + ';y:'+this.bli * 519+';', {text: '查看完整排行>>',click:function(){that.restart('order')}});

			this.dom['endphts5'] = new Dom('play', 'font', 'class:endphts;color:#FFF;font:16px 微软雅黑;textalign:center;x:' + this.ww/2 + ';y:'+this.bli * 1022+';', {text: '历史最高分 '+(undefined===this.us.ggnum?0:(this.deFen>this.us.ggnum?this.deFen:this.us.ggnum)) });

			this.dom['endphts6'] = new Dom('play', 'img', 'class:endphts;src:i/s/btn1.png;width:'+480*this.bli+';height:'+130*this.bli+';x:'+(this.ww/2-240*this.bli)+';y:'+1080*this.bli+';',{click:function(){that.fx()}});
			this.dom['endphts7'] = new Dom('play', 'img', 'class:endphts;src:i/s/btn2.png;width:'+480*this.bli+';height:'+130*this.bli+';x:'+(this.ww/2-240*this.bli)+';y:'+1248*this.bli+';',{click:function(){that.del('endphts');that.restart('play')}});
			this.iniDoms();
		}
		this.post({ act: 'upGK',dfen:this.deFen}, function (t) {if(undefined!==t.fen){that.us.ggnum=t.fen;p(t.fen)}});
	}

    play() {
        this.iniBG();

		//this.dom[-1] = new Dom('play', 'img', 'src:i/k.png;width:'+this.bli * 945+';height:'+this.bli * 955+';x:' + ((1000-915-30) * this.bli)/2 + ';y:' + (284 * this.bli-15*this.bli) + ';')

        this.playBG(this.nX, this.nY);
        this.playDraw();

        for (var dm in this.dom) {
			if (this.dom[dm].attr.del){
				delete this.dom[dm];
				this.iniDoms();
			}else {			
				this.dom[dm].w();
			}
        }
		
		this.djTS();
		//this.endTS();
		//this.endPHTS();
		


		//开放数据域
		ctx.scale(0.5,0.5);
		ctx.drawImage(this.shVas, 0, 0);
		ctx.scale(2,2);

        if (!this.hasEventBind) {
            this.hasEventBind = true
            this.touchHandler = this.playClick.bind(this);
            this.touchMVHandler = this.playMove.bind(this);
			this.touchEDHandler = this.playEnd.bind(this);
            canvas.addEventListener('touchmove', this.touchMVHandler);
            canvas.addEventListener('touchstart', this.touchHandler);
			canvas.addEventListener('touchend', this.touchEDHandler);
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
					if (undefined !== that.dom.jbs){
						that.dom.jbs.attr.text = d.jbi;
					} 
                }
                if (d.code == 200) {
                    wx.showToast({ title: '成功扣50'+that.jinBi });
                    that.bTS = true;
                } else {
                    wx.showToast({ title: that.jinBi+'不足', image: 'img/tips.png' });
                }
            })
        } else {
            wx.showToast({ title: that.jinBi+'不足', image: 'img/tips.png' });
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
    iniBG() {

        if (this.adHeight == 0 && undefined !== this.bannerAd) {
            if (undefined !== this.bannerAd.style.realHeight) {
                this.adHeight = this.bannerAd.style.realHeight;
                this.bannerAd.style.top = this.wh - this.adHeight;
            }
        }

        ctx.clearRect(0, 0, this.ww, this.wh);
        //ctx.fillStyle = '#7B459D';
        //ctx.fillRect(0, 0, this.ww, this.wh);


		if(this.now() - this.adTime > this.jgTime){
			this.adTime = this.now();
			this.timeJG();
		}

        ctx.closePath();
        ctx.restore();
        for (var dm in this.dombg) {
            this.dombg[dm].w();
        }
    }

    playDraw() {
        ctx.globalAlpha = 1;
        ctx.save();
		ctx.lineJoin="miter";
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
            if (undefined === this.PlayArO[i]) {
                break;
            }
            if (this.PlayArO[i][0][3] < 0) {
                ctx.globalAlpha = 1;
                ctx.lineWidth = this.lineWidth;
            } else {
                ctx.globalAlpha = 1;
                ctx.lineWidth = this.lineWidth;
            }
            //ctx.save();
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

        /*for (var i = 0; i < this.PlayArO.length; i++) {
            if (undefined === this.PlayArO[i]) {
                break;
            }
            if (this.PlayArO[i].length > 0) {
                var x1 = this.PlayArO[i][0][0];
                var y1 = this.PlayArO[i][0][1];

                this.d(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy'], this.aPos[x1][y1]['d1'], this.aColor[this.PlayArO[i][0][2]]);
            }
        }*/
        ctx.globalAlpha = 1;

    }

	iniTong(){	//初始未检测状态
		for (var a1 in this.aPos) {
			for (var a2 in this.aPos[a1]) {
				this.dom['gz'+a1+'_'+a2].ckTong = false;
			}
		}
	}
	ckHasDong(){	//有在动的元素
		for (var a1 in this.aPos) {
			for (var a2 in this.aPos[a1]) {
				if (undefined !==this.dom['gz'+a1+'_'+a2] && ((!this.dom['gz'+a1+'_'+a2].attr.del && this.dom['gz'+a1+'_'+a2].shanDong) || this.dom['gz'+a1+'_'+a2].xiaLuo || this.dom['gz'+a1+'_'+a2].fangDa)){	//有在闪和下落
					return true;
				}
			}
		}
		return false;
	}
	ckXX(x,y){		//p('检测一样的消除');
		//p('测');
		if (this.ckHasDong()){
			return false;
		}
		
		if(this.buildPos.length>0){
			for (var x in this.buildPos){
				this.buildNum(this.buildPos[x][0], this.buildPos[x][1], this.buildPos[x][2], 0);
			}
			this.buildPos = [];
			this.iniDoms();
			p('has buildPos ');
		}		
		if(!this.ckKong()){	//有下降操作
			return;
		}
		if (undefined ===x){
			for (var a1 in this.aPos) {
				for (var a2 in this.aPos[a1]) {
					this.iniTong();
					//p([a1,a2]);
					this.xtPos = [[a1,a2],];
					this.dom['gz'+a1+'_'+a2].ckTong= true;
					this.ck4Z(a1,a2,this.dom['gz'+a1+'_'+a2].attr.text);
					if(this.shanDong(this.dom['gz'+a1+'_'+a2].attr.text)){	//有
						this.setJiHui(this.buShu+1);
						return;
					}
				}
			}
		}else if(undefined!==this.dom['gz'+x+'_'+y]) {
			this.iniTong();
			this.xtPos = [[x,y],];
			this.dom['gz'+x+'_'+y].ckTong= true;
			this.ck4Z(x,y,this.dom['gz'+x+'_'+y].attr.text);
			if(!this.shanDong(this.dom['gz'+x+'_'+y].attr.text, x, y)){
				this.setJiHui(this.buShu-1);
			}
		}
	}

	ckXia(pos){	//判断下降
		let re = false;
		let ay  = {};
		let ayx = {}; //最小的点
		for (var po in pos){
			if (undefined === ay[pos[po][1]]){
				ay[pos[po][1]] = 1;
				ayx[pos[po][1]]= parseInt(pos[po][0]);
			}else {
				ay[pos[po][1]] += 1;
				if (pos[po][0] < ayx[pos[po][1]]){
					ayx[pos[po][1]]= parseInt(pos[po][0]);
				}
			}
		}
		for (var x in ayx){
			if (ayx[x] > 0){
				for (var i=ayx[x]-1; i>=0; i--){
					let d = this.dom['gz'+i+'_'+x];
					//p(d.xiaLuo)
					if (undefined !== d && !d.xiaLuo){
						//p(this.aPos[x][i+ay[x]]['y']);
						d.xiaLuo     = true;
						d.xiaLuoSD   = 10;
						d.xiaLuoY    = this.aPos[i+ay[x]][x]['y'];
						d.xiaLuoHouX = i+ay[x] ;
						d.xiaLuoHouY = parseInt(x);
						//p(d);

						//p(i + ' - - ' + i+ay[x])
						re = true
					}
				}
			}
		}

		//return true;
		//p(ax); p(ay); p(ayx);
		return re;
	}
	ckKong(){	//判断空 下降
		let kongPos = [];
		for (var a1 in this.aPos) {
			for (var a2 in this.aPos[a1]) {
				if (undefined === this.dom['gz'+a1+'_'+a2]){
					kongPos.push([a1,a2]);
				}else if(this.dom['gz'+a1+'_'+a2].attr.del){
					delete this.dom['gz'+a1+'_'+a2];
					kongPos.push([a1,a2]);
				}
			}
		}
		if (kongPos.length == this.nX*this.nY){	//初始
			//let axx = '4,4,2,2,4,3,2,1,1,3,2,6,1,2,1,3,2,2,5,3,2,5,3,2,2'.split(',')
			//let nn = 0;
			for (var kp in kongPos){
				this.buildNum(kongPos[kp][0],kongPos[kp][1],null,0,4);
				//this.buildNum(kongPos[kp][0],kongPos[kp][1],axx[nn++],0,4);
			}
			this.iniDoms();
		}else if (kongPos.length>0){	//先判断下降
			if(this.ckXia(kongPos)){	//有下载
				return false;
			}else {
				for (var kp in kongPos){
					this.buildNum(kongPos[kp][0],kongPos[kp][1],null,1);
				}
				this.iniDoms();
				this.ckXX();
			}
		}
		return true;
		//if (ini){ //有新添加，判断有没相同
			//this.iniDoms();
			//this.ckXX();
		//}	
	}

	setDeFen(n,num){	 //修改得分
		this.deFen += (n * 10 *num);
		this.dom['jiaFen'+(this.jiaFenNum++)] = new Jfen('play', 'font', 'color:#FFF;font:18px 微软雅黑;textalign:left;x:' + 40*this.bli + ';y:'+200 * this.bli+';', { text: '+'+(n * 10 *num)});
		this.iniDoms();

		this.openD.postMessage({cmd:'echo',n:1,uid:this.config.uid,fen:this.deFen});

		this.dom[1].attr.text = this.deFen;
		this.dom[2].attr.text = this.deFen;
	}
	kJB50(){
        var that = this;
        if (this.us.jbi >= 50) {
            that.post({ act: 'kbi' }, function (d) {
                if (undefined != d.jbi) {
                    that.us.jbi = d.jbi;
					if (undefined !== that.dom.jbs){
						that.dom.jbs.attr.text = d.jbi;
					} 
                }
                if (d.code == 200) {
                    wx.showToast({ title: '成功扣50'+that.jinBi });
					that.setJiHui(5);
					that.del('gguan');
					that.del('endts');
                } else {
                    wx.showToast({ title: that.jinBi+'不足', image: 'img/tips.png' });
                }
            })
        } else {
            wx.showToast({ title: that.jinBi+'不足', image: 'img/tips.png' });
        }
	}
	setJiHui(n){	//修改机会
		if (n <= 0){
			this.endTS();
			//this.altGG(this.deFen);  //end
			return;
			n = 0;
		}else if(n>5){
			n = 5;
		}
		this.buShu = n;

		for (var i=1; i<=5; i++){
			if (i<=n){
				this.dom['x'+i].dis = true;
			}else {
				this.dom['x'+i].dis = false;
			}
		}

		//this.dom[3].attr.text = '机会 : ' + this.buShu;
	}
	shanDong(m, x, y){
		m = parseInt(m)
		if(this.xtPos.length<3){
			let snum = '';
			for (var a1 in this.aPos) {
				for (var a2 in this.aPos[a1]) {
					snum+=','+this.dom['gz'+a1+'_'+a2].attr.text;
				}
			}
			p(snum)
			return false;
		}

		if (undefined === x){
			x = parseInt(this.xtPos[0][0]);
			y = parseInt(this.xtPos[0][1]);
		}
		for (var n in this.xtPos){
			if (!(this.xtPos[n][0]==x && this.xtPos[n][1]==y)){
				this.dom['gz'+this.xtPos[n][0]+'_'+this.xtPos[n][1]].shanDong = true;
			}
		}

		//直接生成一个+1的格子
		let d = this.dom['gz'+x+'_'+y]; //判断是不是要下降
		let xlx = 0;
		//p('xlx - '+x);
		for (var i=x+1; i<this.nX; i++){
			if (undefined === this.dom['gz'+i+'_'+y] || this.dom['gz'+i+'_'+y].shanDong){
				xlx = i;
			}else {
				break;
			}
		}
		//p('xlx ----- '+xlx);
		d.attr.text = parseInt(d.attr.text) + 1;
		d.setColor(d.attr.text);
		if (xlx > 0 && undefined !== this.aPos[xlx]){
			d.xiaLuoSD   = 5;
			d.xiaLuo     = true;
			d.xiaLuoY    = this.aPos[xlx][y]['y'];
			d.xiaLuoHouX = xlx;
			d.xiaLuoHouY = y;

			//d.attr.width = this.nX;
			//d.attr.height= this.nY;
			//d.shanDong   = false;

		}else {	
			p('没下落');			
			d.attr.width = this.nX;
			d.attr.height= this.nY;
			
			d.attr.x = this.aPos[x][y]['x'];
			d.attr.y = this.aPos[x][y]['y'];

			d.attr.fangda = true
			d.setFangDa();

		}
		


		//this.buildNum(x, y, parseInt(d.attr.text)+1, 1);
		//this.dom['gz'+x+'_'+y] = new Number('number', 'div', 'background:#FEFAEF;border:#FEFAEF;color:#FFF;textalign:center;width:' + this.Fx + ';radius:5;height:' + this.Fy + ';x:'+this.aPos[x][y]['x']+';y:'+this.aPos[x][y]['y'] +';ax:'+x+';ay:'+y+';',{text:parseInt(d.attr.text)+1, fangda:true},this);

		//this.dom[4].attr.text = this.xiaoMC+'连击';
		//if (this.xiaoMC >= 3){
			//this.dom[4].attr.opacity = 1;
			this.dom[4].setNum(this.xiaoMC)
		//}
		

		this.setDeFen(m,this.xtPos.length)
		this.music.xxYin(this.xiaoMC,this.syin);
		this.xiaoMC += 1;
		return true;
	}
	xcMusic(){	//消除的声音
		//this.xiaoMC
	}
	ck4Z(x,y,n){		//检测4周有一样的不
		x = parseInt(x);
		y = parseInt(y);
		//左
		let d = '';
		if (y > 0){
			d = 'gz'+x+'_'+(y-1);
			//p('左 '+d);
			if(!this.dom[d].ckTong && this.dom[d].attr.text == n){
				//p('左一样');
				this.xtPos.push([x, y-1]);
				this.dom[d].ckTong = true;
				this.ck4Z(x, y-1,n)
			}else {
				this.dom[d].ckTong = true;
			}
		}
		

		//右
		if (y < this.nX-1){
			d = 'gz'+x+'_'+(y+1);
			//p( '右 '+d);
			if(!this.dom[d].ckTong && this.dom[d].attr.text == n){
				//p('右一样');
				this.xtPos.push([x, y+1]);
				this.dom[d].ckTong = true;
				this.ck4Z(x, y+1,n)
			}else {
				this.dom[d].ckTong = true;
			}
		}

		//上
		if (x > 0){
			d = 'gz'+(x-1)+'_'+y;
			//p('上 '+d)
			if(!this.dom[d].ckTong && this.dom[d].attr.text == n){
				//p('上一样');
				this.xtPos.push([x-1, y]);
				this.dom[d].ckTong = true;
				this.ck4Z(x-1, y,n)
			}else {
				this.dom[d].ckTong = true;
			}
		}

		//下
		if (x < this.nY-1){
			d = 'gz'+(x+1)+'_'+y;
			//p('下 '+d)
			if(!this.dom[d].ckTong && this.dom[d].attr.text == n){
				//p('下一样');
				this.xtPos.push([x+1, y]);
				this.dom[d].ckTong = true;
				this.ck4Z(x+1, y,n)
			}else {
				this.dom[d].ckTong = true;
			}
		}
	}
	buildNum(a1,a2,n,m, nk){		//mk用来判断 输出的难度
		//let dm = this.dom['gz'+a1+'_'+a2];
		//if (undefined!==dm && (!dm.dis || dm.shanDong)){
		//	return;
		//}
		


		let d={};
		let nBG = 1;
		if (undefined !== n && n > 0){
			d={text:n}
			nBG = n;
		}else if (undefined!==nk && nk > 0){
			//p('判断 方向+'+nk);
			a1 = parseInt(a1);
			a2 = parseInt(a2);
			let ar = [[(a1-1)+'_'+a2], [(a1+1)+'_'+a2], [a1+'_'+(a2-1)], [a1+'_'+(a2+1)]];
			let an = [],ak = [];
			for (var k in ar){
				if (nk<=an.length){
					break;
				}
				if (undefined != this.dom['gz'+ar[k]]){
					an.push(parseInt(this.dom['gz'+ar[k]].attr.text));
				}
			}
			//p(an);
			for (var i=1; i<=5; i++){
				let has = false;
				for (var j=0; j<an.length; j++){
					if (i==an[j]){
						has = true;
						break;
					}
				}
				if (has){
					continue;
				}
				ak.push(i);
			}
			n = ak[this.rand(0,ak.length)];
			d={text:n};
			nBG = n;
		}

		if (undefined !== m && m == 1){
			d.fangda = true;
		}
		this.dom['gz'+a1+'_'+a2] = new Number('number', 'div', 'background:#013858;bgimg:i/n'+nBG+'.png;color:#FFF;textalign:center;width:' + this.Fx + ';height:' + this.Fy + ';x:'+this.aPos[a1][a2]['x']+';y:'+this.aPos[a1][a2]['y'] +';ax:'+a1+';ay:'+a2+';',d,this);
	}

    playClick(e) {
        e.preventDefault();
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
		let dong = this.ckHasDong();
        for (var i = this.doms.length - 1; i >= 0; i--) {
			if (dong && /^gz/.test(this.doms[i])){
				continue;
			}
			
            if (this.dom[this.doms[i]].dis && this.dom[this.doms[i]].dis && this.dom[this.doms[i]].attr.click) {
                var dom1 = this.dom[this.doms[i]];
                var kz = 0;
                if (undefined != dom1.attr.r) {
                    var d = { x: dom1.attr.x, y: dom1.attr.y, r: dom1.attr.r }
                } else {
					if (undefined!==dom1.attr.d_x){	//font定义了此值记录坐标
						var d = { x: dom1.attr.d_x, y: dom1.attr.d_y, width: dom1.attr.width, height: dom1.attr.height }
					}else {					
						var d = { x: dom1.attr.x, y: dom1.attr.y, width: dom1.attr.width, height: dom1.attr.height }
					}
                }
                if (undefined != dom1.attr.f) {
                    d.x = dom1.attr.f.attr.x + d.x;
                    d.y = dom1.attr.f.attr.y + d.y
                }
                if (undefined != dom1.attr.line && dom1.attr.line > 1) {
                    kz = parseInt(dom1.attr.line / 2);
                }

                if (this.inQ(x, y, d, kz)) {
					this.music.ck(this.syin);
					p('中了'+this.doms[i]);
                    this.dom[this.doms[i]].attr.click(this.dom[this.doms[i]]);
                    break;
                }
            }
        }
    }


    playBG(x, y) {
        let kw = 960 * this.bli;
        let kh = 927 * this.bli;
    }
    indexBG(x, y) {
        let kw = this.ww - this.bk;
        let kh = this.wh / 2.3 - this.bk;

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
            //ctx.save();
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
        for (let i = 0; i < this.arO.length; i++) {
            if (this.arO[i].length > 0) {
                let x1 = this.arO[i][0][0];
                let y1 = this.arO[i][0][1];
                this.d(this.aPos[x1][y1]['ox'], this.aPos[x1][y1]['oy'], this.aPos[x1][y1]['d2'], this.aColor[i]);
                if (this.arO[i].length > 1) {
                    let x2 = this.arO[i][this.arO[i].length - 1][0];
                    let y2 = this.arO[i][this.arO[i].length - 1][1];
                    this.d(this.aPos[x2][y2]['ox'], this.aPos[x2][y2]['oy'], this.aPos[x2][y2]['d1'], this.aColor[i]);
                }
            }
        }
    }

    gc(k, n) {
        if (undefined === wx.getStorageSync(k)) {
            if (undefined !== n) {
                return n;
            } else {
                return '';
            }
        }
        return wx.getStorageSync(k);
    }
    sc(k, v) {
        wx.setStorageSync(k, v);
    }

    post(q) {
        let that = this;
        let n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function () { };
        q['phpsessid'] = this.gc("phpsessid");
        wx.request({
            url: this.sUrl, data: q, method: "POST", header: { "content-type": "application/x-www-form-urlencoded" },
            success: function (a) {
                if (a.statusCode == 200) {
                    n(a.data);
                    if (a.data.phpsessid != undefined) {
                        that.sc("phpsessid", a.data.phpsessid);
                    }
                } else {
                    p('request error url:' + this.sUrl + ' code:' + a.statusCode)
                }
            },
            fail: function (e) { p('request error' + e); }
        })
    }
    posXY(x, y, kh) {
		let jx = 30;
        let xx = ((this.ww - 2 * this.bk-jx/2*this.bli) / y);
        let yy = ((kh-jx/2*this.bli) / x);
        this.Fx = (xx- jx/2*this.bli); 
        this.Fy = (yy- jx/2*this.bli);
        this.Fr = ((xx > yy ? xx : yy) / 2);
		this.lineWidth = xx / 3
        let pos = {}
        for (let j = 0; j < x; j++) {
            let posx = {}
            for (let i = 0; i < y; i++) {
                //if ((i + 1) % 2 != 0 || (j + 1) % 2 != 0) {
                let x1 = (this.bk + (i + 1) * xx);
                let y1 = (this.tp + (j + 1) * (yy));
                posx[i] = { 'x': parseInt(x1 - xx)+jx/2*this.bli, 'y': parseInt(y1 - yy)+jx/2*this.bli, 'd2': xx / 10, 'line': xx / 12, 'o': 0, 'ox': x1 - xx / 2, 'oy': y1 - yy / 2, 't': 0 };
                //}
            }
            pos[j] = posx;
        }
        this.aPos = pos;
    }
    d(x, y, r, color) {
        //ctx.save();
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

        //ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#FFF';
        ctx.arc(x, y, r + 3, 0, 2 * Math.PI);
        ctx.stroke();

        //ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
        ctx.stroke();
    }
    fxTS(t) {
        p('分享后：');
        p(t)
        if (undefined === t.shareTickets) {
            wx.showToast({ title: '请分享到群', image: 'img/tips.png' });
        } else {
            let that = this;
            wx.getShareInfo({
                shareTicket: t.shareTickets[0],
                success: function (t) {
                    p(t);
                    //that.bTS = true;
                    that.post({ act: 'fxTS', encryptedData: t.encryptedData, iv: t.iv }, function (d) {
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
        this.moveDom = {};
        this.clickDom = {};
        this.clickPos = { x: x, y: y };
        for (var i = this.doms.length - 1; i >= 0; i--) {
            if (this.dom[this.doms[i]].dis && (this.dom[this.doms[i]].attr.click || this.dom[this.doms[i]].attr.mousemove)) {
                var dom1 = this.dom[this.doms[i]];
                var kz = 0;
                if (undefined != dom1.attr.r) {
                    var d = { x: dom1.attr.x, y: dom1.attr.y, r: dom1.attr.r, width: 0, height: 0 }
                } else {
					if (undefined!==dom1.attr.d_x){	//font定义了此值记录坐标
						var d = { x: dom1.attr.d_x, y: dom1.attr.d_y, width: dom1.attr.width, height: dom1.attr.height }
					}else {					
						var d = { x: dom1.attr.x, y: dom1.attr.y, width: dom1.attr.width, height: dom1.attr.height }
					}
                }
                if (undefined != dom1.attr.f) {
                    let o = dom1;
                    while (true) {
                        d.x += o.attr.f.attr.x;
                        d.y += o.attr.f.attr.y;
                        if (undefined === o.attr.f.attr.f) {
                            break;
                        } else {
                            o = o.attr.f;
                        }
                    }
                }
                if (undefined != dom1.attr.line && dom1.attr.line > 1) {
                    kz = parseInt(dom1.attr.line / 2);
                }
                if (this.inQ(x, y, d, kz)) {
                    if (d.height != this.wh && !this.dom[this.doms[i]].attr.mousemove && this.dom[this.doms[i]].attr.clickSY) {
                        
                    }
                    if (this.dom[this.doms[i]].attr.mousemove) {
                        p('点了moveDom ' + this.doms[i]);
                        this.moveDom = this.dom[this.doms[i]];
                    } else {
                        p('点了clickDom ' + this.doms[i]);
						this.music.con(this.syin);
                        this.clickDom = this.dom[this.doms[i]];
                        this.dom[this.doms[i]].attr.click(this.dom[this.doms[i]]);
                    }
                    break;
                }
            }
        }
    }
    playMove(e) {
        e.preventDefault()
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
    }
	playEnd() {
		p('放手');
	}


    addPos(x1, y1, t) {		//t=1点，=2划过
		//this.ckLineOK();

		
    }

	ckColor(){	
		for (var a2 in this.arO[0]) {
			let has = false;
			for (var a3 in this.PlayArO[0]) {
				if(a3 > 0){
					let x = this.PlayArO[0][a3][0];
					let y = this.PlayArO[0][a3][1];
					if (x == this.arO[0][a2][0] && y == this.arO[0][a2][1]){
						this.dom['pos_'+x+'_'+y].sAttr(2);
						has = true;
						break;
					}
				}
			}
			if (!has){
				this.dom['pos_'+this.arO[0][a2][0]+'_'+this.arO[0][a2][1]].sAttr(0);
			}
		}
	}
    ckLineOK() {
        this.shanK = false;
        var that = this;

		let ckWan = false;
		if (this.PlayArO[0].length == this.arO[0].length){
			ckWan = true;
		}
		
		//p(this.PlayArO[0].length == this.arO[0].length);
        
        /*for (var a1 in this.aPos) {
            for (var a2 in this.aPos[a1]) {
                if (undefined === xx[a1 + '_' + a2]) {
                    ckWan = false;
                    this.aPos[a1][a2]['se'] = 0;
                } else {
                    this.aPos[a1][a2]['se'] = 1;
                }
            }
        }*/

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
            this.altGG(this.buShu, ((this.now_m() - this.MicroT) / 1000));
            //this.alt('恭喜过关', '用了' + this.buShu + '步，耗时' + ((this.now_m() - this.MicroT) / 1000) + '秒\n赢得此局胜利，继续下一关！')
            p('完整');
        }
    }


    getConfig(ck, arr) {
        let that = this;
        if (ck == 0 && this.now() - this.getConfigTime < 10) {
            return;
        }
        this.getConfigTime = this.now();

        //
        //if(this.local){
        //that.restart('order');
        //return
        //}

        p(' getConfig: ' + that.fid + ' + ' + that.qzt);
        if (!that.show) {	//第一次show必须先取来路参数
            wx.onShow(function (t) {
                p('from');
                p(t);
                if (undefined != t.query.fid) {
                    that.fid = t.query.fid;
                }
                if (undefined != t.query.qz) {
                    that.qzt = t.query.qz;
                }
                that.scene = t.scene;
                that.show = true;
                that.getConfig(1, arr)
            });
        } else {
			var css = { act: 'config', line: that.indArO.length, fid: that.fid, qzt: that.qzt, ver: 1.23 };
			if(undefined!==arr)
			for (var cs in arr){
				css[cs] = arr[cs];
			}
			
            this.post(css, function (a) {
                if (undefined!==a.config.app_btn_ad && a.config.app_btn_ad==1){
                    if (!that.app_btn_ad){                    
                        that.app_btn_ad = true;
                        if (undefined!==that.bannerAd){
                            that.bannerAd.destroy();
                        }
                        gAds(that.iniAdTu,that);
                    }
                }


                if (a.uid > 0) {
                    if (that.fid > 0) that.fid = 0;
                    if (that.qzt > 0) that.qzt = 0;
                }
				that.jgTime = a.config.jgTime;
				that.adID  = a.ad;
				if (that.adID != ''){
					that.ad();
				}
				
				that.vadID = a.vad;
                that.config = a.config;
                if (a.line != undefined) {
                    that.nX = a.line.h; that.nY = a.line.l;
                    that.nIX = a.line.h; that.nIY = a.line.l;
                    that.indArO = a.line.data;
                    that.arO = a.line.data;
                    that.posXY(that.nX, that.nY, (that.wh / 2.3 - that.bk));
                    //p(" that.config = ");
                    //p(a.config)
                    //that.restart();
                }
                for (let g in a.gka) {
                    that.gk[g] = a.gka[g];
                }
				if (undefined !== that.dom.v1){
					that.dom.v1.attr.text = '观看视频 +'+that.config.vadJB+that.jinBi;
				}
				if (undefined !== that.dom.v2){
					that.dom.v2.attr.text = '今日剩余次数 0/'+that.config.vadNum;
				}
                if (undefined !== a.us && undefined !== a.us.us_id) {
					
					if (undefined !== that.dom.v2){
						that.dom.v2.attr.text = '今日剩余次数 '+a.us.vadnum+'/'+that.config.vadNum;
					}					
					if (undefined !== that.dom.gguan){
						that.dom.gguan.attr.text = '最高得 '+a.us.ggnum+' 分';
					}
					
                    if (undefined !== that.start) that.start.hide();
                    p(a.us);
                    that.us = a.us;
                    that.dom.jbs.attr.text = a.us.jbi;
                }else {
					that.us.qd = [0,1];
				}
				//that.restart('play',4,4,1);
				
				//that.altGG(5, 1235)
				//that.restart('play');
            });
        }
    }

    oldGetUser() {
        let that = this; 
        wx.showLoading({ title: '更新中...' })
        wx.login({
            success: function (t) {
                wx.hideLoading();
                wx.getUserInfo({
                    success: function (e) {
                        that.post({
                            act: 'usLogin', fid: that.fid, qzt: that.qzt, scene: that.scene, data: e.rawData,
                            code: t.code, iv: e.iv, encryptedData: e.encryptedData
                        }, function (d) {
                            if (that.fid > 0) that.fid = 0;
                            if (that.qzt > 0) that.qzt = 0;
                            if (d.code == 200) {
                                if (d.config) {
                                    for (var k in d.config) {
                                        that.config[k] = d.config[k];
                                    }
                                }
                                that.us = d;
                                if (undefined !== that.dom.jbs && undefined !== that.dom.jbs.attr){
                                    that.dom.jbs.attr.text = d.jbi;
                                }
                                //that.music.con(that.syin);
                                //that.restart('level');
                            }
                        }, 'json');
                    }, fail: function (t) {
                        wx.showModal({
                            title: '请求授权',
                            content: '未授权，请先授权再继续游戏！',
                            showCancel:false,
                            complete: function (x) {
                                that.oldGetUser();
                            }
                        })
                    }
                })
            },
            fail: function (t) {
                p('fail');
                p(t);
                wx.showModal({
                    title: '请求授权',
                    content: '未授权，无法继续游戏',
                    showCancel: false,
                    complete: function (x) {
                        that.oldGetUser();
                    }
                })
                //that.oldGetUser();
            }, complete: function (t) {
                p('complete');
                p(t);
            }
        })
    }
    buildStartBtn() {
		if (!this.bStartBtn){
			return;
		}
		
        let that = this;
        if (undefined === wx.createUserInfoButton) {
            this.oldGetUser();
            return;
        }
        this.start = wx.createUserInfoButton({
            text: '',
            style: {
                left: 0,
                top: 0,
                width: this.ww,
                height: this.wh 
                //,lineHeight: 40,
                //,backgroundColor: '#ff0000'
                //color: '#ffffff',
                //textAlign: 'center',
                //fontSize: 16
                //,borderRadius: 4
            }
        });
        this.start.onTap((e) => {
            wx.showLoading({ title: '更新中...' })
            if (that.us.data != undefined && that.config.uid > 0) {
                wx.hideLoading();
                that.start.hide();
                //that.music.con(that.syin);
                //that.restart('level');
            } else {
                if (e.errMsg == 'getUserInfo:ok') {
                    //p('开始按扭');
                    //p(e);
                    wx.login({
                        success: function (t) {
                            that.post({
                                act: 'usLogin', fid: that.fid, qzt: that.qzt, scene: that.scene, data: e.rawData,
                                code: t.code, iv: e.iv, encryptedData: e.encryptedData
                            }, function (d) {
                                wx.hideLoading();
                                if (that.fid > 0) that.fid = 0;
                                if (that.qzt > 0) that.qzt = 0;
                                if (d.code == 200) {
                                    that.start.hide();
                                    if (d.config) {
                                        for (var k in d.config) {
                                            that.config[k] = d.config[k];
                                        }
                                    }
                                    that.us = d;
                                    if (undefined !== that.dom.jbs && undefined !== that.dom.jbs.attr) {
                                        that.dom.jbs.attr.text = d.jbi;
                                    }
									if (undefined !== that.dom.gguan){
										that.dom.gguan.attr.text = '最高得 '+d.ggnum+' 分';
									}
                                    //that.music.con(that.syin);
                                    //that.restart('level');
                                }
                            }, 'json');
                        }
                    });
                }
            }
        })
    }



    /**********************************常用函数******************************/
    rand(n1, n2) {
        return Math.floor(Math.random() * (n2 - n1) + n1)
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