import Phaser from 'phaser'

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene')
  }

  preload() {
    // panels
    this.load.image('panel1', '/assets/panel1.png')
    this.load.image('panel2', '/assets/panel2.png')
    this.load.image('panel3', '/assets/panel3.png')
    this.load.image('panel4', '/assets/panel4.png')
    this.load.image('panel5', '/assets/panel5.png')

    //narration
    this.load.audio('narration', '/assets/intro_narration.mp3')
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height

    // Load Cinzel font
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap'
    document.head.appendChild(link)

    // Panel data
    this.panels = [
      {
        key: 'panel1',
        text: 'He never understood the weight in his hands... or why the world trembled when his blood turned to fire.',
        duration: 5000
      },
      {
        key: 'panel2',
        text: 'Then came the night the shadows moved... and Bobby finally spoke.',
        duration: 5000
      },
      {
        key: 'panel3',
        text: 'You carry the Ilifa, Sbu. A gift etched in bone and passed through blood.\nAnd now... the hunters have found the scent.',
        duration: 10000
      },
      {
        key: 'panel4',
        text: 'They came before the dawn. Cold steel and silent vans... the way they always do.',
        duration: 5000
      },
      {
        key: 'panel5',
        text: 'Now, he has no sanctuary and no dog, so somebody is gonna get there ass kicked...\n',
        duration: 10000
      }
    ]

    this.narration=this.sound.add('narration', {loop:false, volume: 1})
    this.narration.play()

    this.currentPanel = 0

    // Base black background
    this.add.rectangle(0, 0, W, H, 0x000000).setOrigin(0, 0)

    // Cinematic black bars
    this.add.rectangle(0, 0, W, H * 0.1, 0x000000).setOrigin(0, 0)
    this.add.rectangle(0, H * 0.9, W, H * 0.1, 0x000000).setOrigin(0, 0)

    // Panel image — ⚠ removed duplicate setOrigin, added setAlpha(0)
    this.panelImage = this.add.image(W / 2, H / 2, 'panel1')
      .setOrigin(0.5)
      .setAlpha(0)

    this.scalePanel()

    // Narration text
    this.narrationText = this.add.text(W / 2, H * 0.93, '', {
      fontFamily: '"Cinzel", serif',
      fontSize: `${W * 0.017}px`,
      color: '#F5A623',
      align: 'center',
      wordWrap: { width: W * 0.8 },
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0)

    // Panel counter — ⚠ was missing from your version
    this.counterText = this.add.text(W * 0.95, H * 0.05, '1 / 5', {
      fontFamily: '"Cinzel", serif',
      fontSize: `${W * 0.012}px`,
      color: '#c8a87a'
    }).setOrigin(1, 0.5).setAlpha(0.5)

    // Fade in then start panels
    this.cameras.main.fadeIn(1000, 0, 0, 0)
    this.cameras.main.once('camerafadeincomplete', () => {
      this.showPanel(0)
    })
  }

  scalePanel() {
    const W = this.scale.width
    const H = this.scale.height
    const scaleX = W / this.panelImage.width
    const scaleY = (H * 0.8) / this.panelImage.height
    this.panelImage.setScale(Math.min(scaleX, scaleY))
  }

  showPanel(index) {
    const panel = this.panels[index]

    this.counterText.setText(`${index + 1} / ${this.panels.length}`)

    this.panelImage.setTexture(panel.key)
    this.scalePanel()

    this.tweens.add({
      targets: this.panelImage,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.narrationText.setText(panel.text)
        this.tweens.add({
          targets: this.narrationText,
          alpha: 1,
          duration: 500,
          ease: 'Power2'
        })

        this.time.delayedCall(panel.duration, () => {
          this.tweens.add({
            targets: [this.panelImage, this.narrationText],
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
              if (index + 1 < this.panels.length) {
                this.showPanel(index + 1)
              } else {
                this.endIntro()
              }
            }
          })
        })
      }
    })
  }

  endIntro() {
  this.tweens.add({
    targets: this.ambience,
    volume: 0,
    duration: 1500
  })

  this.cameras.main.fadeOut(1500, 0, 0, 0)
  this.cameras.main.once('camerafadeoutcomplete', () => {
    this.narration.stop()
    this.scene.start('GameScene')
  })
  }
}
