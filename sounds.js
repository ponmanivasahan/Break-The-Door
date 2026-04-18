const gameSound=(()=>{
    const path='./music/bgMusic.mpeg'
    const doorOpenPath='./music/doorOpen.mp3'

    let bgMusicAudio=null
    let doorOpenAudio=null
    let isUnlocked=false

    function ensureAudio(){
        if(bgMusicAudio){
            return
        }
        bgMusicAudio=new Audio(path)
        bgMusicAudio.loop=true
        bgMusicAudio.preload='auto'
        bgMusicAudio.volume=0.45

        bgMusicAudio.addEventListener('error',()=>{
            console.error('background music fails')
        })
        doorOpenAudio=new Audio(doorOpenPath)
        doorOpenAudio.preload='auto'
        doorOpenAudio.volume=0.55

        doorOpenAudio.addEventListener('error',()=>{
            console.error('door open sound fails')
        })
    }

    function playDoorOpen(){
        ensureAudio()
        if(!doorOpenAudio) return

        doorOpenAudio.currentTime=0
        const playPromise=doorOpenAudio.play()
        if(playPromise && typeof playPromise.catch==='function'){
            playPromise.catch(()=>{ })
        }
    }

    function unlock(){
        ensureAudio()
        if(isUnlocked) return

        isUnlocked=true
        const playPromise=bgMusicAudio.play()
        if(playPromise && typeof playPromise.catch==='function'){
            playPromise.catch(()=>{ })
        }
    }

    function stopAll(){
        if(bgMusicAudio){
            bgMusicAudio.pause()
            bgMusicAudio.currentTime=0
        }
        if(doorOpenAudio){
            doorOpenAudio.pause()
            doorOpenAudio.currentTime=0
        }
    }
    return{
         unlock,stopAll,setWalking:()=>{ },
         playjump:()=>{ },playDoorOpen,
         playDoorClose:()=>{ },
    }
})()

window.gameSound=gameSound