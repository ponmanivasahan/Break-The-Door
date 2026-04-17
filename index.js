const canvas=document.querySelector('canvas')
const c=canvas.getContext('2d')

canvas.width=1024
canvas.height=576

const parsedCollisions=collisionLevel1.parse2D()
const CollisionBlocks=parsedCollisions.createObjectsFrom2D()

const backgroundLevel1=new Sprite({
    position:{x:0,y:0},
    imageSrc:'./sprites/bg.png',
})

const player=new Player({CollisionBlocks})

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
        player.velocity.x=5
    }
    else if(keys.a.pressed){
        player.velocity.x=-5
    }

    player.draw()
    player.update()
}

animate()