import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene{
   constructor(){
    super('GameScene')
    this.player=null
    this.cursor=null
    this.playerSpeed=350
   } 

   preload(){

        this.load.image("background","/assets/bg.png")
        this.load.spritesheet("011DB","/assets/011DB_sprite.png",
        {frameWidth:360, frameHeight:544})
   }

   create(){

    //add background image, centered and scalable for various window sizes
       this.add.image(0,0,"background").setOrigin(0,0)
    .setDisplaySize(this.scale.width, this.scale.height)
    
    //adding player sprite
    this.player=this.physics.add.sprite(0,window.innerHeight-188,"011DB").setOrigin(0,0).setScale(0.25)
    
    //scaling player sprite 
    this.player.body.setSize(120,220)
    this.player.body.setOffset(120,300)
    this.player.body.gravity.y=2000
    
    //Invisible ground
    this.ground = this.add.rectangle(window.innerWidth / 2, window.innerHeight- 10, window.innerWidth, 20,  0x000000, 0)
    this.physics.add.existing(this.ground, true) // true = static
    this.physics.add.collider(this.player, this.ground)
   
    //ANIMATIONS

   //RUN RIGHT- all 36 frames
    this.anims.create({
      key:"run-right",
      frames: this.anims.generateFrameNumbers("011DB", {start:0, end:35}),
      frameRate: 15,
      repeat: -1
    })

    //RUN LEFT- same 36 frames flipped via flipX
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

    //Controls
    this.cursor=this.input.keyboard.addKeys({a:Phaser.Input.Keyboard.KeyCodes.A,
      d:Phaser.Input.Keyboard.KeyCodes.D, 
      w:Phaser.Input.Keyboard.KeyCodes.W})
}
   update(){
    //setting up controls
    const {a,d,w}=this.cursor

    //check variable
    const onGround = this.player.body.touching.down

    //if a is pressed move left
    if(a.isDown){
      this.player.setVelocityX(-this.playerSpeed);
      this.player.setFlipX(true)   // mirror sprite for left
      this.player.anims.play("run-left", true)
    }
    //if d is pressed move right
    else if(d.isDown){
      this.player.setVelocityX(this.playerSpeed)
      this.player.setFlipX(false)  // normal direction
    this.player.anims.play("run-right", true)
    }
    else{
      this.player.setVelocity(0);
      this.player.anims.play("idle", true)
    }

    //if a is pressed - jump
    if (w.isDown && onGround) {
      this.player.setVelocityY(-950)
    }
   }
}