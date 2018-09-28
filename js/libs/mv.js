'use strict'	//增加一些元素的效果
import Dom from './dom'
function p(s) {
      console.log(s);
}




export default class Mv extends Dom {
    constructor(t){
		if(arguments.length<=3){
			super(arguments[0],arguments[1],arguments[2]);
		}else {
			super(arguments[0],arguments[1],arguments[2],arguments[3]);
		}
		this.nPos = 0;
		this.tTime= 3000;
    }
	w(){
		if (this.attr.movexy.length > this.nPos+1){
			let nx = this.attr.movexy[this.nPos+1];
			if(nx[0] == this.attr.movexy[this.nPos][0]){
				if (this.attr.movexy[this.nPos][1] > nx[1]){	//减
					this.attr.y -= this.attr.movesd;
					if (this.attr.y < nx[1]){
						this.attr.y = nx[1];
						this.nPos += 1;
					}
				}else {				
					this.attr.y += this.attr.movesd; 
					if (this.attr.y > nx[1]){
						this.attr.y = nx[1];
						this.nPos += 1;
					}
				}
			}else {
				if (this.attr.movexy[this.nPos][0] > nx[0]){	//减
					this.attr.x -= this.attr.movesd;
					if (this.attr.x < nx[0]){
						this.attr.x = nx[0];
						this.nPos += 1;
					}
				}else {				
					this.attr.x += this.attr.movesd;
					if (this.attr.x > nx[0]){
						this.attr.x = nx[0];
						this.nPos += 1;
					}
				}
			}
		}else {
			this.tTime -= 60;
			if (this.tTime <= 0){	
				this.tTime= 2000;
				this.nPos = 0;
				this.attr.x = this.attr.movexy[0][0];
				this.attr.y = this.attr.movexy[0][1];
			}
		}
		super.w();
		//p('Btn w'); 
	}
}