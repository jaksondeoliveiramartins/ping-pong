const canvasE1 = document.querySelector("canvas"), canvasCtx = canvasE1.getContext("2d"),
gapx = 10

const mouse = { x: 0, y: 0}
// objeto campo
const field = {
    w: window.innerWidth, // largura do campo-- this ta chamando aqui
    h: window.innerHeight, // altura do campo -- "this" ta chamando aqui
    draw: function(){
        canvasCtx.fillStyle = "#286047" // style tem que esta com "S" maiusculo
        canvasCtx.fillRect(0, 0,this.w, this.h)
    }
}

// Desenhando a linha central
// objeto line

const line = {
    w:15,  // this esta chamando aqui
    h: field.h,
    draw: function(){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect( field.w / 2 - this.w / 2, 
        0, 
        this.w, 
        this.h 
    )

    },
}
//desenhando a raquete esquerda
const leftPaddle = {
    x: gapx,
    y: 0,
    w: line.w,
    h: 200,
    _move: function(){
        this.y = mouse.y - this.h / 2
        if (window.innerWidth < 450) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    draw:function(){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x,this.y, this.w, this.h)

        this._move()
    },
}
// desenho da raquete direita
const  rightPaddle = {
    x: field.w - line.w - gapx,
    y: 0,
    w: line.w,
    h: 200,
// ajustando a fisica da raquete direita
    speed: 4,
    _move: function(){
        
        
        if (this.y + this.h / 2 < ball.y + ball.r){
            this.y += this.speed
        }else{
            this.y -= this.speed
        }
        this.y = ball.y
    },
    speedUp: function (){
        this.speed += 2
    },
    draw:function(){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x,this.y, this.w, this.h)

        this._move()
    },

}
// desenhar o placar  
const score = {
    human: 0,
    computer: 0,
    increaseHuman: function(){
        this.human++
    },
    increaseComputer: function(){
        this.computer++
    },

    draw: function(){
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = '#01341D'
        canvasCtx.fillText(this.human,field.w /4, 50 )
        canvasCtx.fillText(this.computer,field.w /4 + field.w / 2, 50)

    },
}
// desenho da bolinha
const ball = { 
    x:field.w / 2,
    y:field.h /2,
    r:20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function(){
// verificando se o jogador 1 fez um ponto ( x > largura do campo)
        if(this.x > field.w - this.r - rightPaddle.w - gapx){
// verifica se a raquete direita esta na posição y da bola
            if(
            this.y + this.r > rightPaddle.y && 
            this.y - this.r < rightPaddle.y + rightPaddle.h) {
//rebate a  bola intervertendo o sinal do eixo x
            this._reverseX()
        }
        else{
            // pontuar o jogador 1
        score.increaseHuman()
        this._pointUp()
        }

    }
// verifica se o jogador 2  fez um ponto (x < 0)
        if(this.x < this.r + leftPaddle.w + gapx){
// verifica se a raquete esquerda  está na posição y da bola 
            if(this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h){
//rebate a bola intervertendo o sinal de x
                this._reverseX()
// pontuar jogador 2                        
            }else{
                score.increaseComputer()
                this._pointUp()

            }
        }

// verifica as laterais superior e inferior do campo
        if(
            (this.y - this.r < 0 && this.directionY < 0) ||
        (this.y > field.h - this.r && this.directionY > 0)
        )   {
            this._reverseY()
        }
        
    },
    
// rebatendo nas laterais do  campo
    _reverseX: function(){
        // 1 * -1 = -1
        // -1 * -1 = 1
        this.directionX *= -1
    },
    _reverseY: function() {
        // 1 * -1 = -1
        // -1 * -1 = 1
        this.directionY *= -1

    },
    // aumentando  a  velocidade da bola
    _speedUp: function(){
        this.speed += 6
    },
    
    _pointUp: function(){
        this._speedUp()
        rightPaddle.speedUp()

        this.x = field.w / 2
        this.y = field.h / 2
    },
    _move: function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed

    },
    draw:function (){
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()

    },

}




   // Desenhando o campo 
function setup(){ 
    canvasE1.width = canvasCtx.width = field.w
    canvasE1.height = canvasCtx.height = field.h

}
// Desenho do campo
     
function draw () {
    field.draw()
    line.draw()

    leftPaddle.draw()
    rightPaddle.draw()

    ball.draw()
    score.draw()

// height é a  altura

}

window.animateFrame = (function(){
    return(
        window.requestAnimationFrame ||
        function (callback){
            return window.setTimeout(callback,1000 / 60)
        }


    )

})()
function main (){
    animateFrame(main)
    draw()

}
setup()
main()

canvasE1.addEventListener('mousemove', function(e){
    mouse.x = e.pageX
    mouse.y = e.pageY

  
})
