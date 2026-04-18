const canvas=document.querySelector('canvas')
const c=canvas.getContext('2d')

canvas.width=1024
canvas.height=576
width=1024
height=576
window.gameState={
    won:false
}

function setupCanvasResolution(){
    const dpr=window.devicePixelRatio || 1
    canvas.width=Math.floor(width*dpr)
    canvas.height=Math.floor(height*dpr)
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.imageSmoothingEnabled=false
}

function resizeCanvasDisplay(){
    const rawScale=Math.min(
        window.innerWidth/width,
        window.innerHeight/height
    )
    const scale=rawScale>=1 ? Math.floor(rawScale):rawScale

    canvas.style.width=`${Math.round(width*scale)}px`
    canvas.style.height=`${Math.round(height*scale)}px`
}
window.addEventListener('resize',()=>{
    setupCanvasResolution()
    resizeCanvasDisplay()
})
setupCanvasResolution()
resizeCanvasDisplay()

const bodyBackgroundChannels=getComputedStyle(document.body).backgroundColor
                              .match(/\d+(?:\.\d+)?/g)
                              .slice(0, 3)
                              .map(Number)

function updateBodyFadeBackground(opacity){
    const fadeMultiplier=1-opacity
    const r=Math.round(bodyBackgroundChannels[0]*fadeMultiplier)
    const g=Math.round(bodyBackgroundChannels[1]*fadeMultiplier)
    const b=Math.round(bodyBackgroundChannels[2]*fadeMultiplier)
    document.body.style.backgroundColor=`rgb(${r}, ${g}, ${b})`
}
let parsedCollisions
let collisionBlocks=[]
let background
let doors=[]
let isTransitioning=false
console.log(collisionLevel1.length)
console.log(collisionLevel1.length % 16)

const player=new Player({collisionBlocks,
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
        enterDoor:{
            frameRate:8,
            frameBuffer:4,
            loop:false,
            imageSrc:'./sprites/enterDoor.png',
            onComplete:()=>{
                if(isTransitioning){
                    return
                }
                isTransitioning=true
                console.log('completed animation')
                gsap.killTweensOf(overlay)
                gsap.to(overlay,{
                    opacity:1,
                    onComplete:()=>{
                        level++

                        if(level===4){
                            level=1
                        }
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput=false
                        isTransitioning=false
                        gsap.to(overlay,{
                            opacity:0,
                        })
                    }
                })
            }
        },
    }
})
let level=1
let levels={
    1:{
        init:()=>{
            parsedCollisions=collisionLevel1.parse2D()
            collisionBlocks=parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks=collisionBlocks

            if(player.currentAnimation){
                player.currentAnimation.isActive=false
            }
                background=new Sprite({
                    position:{
                        x:0,y:0
                    },
                    imageSrc:'./sprites/bg.png'
                })
                doors=[
                    new Sprite({
                    position:{x:767,y:270},
                    imageSrc:'./sprites/doorOpen.png',
                    frameRate:5,
                    frameBuffer:5,
                    loop:false,
                    autoplay:false,
                    }),
                ]
            }
        },
        2:{
            init:()=>{
                parsedCollisions=collisionLevel2.parse2D()
                collisionBlocks=parsedCollisions.createObjectsFrom2D()
                player.collisionBlocks=collisionBlocks
                player.position.x=96
                player.position.y=140

                if(player.currentAnimation){
                    player.currentAnimation.isActive=false
                }
                background=new Sprite({
                    position:{
                        x:0,y:0
                    },
                    imageSrc:'./sprites/bglvl2.png',
                })
                doors=[
                    new Sprite({
                        position:{
                            x:772.0,
                            y:336,
                        },
                        imageSrc:'./sprites/doorOpen.png',
                        frameRate:5,
                        frameBuffer:5,
                        loop:false,
                        autoplay:false,
                    })
                ]
            },
        },
        3:{
            init:()=>{
                parsedCollisions=collisionsLevel3.parse2D()
                collisionBlocks=parsedCollisions.createObjectsFrom2D()
                player.collisionBlocks=collisionBlocks
                player.position.x=750
                player.position.y=230
                if(player.currentAnimation){
                    player.currentAnimation.isActive=false
                }

                background=new Sprite({
                    position:{
                        x:0,y:0
                    },
                    imageSrc:'./sprites/bglvl3.png',
                })

                doors=[
                    new Sprite({
                        position:{
                            x:176,
                            y:335,
                        },
                        imageSrc:'./sprites/doorOpen.png',
                        frameRate:5,
                        frameBuffer:5,
                        loop:false,
                        autoplay:false
                    })
                ]
            }
        }
}
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
const overlay={
    opacity:0,
}

let musicStarted=false
function animate(){
    window.requestAnimationFrame(animate)
    if(!background){
        return
    }
    if(!musicStarted && (keys.a.pressed || keys.d.pressed || keys.w.pressed)){
        if(window.gameSound){
            window.gameSound.unlock()
            musicStarted=true
        }
    }
    // c.fillStyle='white'
    // c.fillRect(0,0,canvas.width,canvas.height);
    background.draw()
    // CollisionBlocks.forEach((CollisionBlock)=>{
    //     CollisionBlock.draw()
    // })
    player.velocity.x=0
    if(!player.preventInput){
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
    } else {
        player.velocity.y=0
    }
     doors.forEach((door)=>{
        door.draw()
     })
    player.draw()
    if(!player.preventInput){
        player.update()
    }
    c.save()
    c.globalAlpha=overlay.opacity
    c.fillStyle='black'
    c.fillRect(0, 0, canvas.width,canvas.height)
    c.restore()
}
levels[level].init()
animate()