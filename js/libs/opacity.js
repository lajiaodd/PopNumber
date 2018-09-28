'use strict'	//增加一些元素的效果
import Dom from './dom'
function p(s) {
      console.log(s);
}
export default class Opacity extends Dom {
    constructor(t){
		if(arguments.length<=3){
			super(arguments[0],arguments[1],arguments[2]);
		}else {
			super(arguments[0],arguments[1],arguments[2],arguments[3]);
		}
		p(this)
    }
	w(){
		if (this.attr.opacity > 0.1){
			this.attr.opacity -= 0.02;	
			ctx.globalAlpha = this.attr.opacity;
			super.w();
			ctx.globalAlpha=1;
		}
	}
}