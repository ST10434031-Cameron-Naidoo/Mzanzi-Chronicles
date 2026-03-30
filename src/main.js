import './style.css'
import Phaser, { CANVAS } from 'phaser'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const speedDown=300

class GameScene extends Phaser.Scene{
   constructor(){
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed=550
   } 

   preload(){

        this.load.image("background","/assets/bg.png")
        this.load.spritesheet("011DB","/assets/011DB_sprite.png",{frameWidth:360, frameHeight:544})
   }

   create(){

    //add background image, centered and scalable for various window sizes
       this.add.image(0,0,"background").setOrigin(0,0)
    .setDisplaySize(this.scale.width, this.scale.height)
    
    //adding player sprite
    this.player=this.physics.add.sprite(0,sizes.height-188,"011DB").setOrigin(0,0).setScale(0.25)
    
    //scaling player sprite 
    this.player.body.setSize(120,220)
    this.player.body.setOffset(120,300)
    this.player.body.gravity.y=1500
    
    //INVISIBLE GROUND
    this.ground = this.add.rectangle(
    sizes.width / 2, sizes.height - 10, 
    sizes.width, 20, 
    0x000000, 0  // invisible
    )
    this.physics.add.existing(this.ground, true) // true = static
    this.physics.add.collider(this.player, this.ground)
   
   //RUN RIGHT ANIMATION - all 36 frames
    this.anims.create({
      key:"run-right",
      frames: this.anims.generateFrameNumbers("011DB", {start:0, end:35}),
      frameRate: 15,
      repeat: -1
    })

    //RUN LEFT ANIMATION - same 36 frames flipped via flipX
    this.anims.create({
      key:"run-left",
      frames: this.anims.generateFrameNumbers("011DB", {start:0, end:35}),
      frameRate: 15,
      repeat: -1
    })

    //IDLE ANIMATION 
    this.anims.create({
      key: "idle",
      frames: [{key: "011DB", frame: 0}],
      frameRate: 1,
      repeat: -1
    })
}
   update(){

   }
}
const config={
    type:Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
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