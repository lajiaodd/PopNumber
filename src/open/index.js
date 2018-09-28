import Dom from './dom';
let sharedCanvas = wx.getSharedCanvas();
let ctx = sharedCanvas.getContext('2d');
let bli = ctx.canvas.width / 1000;
let ww  = ctx.canvas.width

var kb = [ "uid", "fen","time"];
function p(s) {
    console.log(s); 
}
let dom ={};
let currN = 0;
let currU = -1;
let usLS  = [];
let myM   = -1;
function draw(uid, n,fen){
	p('openData '+n);
	let m = -1;
	switch(n){
		case 0:
			dom ={};
			//usLS
			gUs();
			break;
		case 1:
			p(usLS.length);
			if (usLS.length<=0){
				gUs();
				return;
			}
			for (var i=0; i<usLS.length; i++){
				if (usLS[i].uid == uid){
					myM = i
					continue;
				}
				if (usLS[i].fen>=fen){
					p(usLS[i].fen+'>='+fen+' - '+i);
					m = i;
				}
			}
			if (m>=0){
				if(currN==n&&currU==m){
					break;
				}
				currU = m;
				dom ={};
				dom.b1 = new Dom('sh', 'font', 'class:ts;color:#FFF;font:12px 微软雅黑;textalign:center;valign:middle;x:'+892*bli+';y:'+155*bli+';', { text: (usLS[m].fen)});
				dom.kimg= new Dom('sh','img','src:src/open/i/yk.png;width:'+130*bli+';height:'+130*bli+';x:'+827*bli+';y:'+177*bli+'');
				dom.img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[m].pic+';width:'+124*bli+';height:'+124*bli+';x:'+830*bli+';y:'+180*bli+'');
				//dom.arcz= new Dom('sh','arc','line:10;border:#013858;r:'+62*bli+';x:'+(830+62)*bli+';y:'+(180+62)*bli+'');
				
			}else {
				dom ={};
				if (myM >= 0){
					if(currN==n&&currU==myM){
						return; 
					}
					currU = myM;
					dom.b1 = new Dom('sh', 'font', 'class:ts;color:#FFF;font:12px 微软雅黑;textalign:center;valign:middle;x:'+892*bli+';y:'+155*bli+';', { text:'领先好友'});
					dom.kimg= new Dom('sh','img','src:src/open/i/yk.png;width:'+130*bli+';height:'+130*bli+';x:'+827*bli+';y:'+177*bli+'');
					dom.img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[myM].pic+';width:'+124*bli+';height:'+124*bli+';x:'+830*bli+';y:'+180*bli+'');
					
				}
			}
			break;
		case 2:
			dom ={};			
			for (var i=0; i<usLS.length; i++){
				if (usLS[i].uid == uid){
					myM = uid
					continue;
				}
				
				if (usLS[i].fen>=fen){
					p(usLS[i].fen+'>='+fen+' - '+i); 
					m = i;
				}else {
					break;
				}
			}
			if (m>=0){
				dom.b1 = new Dom('sh', 'font', 'class:ts;color:#FFF;font:16px 微软雅黑;textalign:right;valign:middle;x:'+(ww/2-20*bli)+';y:'+1295*bli+';', { text: ('下一个即将超越的好友')});
				dom.kimg= new Dom('sh','img','src:src/open/i/bk.png;width:'+130*bli+';height:'+130*bli+';x:'+(ww/2+17*bli)+';y:'+(1295-65)*bli+'');
				dom.img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[m].pic+';width:'+124*bli+';height:'+124*bli+';x:'+(ww/2+20*bli)+';y:'+(1295-62)*bli+'');
				//dom.arcz= new Dom('sh','arc','line:10;border:#FFF;r:'+62*bli+';x:'+(ww/2+82*bli)+';y:'+1295*bli+'');				
				dom.fen = new Dom('sh', 'font', 'class:ts;color:#FFF;font:16px 微软雅黑;textalign:left;valign:middle;x:'+(ww/2+25+124*bli)+';y:'+(1295)*bli+';', { text:usLS[m].fen});
			}
			break; 
		case 4:	//排行榜
			dom ={};
			p('托管排行榜');
			dom.b0 = new Dom('order', 'img', 'src:i/ord.png;width:' + bli * 920 + ';height:' + bli * 1089 + ';x:'+40*bli+';y:'+bli * 320 +';');
			dom.b1 = new Dom('order', 'div', 'border:#FEFAEF;width:' + bli * 880 + ';radius:10;height:' + bli * 1049 + ';x:'+60*bli+';y:'+200*bli+';', { overflow: true, ofx: 2, mousemove: true });
			
			let kkh = 160*bli;
            for (var i = 1; i <= usLS.length; i++) {
				let co = '#4D4E50';
				if (i==1){
					co = '#FF1C56';
				}else if(i == 2){
					co = '#FF7500';
				}else if(i == 3){
					co = '#008EFF';
				}
				
                dom['k_' + i] = new Dom('order', 'div', 'class:ordls;line:1;border:#DFD1BC;width:' + (dom.b1.attr.width + 10) + ';height:' + kkh + ';x:-5;y:' + ((i - 1) * kkh) + ';', { f: dom.b1 });

				dom['knax_' + i] = new Dom('order', 'font', 'class:ordls;color:'+co+';font:' + (i > 3 ? 18 : 20) + 'px 微软雅黑;valign:middle;textalign:center;x:' + 70*bli + ';y:' + ((i - 1) * kkh + kkh * 0.5) + ';', { f: dom.b1, text:i });

                dom['ki_' + i] = new Dom('order', 'img', 'class:ordls;src:' + usLS[i - 1]['pic'] + ';width:' + 100*bli + ';height:' + 100*bli + ';x:' + 150*bli + ';y:' + ((i - 1) * kkh + (kkh-100*bli)/2) + ';', { f: dom.b1 });
                dom['kna_' + i] = new Dom('order', 'font', 'class:ordls;color:#6E6D6A;font:16px 微软雅黑;valign:middle;textalign:left;x:' + 280*bli + ';y:' + ((i - 1) * kkh + kkh * 0.5) + ';', { f: dom.b1, text: usLS[i - 1]['name'] });

                dom['kg0_' + i] = new Dom('order', 'div', 'class:ordls;background:#F2FBFE;width:' + (dom.b1.attr.width * 0.3) + ';height:' + (kkh-2) + ';x:' + (dom.b1.attr.width * 0.7) + ';y:' + ((i - 1) * kkh+1) + ';', { f: dom.b1 });

                ///that.dom['kg1_' + i] = new Dom('order', 'font', 'class:ordls;color:#444;font:14px 微软雅黑;valign:middle;textalign:right;x:' + (dom.b1.attr.width - 20) + ';y:' + ((i - 1) * kkh + kkh * 0.30) + ';', { f: dom.b1, text: '大师'+usLS[i - 1]['j']+'级' });
                dom['kg2_' + i] = new Dom('order', 'font', 'class:ordls;color:#F33009;font:15px 微软雅黑;valign:middle;textalign:right;x:' + (dom.b1.attr.width - 20) + ';y:' + ((i - 1) * kkh + kkh * 0.5) + ';', { f: dom.b1, text: usLS[i - 1]['fen']+'分' });
p(((i - 1) * kkh)+ kkh)
				//that.dom['kl_'+i] = new Dom('order','line','class:ordls;color:red;line:1',{f: dom.b1,path:[[0,((i - 1) * kkh)+ kkh+20],[bli * 880+30,((i - 1) * kkh)+ kkh+20],[]]});
            }


			p(usLS);
			break; 
		case 3:
			dom ={};
			for (var i=0; i<usLS.length; i++){
				if (usLS[i].uid == uid){
					usLS[i].fen = fen;
					break;
				}
			}
			usLS.sort(function(a, b){
				if (a.fen === b.fen) {
						return a.time-b.time;
				} else {
						return b.fen-a.fen;
				}
			});

			let nUID = 0;
			for (var i=0; i<usLS.length; i++){
				if (usLS[i].uid == uid){
					nUID = i;
					break;
				}
			}
			let jge = (880/3)*bli;
			if (usLS.length <= 2){
				dom.p2 = new Dom('sh', 'font', 'class:ts;color:red;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2)+';y:'+640*bli+';', { text: (nUID+1)});
				dom.p2_img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[nUID].pic+';width:'+124*bli+';height:'+124*bli+';x:'+(ww/2-62*bli)+';y:'+(676)*bli+'');
				dom.p2_name = new Dom('sh', 'font', 'class:ts;color:red;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2)+';y:'+(847)*bli+';', { text: (usLS[nUID].name)});
				dom.p2_fen = new Dom('sh', 'font', 'class:ts;color:red;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2)+';y:'+(900)*bli+';', { text: (usLS[nUID].fen+'分')});

				if (usLS.length==2 && nUID ==1){
					dom.p1 = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2-jge)+';y:'+640*bli+';', { text: (1)});
					dom.p1_img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[0].pic+';width:'+124*bli+';height:'+124*bli+';x:'+(ww/2-62*bli-jge)+';y:'+(676)*bli+'');
					dom.p1_name = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2-jge)+';y:'+(847)*bli+';', { text: (usLS[0].name)});
					dom.p1_fen = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2-jge)+';y:'+(900)*bli+';', { text: (usLS[0].fen+'分')});
				}else if (usLS.length==2 && nUID ==0){
					dom.p3 = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2+jge)+';y:'+640*bli+';', { text: (2)});
					dom.p3_img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[1].pic+';width:'+124*bli+';height:'+124*bli+';x:'+(ww/2-62*bli+jge)+';y:'+(676)*bli+'');
					dom.p3_name = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2+jge)+';y:'+(847)*bli+';', { text: (usLS[1].name)});
					dom.p3_fen = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2+jge)+';y:'+(900)*bli+';', { text: (usLS[1].fen+'分')});
				}
			}else {
				let strn = 0;
				if (nUID>0 && nUID < usLS.length-1){
					strn = nUID-1;
				}else if (nUID == usLS.length-1){
					strn = nUID-2;
				}
				dom.p1 = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2-jge)+';y:'+640*bli+';', { text:1});
				dom.p1_img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[strn].pic+';width:'+124*bli+';height:'+124*bli+';x:'+(ww/2-62*bli-jge)+';y:'+(676)*bli+'');
				dom.p1_name = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2-jge)+';y:'+(847)*bli+';', { text: (usLS[strn].name)});
				dom.p1_fen = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2-jge)+';y:'+(900)*bli+';', { text: (usLS[strn].fen+'分')});

				dom.p2 = new Dom('sh', 'font', 'class:ts;color:red;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2)+';y:'+640*bli+';', { text:2});
				dom.p2_img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[strn+1].pic+';width:'+124*bli+';height:'+124*bli+';x:'+(ww/2-62*bli)+';y:'+(676)*bli+'');
				dom.p2_name = new Dom('sh', 'font', 'class:ts;color:red;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2)+';y:'+(847)*bli+';', { text: (usLS[strn+1].name)});
				dom.p2_fen = new Dom('sh', 'font', 'class:ts;color:red;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2)+';y:'+(900)*bli+';', { text: (usLS[strn+1].fen+'分')});

				dom.p3 = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2+jge)+';y:'+640*bli+';', { text:3});
				dom.p3_img= new Dom('sh','img','yuan:'+62*bli+';line:10;border:#013858;src:'+usLS[strn+2].pic+';width:'+124*bli+';height:'+124*bli+';x:'+(ww/2-62*bli+jge)+';y:'+(676)*bli+'');
				dom.p3_name = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2+jge)+';y:'+(847)*bli+';', { text: (usLS[strn+2].name)});
				dom.p3_fen = new Dom('sh', 'font', 'class:ts;color:#333;font:16px 微软雅黑;textalign:center;valign:middle;x:'+(ww/2+jge)+';y:'+(900)*bli+';', { text: (usLS[strn+2].fen+'分')});
			}
			break; 
	}

	ctx.clearRect(0, 0, ctx.canvas.width*2, ctx.canvas.height*2);
	for (var d in dom){
		dom[d].w();
	}	
	currN = n;
	//ctx.fillStyle = 'red';
	//ctx.fillRect(0, 0, 100, 100);
}

