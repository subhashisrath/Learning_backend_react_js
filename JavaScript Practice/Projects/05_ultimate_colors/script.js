
 const randomColors = function (){
    const hex ="0123456789ABCDEF"
    let color = "#"
    for(let i = 0; i<6;i++){
        color += hex[Math.floor(Math.random()*16)]
    }
    return color;
}

    let intervalId = null ; 

    const startButton = document.getElementById("start")
    const stopButton =  document.getElementById("stop")

    function changeBgColor (){
        document.body.style.backgroundColor = randomColors();
    }

    startButton.addEventListener('click',() => {
        if (intervalId === null){
            intervalId = setInterval(changeBgColor ,1000)
        }
    });

    stopButton.addEventListener('click',() => {
        if (intervalId !== null){
            clearInterval(intervalId);
            intervalId = null;
        }    
    });