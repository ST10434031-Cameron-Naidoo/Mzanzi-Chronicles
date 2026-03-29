import './style.css'
import Phaser, { CANVAS } from 'phaser'

const speedDown=300

class GameScene extends Phaser.Scene{
   constructor(){
    super("scene-game")
   } 

   preload(){
        this.load.image("background","/assets/bg.png")
   }

   create(){
       this.add.image(0,0,"background").setOrigin(0,0)
    .setDisplaySize(this.scale.width, this.scale.height)
   }

   update(){

   }
}
const config={
    type:Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    canvas:gameCanvas,
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:speedDown},
            debug:true
        }
    },
    scene:[GameScene]
}

const game=new Phaser.Game(config)