import './style.css'
import Phaser from 'phaser'
import GameScene from './scenes/GameScene'
import MainMenuScene from './scenes/MainMenuScene'

const speedDown=1500

const gameCanvas=document.getElementById('gameCanvas')

const config={
    type:Phaser.WEBGL,
    width: window.innerWidth,
    height:  window.innerHeight,
    canvas:gameCanvas,
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:speedDown},
            debug:true
        }
    },
    scene:[MainMenuScene,GameScene]
}

const game=new Phaser.Game(config)