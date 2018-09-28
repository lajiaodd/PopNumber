'use strict'	//增加一些元素的效果
import Dom from './dom'
function p(s) {
      console.log(s);
}

export default class Number extends Dom {
    constructor(t){
		if(arguments.length<=3){
			super(arguments[0],arguments[1],arguments[2]);
		}else {
			super(arguments[0],arguments[1],arguments[2],arguments[3]);
		}
		this.ckTong   = false;	//是否已经检测相同
		this.shanDong = false;	//闪动加分消失

		this.xiaLuo   = false;			//下落
		this.xiaLuoY  = this.attr.y;	//下落的最终Y值
		this.xiaLuoHouX = -1;	//下落后的DOM-X值
		this.xiaLuoHouY = -1;	//下落后的DOM-X值
		
		this.fangDa   = false;			//补空，放大

		this.attr.y -= this.liuhai; //不重复+刘海

		
		this.shanNum  = 0;
		this.parent = {};
		if (undefined !== arguments[4]){
			this.parent = arguments[4];
			if (undefined === this.attr.text || parseInt(this.attr.text) <= 0){
				let n = this.parent.rand(1,5)	//this.aColor
				this.attr.text = n;
				this.setColor(n);
			}else {
				this.setColor(parseInt(this.attr.text));
			}
		}
		this.attr.cgBgImg = false;
		this.setFangDa();	

		let that = this;
		this.attr.font = (this.attr.width*1.2) + 'px sans-serif';
		this.attr.click = function(){
			if (that.parent.ckHasDong()){
				return false;
			}
			that.attr.text = parseInt(that.attr.text) + 1;
			that.setColor(parseInt(that.attr.text));
			that.parent.xiaoMC = 1;
			that.parent.ckXX(that.attr.ax, that.attr.ay); 
		}
    }
	setFangDa(){
		if (undefined !== this.attr.fangda && this.attr.fangda){
			this.fangDa		  = true;
			this.attr.width  *= 0.6;
			this.attr.height *= 0.6;
			this.attr.old_x = this.attr.x;
			this.attr.old_y = this.attr.y;

			this.attr.x = this.attr.old_x + (this.parent.Fx - this.attr.width)/2;
			this.attr.y = this.attr.old_y + (this.parent.Fy - this.attr.height)/2
		}
	}
	setColor(n){
		if (n>15){
			n = parseInt(this.attr.text) % 16;			
		}
		if (this.parent.randMax<n){
			this.parent.randMax = n;
		}
		//p(this.attr.bgimg);
		this.attr.cgBgImg = true;
		this.attr.bgimg = 'i/n'+n+'.png';
		//this.attr.background = this.parent.aColor[n];
		//this.attr.border     = this.parent.aColor[n];
	}
	w(){
		if (this.shanDong){
			//this.shanNum += 1;
			//this.setColor( parseInt(this.attr.text) +  this.shanNum % 3);

			this.attr.width -= 3;
			this.attr.height -= 3;

			this.attr.x  += 1.5;
			this.attr.y  += 1.5;
			this.attr.font = (this.attr.width*1.2) + 'px sans-serif';

			if (this.attr.width<=10 || this.attr.height <= 10){
				this.attr.del = true;
				this.parent.ckXX();
				return;
			}
		}else if (this.fangDa){
			this.attr.width  += 3;
			this.attr.height += 3;
			if (this.attr.width > this.parent.Fx || this.attr.height > this.parent.Fy){
				this.attr.width = this.parent.Fx;
				this.attr.height= this.parent.Fy;

				this.attr.x = this.attr.old_x;
				this.attr.y = this.attr.old_y;

				this.fangDa = false;
				this.parent.ckXX();
			}else {
				this.attr.x = this.attr.old_x + (this.parent.Fx - this.attr.width)/2;
				this.attr.y = this.attr.old_y + (this.parent.Fy - this.attr.height)/2
			}
			this.attr.font = (this.attr.width*1.2) + 'px sans-serif';
		}else if(this.xiaLuo){
			this.attr.y += this.xiaLuoSD;
			if (this.attr.y >= this.xiaLuoY){
				//p(this);
				this.xiaLuo = false;
				this.attr.y = this.xiaLuoY;
				//p('gz'+this.xiaLuoHouX+'_'+this.xiaLuoHouY);
				this.attr.del = true;
				this.dis      = true;
				//this.parent.buildNum(this.xiaLuoHouX,this.xiaLuoHouY,this.attr.text);
				//this.parent.iniDoms();

				this.parent.buildPos.push([this.xiaLuoHouX,this.xiaLuoHouY,this.attr.text])
				this.parent.ckXX();
				//return;
			}
		}

		/*
		if (undefined !== this.attr.fangda && this.attr.fangda){
			this.attr.width  *= 0.6;
			this.attr.height *= 0.6;
			this.attr.x += (this.parent.Fx - this.attr.width)/2;
			this.attr.y += (this.parent.Fy - this.attr.height)/2
		}
		*/
		
		
		super.w();
		//p('Btn w'); 
	}
}