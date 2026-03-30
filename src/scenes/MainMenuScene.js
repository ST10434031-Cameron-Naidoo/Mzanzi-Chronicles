import Phaser from 'phaser'

export default class MainMenuScene extends Phaser.Scene{
    constructor(){
        super('MainMenuScene')
    }

    preload(){
        this.load.image('menu_background', '/assets/menu_background.png')
        this.load.image('Ilifa', '/assets/ilifa.png')
    }

    create(){

        //Load Cinzel font
        const link=document.createElement('link')
        link.rel='stylesheet'
        link.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap'
        document.head.appendChild(link)

        //LAYER 1: Base dark background
        this.add.rectangle(0,0,window.innerHeight,window.innerWidth,0x0a0118).setOrigin(0,0)

        //LAYER 2: Menu background
        const background_image=this.add.image(window.innerWidth/2,window.innerHeight/2, 'menu_background')
        .setOrigin(0.5,0.5)
        
        background_image.setScale(Math.max(window.innerWidth/background_image.width,window.innerHeight/background_image.height)).setAlpha(0.85)


        //LAYER 3: Ilifa title 
        const title=this.add.text(window.innerWidth/2,window.innerHeight*0.52, 'ILIFA',{
            fontFamily: '"Cinzel", serif',
            fontSize:   `${window.innerWidth * 0.075}px`,
            color: '#F5A623',
            stroke: '#1a0533',
            strokeThickness: 8,
            shadow:{
                offsetX: 0,
                offsetY: 0,
                color: '#F5A623',
                blur: 30,
                fill: true
            }
        }).setOrigin(0.5)

        //LAYER 4:ILIFA logo
        const logo=this.add.image(window.innerWidth/2,window.innerHeight*0.28, 'Ilifa')
        .setOrigin(0.5)
        .setAlpha(0)

        const logoSize=Math.min(window.innerWidth,window.innerHeight)*0.22

        logo.setDisplaySize(logoSize,logoSize)
        
        // LAYER 5: Subtitle
        const subtitle = this.add.text(window.innerWidth / 2, window.innerHeight * 0.59, 'THE GIFT OF THE ANCESTORS', {
        fontFamily: '"Cinzel", serif',
        fontSize: `${window.innerWidth * 0.016}px`,
         color: '#F5A623',
        letterSpacing: 10,
        stroke: '#0a0118',
        strokeThickness: 4,
        shadow: {
            offsetX: 0,
            offsetY: 0,
            color: '#F5A623',
            blur: 15,
        fill: true
        }
        }).setOrigin(0.5).setAlpha(0)
        
        //LAYER 6: Buttons
        const btnLabels= ['PLAY','SETTINGS','CREDITS','QUIT']
        const startY=window.innerHeight*0.68
        const gap=window.innerHeight*0.082
        const btnW=window.innerWidth*0.18
        const btnH=48

        const buttons = btnLabels.map((label, i) => {
        
            const y = startY + i * gap

            const bg = this.add.rectangle(window.innerWidth / 2, y, btnW, btnH, 0x1a0533, 0.85)
            .setStrokeStyle(1.5, 0xf5a623, 0.7)
            .setAlpha(0)

            const text = this.add.text(window.innerWidth / 2, y, label, {
                fontFamily: '"Cinzel", serif',
                fontSize: '16px',
                color: '#f5a623',
                letterSpacing: 5
            }).setOrigin(0.5).setAlpha(0)

            const zone = this.add.zone(window.innerWidth / 2, y, btnW, btnH).setInteractive()

            zone.on('pointerover', () => {
                bg.setFillStyle(0x2d0a5e, 0.95)
                bg.setStrokeStyle(2, 0xf5a623, 1)
                text.setColor('#ffffff')
                this.tweens.add({ targets: [bg, text], scaleX: 1.05, scaleY: 1.05, duration: 100 })
            })

            zone.on('pointerout', () => {
                bg.setFillStyle(0x1a0533, 0.85)
                bg.setStrokeStyle(1.5, 0xf5a623, 0.6)
                text.setColor('#f5a623')
                this.tweens.add({ targets: [bg, text], scaleX: 1, scaleY: 1, duration: 100 })
            })

            zone.on('pointerdown', () => {
                switch (label) {
                case 'PLAY':
                    this.cameras.main.fadeOut(800, 0, 0, 0)
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('GameScene')
                    })
                break
                case 'SETTINGS':
                    break
                case 'CREDITS':
                    break
                case 'QUIT':
                    window.close()
                    break
                }
            })

            return { bg, text }

        })

         // Fade in
        const blackOverlay = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000)
        .setOrigin(0, 0)
        .setAlpha(1)
        
        // Subtle pulse on logo
        this.tweens.add({
            targets: logo,
            scaleX: logo.scaleX * 1.04,
            scaleY: logo.scaleY * 1.04,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        })

   this.tweens.add({
  targets: blackOverlay,
  alpha: 0,
  duration: 2000,
  ease: 'Power2',
  onComplete: () => {
    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: [title, subtitle],
          alpha: 1,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => {
            buttons.forEach((btn, i) => {
              this.tweens.add({
                targets: [btn.bg, btn.text],
                alpha: 1,
                duration: 400,
                delay: i * 150,
                ease: 'Power2'
              })
            })
          }
        })
      }
    })
  }
})

}

}
