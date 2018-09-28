'use strict'	//增加一些元素的效果
import Dom from './dom'
function p(s) {
      console.log(s);
}

export default class Jfen extends Dom {
    constructor(t){
		if(arguments.length<=3){
			super(arguments[0],arguments[1],arguments[2]);
		}else {
			super(arguments[0],arguments[1],arguments[2],arguments[3]);
		}

		this.attr.alpha = 1;
    } 

	w(){
		this.attr.alpha -= 0.01;
		ctx.globalAlpha = this.attr.alpha;
		this.attr.y -= 0.3;
		if (this.attr.alpha <= 0){
			this.attr.del = true;
			ctx.globalAlpha=1;
			return;
		}
		super.w();
		ctx.globalAlpha=1;
		//p('Btn w'); 
	}
}