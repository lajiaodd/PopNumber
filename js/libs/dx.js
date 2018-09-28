'use strict'	//增加一些元素的效果
import Dom from './dom'
function p(s) {
      console.log(s);
}
export default class Dx extends Dom {
    constructor(t){
		if(arguments.length<=3){
			super(arguments[0],arguments[1],arguments[2]);
		}else {
			super(arguments[0],arguments[1],arguments[2],arguments[3]);
		}
		this.ndx = 2;
		this.ndb = true;
		this.owidth = this.attr.width;
		this.oheight = this.attr.height;
		this.ox = this.attr.x;
		this.oy = this.attr.y;
    }
	w(){
		if (this.ndb){
			this.attr.width -= 0.1;
			this.attr.height -= 0.1;
			if (this.attr.height<this.oheight-this.ndx){
				this.ndb = false;
			}
		}else {
			this.attr.width += 0.1;
			this.attr.height += 0.1;
			if (this.attr.height>this.oheight+this.ndx){
				this.ndb = true;
			}
		}
		this.attr.x = this.ox - (this.attr.width-this.owidth)/2;
		this.attr.y = this.oy - (this.attr.height-this.oheight)/2;

		super.w();
		//p('Btn w'); 
	}
}