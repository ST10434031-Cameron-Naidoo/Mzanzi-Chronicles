import Phaser from 'phaser'

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene')
  }

  preload() {
    // Panels & Audio
    for (let i = 1; i <= 5; i++) {
      this.load.image(`panel${i}`, `/assets/panel${i}.png`)
    }
    this.load.audio('narration', '/assets/intro_narration.mp3')
    this.load.audio('ambience', '/assets/intro_background_music.mp3')
  }

  create() {
    const { width: W, height: H } = this.scale

    // Panel Data
    this.panels = [
      { key: 'panel1', text: 'He never understood the weight in his hands... or why the world trembled when his blood turned to fire.', duration: 7000 },
      { key: 'panel2', text: 'Then came the night the shadows moved... and Bobby finally spoke.', duration: 7000 },
      { key: 'panel3', text: 'You carry the Ilifa, Sbu. A gift etched in bone and passed through blood.\nAnd now... the hunters have found the scent.', duration: 10000 },
      { key: 'panel4', text: 'They came before the dawn. Cold steel and silent vans... the way they always do.', duration: 5000 },
      { key: 'panel5', text: 'Now, he has no sanctuary and no dog, so somebody is gotta get their ass kicked...', duration: 10000 }
    ]

    // Audio Setup
    this.ambience = this.sound.add('ambience', { loop: true, volume: 0 })
    this.ambience.play()
    this.tweens.add({ targets: this.ambience, volume: 0.1, duration: 2000 })
    
    this.narration = this.sound.add('narration', { volume: 1 })
    this.narration.play()

    // Background & Image Layer
    this.add.rectangle(0, 0, W, H, 0x000000).setOrigin(0)
    
    // The Panel Image with a slightly larger scale
    this.panelImage = this.add.image(W / 2, H / 2, 'panel1')
      .setOrigin(0.5)
      .setAlpha(0)

    // UI Overlay (Vignette for atmosphere)
    const vignette = this.add.graphics()
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.3, 0.3)
    vignette.fillRect(0, 0, W, H)

    // Narrative Text
    this.narrationText = this.add.text(W / 2, H * 0.88, '', {
      fontFamily: '"Cinzel", serif',
      fontSize: `${W * 0.018}px`,
      color: '#F5A623',
      align: 'center',
      wordWrap: { width: W * 0.75 },
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5)

    this.counterText = this.add.text(W * 0.95, H * 0.05, '1 / 5', {
      fontFamily: '"Cinzel", serif',
      fontSize: '14px',
      color: '#c8a87a'
    }).setOrigin(1, 0.5).setAlpha(0.5)

    this.showPanel(0)
  }

  showPanel(index) {
    const panel = this.panels[index]
    const { width: W, height: H } = this.scale

    this.counterText.setText(`${index + 1} / ${this.panels.length}`)
    this.panelImage.setTexture(panel.key).setAlpha(0)
    
    const scaleW = (W * 0.9) / this.panelImage.width;
    const scaleH = (H * 0.85) / this.panelImage.height;

    // Reset scale for the zoom effect (Start slightly zoomed out)
    const baseScale = Math.min(scaleW, scaleH)
    this.panelImage.setScale(baseScale)

    // 1. Fade In & Slow Zoom (Ken Burns Effect)
    this.tweens.add({
      targets: this.panelImage,
      alpha: 1,
      scale: baseScale * 1.08, // Slow zoom in
      duration: panel.duration,
      ease: 'Linear'
    })

    // Calculate typewriter speed: 
    // (Total duration - 2 seconds of "padding") divided by number of characters.
    const availableTime = panel.duration - 2000; 
    const charDelay = Math.max(20, availableTime / panel.text.length);

    // 2. Typewriter Text Effect
    this.displayTypewriterText(panel.text, charDelay)

    // 3. Exit Transition
    this.time.delayedCall(panel.duration, () => {
      this.tweens.add({
        targets: [this.panelImage, this.narrationText],
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          if (index + 1 < this.panels.length) {
            this.showPanel(index + 1)
          } else {
            this.endIntro()
            this.ambience.stop()
          }
        }
      })
    })
  }

  displayTypewriterText(text,delay) {
    this.narrationText.setText('').setAlpha(1)
    let charIndex = 0
    if (this.typeTimer) this.typeTimer.remove();

    this.timer = this.time.addEvent({
      delay: delay,
      callback: () => {
        this.narrationText.text += text[charIndex]
        charIndex++
      },
      repeat: text.length - 1
    })
  }

  endIntro() {
    this.cameras.main.fadeOut(2000, 0, 0, 0)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene')
    })
  }
}