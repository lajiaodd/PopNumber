let instance

/**
 * 统一的音效管理器
 */
export default class Music {
    constructor() {
        if (instance)
            return instance

        instance = this;
		this.xx  = {};
        //this.click = new Audio()
        //this.click.loop = true
        //this.click.src = 'img/click.mp3'

        //this.connect = new Audio()
        //this.connect.src = 'img/connect.mp3'
    }

    ck(b) {
        if(!b)return;
        if (undefined === this.click){
            this.click = new Audio()
            this.click.src = 'mp4/click.mp3'
        }
        //console.log(this.click);
        this.click.currentTime = 0
        this.click.play()
    }

	xxYin(n,b){
		if (!b) return;
		console.log('xiaochu music '+n);
		if (n > 8){
			n = 8;
		}		
		if (undefined === this.xx['x'+n]){
            this.xx['x'+n] = new Audio()
            this.xx['x'+n].src = 'mp4/xiaochu'+n+'.mp3'
		}
        this.xx['x'+n].currentTime = 0
        this.xx['x'+n].play();
	}
	playbg(b){
		if (!b) return;

        if (undefined === this.click){
            this.bg = new Audio()
			this.bg.loop = true
            this.bg.src = 'mp4/bgm.mp3'
        }
        this.bg.currentTime = 0
        this.bg.play()
	}

    con(b) {
        if (!b) return;
        if (undefined === this.connect) {
            this.connect = new Audio()
            this.connect.src = 'img/connect.mp3'
        } 
        this.connect.currentTime = 0
        this.connect.play()
    }
}
