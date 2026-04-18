const canvas=document.querySelector('canvas')
const c=canvas.getContext('2d')

canvas.width=1024
canvas.height=576

const parsedCollisions=collisionLevel1.parse2D()
const CollisionBlocks=parsedCollisions.createObjectsFrom2D()
console.log(collisionLevel1.length)
console.log(collisionLevel1.length % 16)

const backgroundLevel1=new Sprite({
    position:{x:0,y:0},
    imageSrc:'./sprites/bg.png',
})

const player=new Player({collisionBlocks:CollisionBlocks,
    imageSrc:'./sprites/idle.png',
    frameRate:11,
    animations:{
        idleRight:{
            frameRate:11,
            frameBuffer:2,
            loop:true,
            imageSrc:'./sprites/idle.png',
        },
        idleLeft:{
            frameRate:11,
            frameBuffer:2,
            loop:true,
            imageSrc:'./sprites/idleLeft.png',
        },
        runRight:{
            frameRate:8,
            frameBuffer:4,
            loop:true,
            imageSrc:'./sprites/runRight.png',
        },
        runLeft:{
           frameRate:8,
           frameBuffer:4,
           loop:true,
           imageSrc:'./sprites/runLeft.png'
        },
    }
})

const keys={
    w:{
        pressed:false,
    },
    a:{
        pressed:false,
    },
    d:{
        pressed:false,
    },
}
function animate(){
    window.requestAnimationFrame(animate)
    // c.fillStyle='white'
    // c.fillRect(0,0,canvas.width,canvas.height);
    backgroundLevel1.draw()
    CollisionBlocks.forEach((CollisionBlock)=>{
        CollisionBlock.draw()
    })
    player.velocity.x=0
    if(keys.d.pressed){
        player.switchSprite('runRight')
        player.velocity.x=5
        player.lastDirection='right'
    }
    else if(keys.a.pressed){
        player.switchSprite('runLeft')
        player.velocity.x=-5
        player.lastDirection='left'
    }
    else{
        if(player.lastDirection==='left'){
            player.switchSprite('idleLeft')
        }
        else{
            player.switchSprite('idleRight')
        }
    }

    player.draw()
    player.update()
}

animate()