function gUs() {	//排序
	wx.getFriendCloudStorage({
		keyList: kb,
		success: function(b) {
			console.log('好友托管的数据');
			console.log(b.data);
			if (b.errMsg == 'getFriendCloudStorage:ok'){
				let ULS = []
				b.data.forEach(a=>{
					let uid = 0;
					let arr = {}
					a.KVDataList.forEach(ar=>{
						arr[ar.key] = ar.value;
						if (ar.key == 'uid'){
							uid = ar.value;
						}
					})
					arr['name'] = a.nickname;
					arr['pic'] = a.avatarUrl;
					ULS.push(arr);
				});

				ULS.sort(function(a, b){
					if (a.fen === b.fen) {
							return a.time-b.time;
					} else {
							return b.fen-a.fen;
					}
				});

				usLS = ULS;
				//p('----------usLS---------');
				//p(usLS);
			}
		}
	});


}

(function() {
    
    wx.onMessage(c => {
        console.log("open data cmd = ", c);
        var d = c.cmd;
		p(c);
		if (c.cmd === d) {	//输出
			p('echo '+c.n);
			
			if (c.n == 3){	//已结束
				let tgFen = 0;
				for (var i=0; i<usLS.length; i++){
					if (usLS[i].uid == c.uid){
						tgFen = parseInt(usLS[i].fen);
						break;
					}
				}
				if (tgFen <= parseInt(c.fen)){				
					var arr = {"uid":c.uid, "fen":parseInt(c.fen),"time":parseInt(c.time)};
					var a = [];
					for (var k in arr){
						var o = {};
						o.key = ""+k, o.value = ""+arr[k];
						a.push(o);
					}
					wx.setUserCloudStorage({
						KVDataList:a,
						success: function(d) {
							console.log('托管我的新高分'+c.fen);
							//console.log(d);
						}
					});
				}else {
					c.fen = tgFen;
					p('分低了['+tgFen+'],未托管');
				}
			}
			draw(c.uid, c.n, c.fen);
		} else if ("setData" === d) { //设值
			console.log(o);
			var arr = {"uid":c.uid, "fen":parseInt(c.fen),"time":parseInt(c.time)};
			var a = [];
			for (var k in arr){
				var o = {};
				o.key = ""+k, o.value = ""+arr[k];
				a.push(o);
			}
			wx.setUserCloudStorage({
                KVDataList:a,
                success: function(d) {
					//console.log('托管我的数据');
                    //console.log(d);
                }
            });
			wx.getUserCloudStorage({
                keyList: kb,
                success: function(d) {
					console.log('我的托管的数据');
                    console.log(d.KVDataList);
                }
            });
			gUs();
        } else if ("grouprank" === d) {
            //let d = wx.getSharedCanvas(), e = d.getContext("2d");
            //e.globalAlpha = 0, e.fillStyle = "red", e.fillRect(0, 0, e.canvas.width, e.canvas.height), 
            //e.globalAlpha = 1, 
			wx.getGroupCloudStorage({
                shareTicket: c.shareTicket,
                keyList: b,
                success: function(b) {
                    //a.setData(b.data, c), a.draw(c.view);
                }
            });
        } else if ("clear" === d) {
            let a = wx.getSharedCanvas(), b = a.getContext("2d");
            b.clearRect(0, 0, a.width, a.height);
        } else "page" === d ? 1 == c.index ? a.draw("nextPage") : -1 == c.index && a.draw("prePage") : "beyondinit" === d ? "friendrank" === c.datasource ? wx.getFriendCloudStorage({
            keyList: b,
            success: function(b) {
                //a.setBeyondData(b.data, c);
            }
        }) : "grouprank" === c.datasource && wx.getGroupCloudStorage({
            shareTicket: c.shareTicket,
            keyList: b,
            success: function(b) {
                //a.setBeyondData(b.data, c);
            }
        }) : "beyondcheck" === d ? a.BeyondCheck(c.score) : "beyondlist" === d && a.DrawBeyondList();

		
    });
})();