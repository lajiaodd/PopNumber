/**
**功能：连击
*/
import Dom from './dom'
function p(s) {
      console.log(s);
}
export default class Lianji{
    constructor(t){
		this.t = t;
		this.attr= {};
		this.attr.del = false;
		this.dom = {};
		this.lj = new Dom('play', 'img', 'class:endphts;src:i/s/hita.png;width:'+183*t.bli+';height:'+75*t.bli+';x:'+(t.ww/2-133*t.bli)+';y:'+216*t.bli+';p_x:0;p_y:0;p_w:138;p_h:56;');

		this.setNum(12);
		this.opacity = 0;
    }
	setNum(n){
		this.dom = {};
		if (n >= 3){
			this.opacity = 1;
			
			n = ''+n;
			let aw = {0:38, 1:28, 2:36, 3:36, 4:38, 5:36, 6:37, 7:37, 8:36, 9:37}
			let uw = 50;
			for (var i=0; i<n.length; i++){
				//p(aw[parseInt(n[i])]*this.t.bli);
				let w = aw[parseInt(n[i])];
				this.dom[i] = new Dom('play', 'img', 'class:endphts;src:i/s/hita.png;width:'+w *this.t.bli+';height:'+63*this.t.bli+';x:'+(this.t.ww/2+uw*this.t.bli)+';y:'+223*this.t.bli+';p_x:0;p_y:'+(60+parseInt(n[i])*50)+';p_w:'+w+';p_h:48;');
				uw += w-1 ;
			}
		}else {
			this.opacity = 0;
		}
	}
	w(){
		if (this.opacity <= 0){
			return;
		}
		this.opacity -= 0.01;
		if (this.opacity<=0){
			return;
		}
		
		this.lj.attr.opacity=this.opacity;
		this.lj.w();
		for (var d in this.dom){
			this.dom[d].attr.opacity=this.opacity;
			this.dom[d].w();
		}
	}
}