var defaultSession = 0
var sourceAudio ={
    dayTime:'../src/assets/sounds/birdsChirp.wav',
    nightTime:'../src/assets/sounds/insectsBuzz.wav'
} 
var nightAudio =new Howl({
    src:[sourceAudio.nightTime],
    loop: true,
    volume: 0.09
  });;
  var dayAudio = new Howl({
      src:[sourceAudio.dayTime],
      loop: true,
      auttoplay:true,
      volume: 0.09
    });
    var mute = false;

  
class NightMode {


    static createNaturemuteButton = () => {
        const button = document.createElement('button')

        button.onclick = () => {
            // console.log(mute)
            if(mute){
                mute = false
                if(defaultSession){
                    nightAudio.stop()
                    dayAudio.play()
                } else {
                    dayAudio.stop()
                    nightAudio.play()
                }
            } else {
                mute = true
                nightAudio.stop()
                dayAudio.stop()

            }
        }

        button.textContent = "Nature Sound Mute"
        const styleElement = (element) => {
            element.style.position = 'absolute';
            element.style.top = '20px';
            element.style.left = '100px';
            element.style.padding = '12px 6px';
            element.style.border = '1px solid #fff';
            element.style.borderRadius = '4px';
            element.style.background = 'rgba(0,0,0,0.1)';
            element.style.color = '#fff';
            element.style.font = 'normal 13px sans-serif';
            element.style.textAlign = 'center';
            element.style.opacity = '0.5';
            element.style.outline = 'none';
            element.style.zIndex = '999';
    
           }
           styleElement(button)
           return button
    }
    
    static createButton = (renderer) => {
        const button = document.createElement('button')

    
        
        const dayTime = () => {   
            renderer.setClearColor('#87CEFA');             
        }


        const nightTime = () => {
            renderer.setClearColor('#000000'); 
        }

       window.onload = () => {
        button.textContent = 'Night'
       }


       button.onclick = () => {
           dayAudio.autoplay = false
        //    console.log(mute)

        if(defaultSession){
            dayTime()
            if(mute){
                nightAudio.stop()
                dayAudio.stop()
            } else {
                nightAudio.stop()
                dayAudio.play()
            }
            defaultSession = 0
            button.textContent = 'Night'

        } else {
            nightTime()
            if(mute){
                nightAudio.stop()
                dayAudio.stop()
            } else {
                dayAudio.stop()
                nightAudio.play()
            }
            defaultSession = 1
            button.textContent = 'Day'
        }

       }

       const styleElement = (element) => {
        element.style.position = 'absolute';
        element.style.top = '20px';
        element.style.left = '30px';
        element.style.padding = '12px 6px';
        element.style.border = '1px solid #fff';
        element.style.borderRadius = '4px';
        element.style.background = 'rgba(0,0,0,0.1)';
        element.style.color = '#fff';
        element.style.font = 'normal 13px sans-serif';
        element.style.textAlign = 'center';
        element.style.opacity = '0.5';
        element.style.outline = 'none';
        element.style.zIndex = '999';

       }
       styleElement(button)
       return button

    }
}
export {NightMode}