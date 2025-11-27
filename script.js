const board=document.getElementById("board")
const blockheight=50
const blockwidth=50
const btnstrt=document.querySelector("btn-strt")
const modal=document.querySelector("modal")
const cols=Math.floor(board.clientWidth/blockwidth)
const rows=Math.floor(board.clientHeight/blockheight)
const blocks=[]

let intervalid=null
let food={
    x:Math.floor(Math.random()*rows),
    y:Math.floor(Math.random()*cols)
}

const snake=[
    {x:1,y:3},
]
 let direction='down'

for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
            const block=document.createElement('div')
                 block.classList.add("block")
    board.appendChild(block)
block.innerText=`${row}-${col}`
    blocks[`${row}-${col}`]=block
    }
}
function render(){
     let head=null

     blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction ==="left"){
  head={x:snake[0].x,y:snake[0].y-1}
    }else if(direction ==="right"){
          head={x:snake[0].x,y:snake[0].y+1}

    }else if(direction ==="down"){
          head={x:snake[0].x+1,y:snake[0].y}

    }else if(direction ==="up"){
          head={x:snake[0].x-1,y:snake[0].y}

    }
    if(head.x<0||head.x>=rows||head.y<0||head.y>=rows){
        alert("game over")
        clearInterval(intervalid)
    }
   if(head.x==food.x && head.y==food.y){
     blocks[`${food.x}-${food.y}`].classList.remove("food")
food={
    x:Math.floor(Math.random()*rows),
    y:Math.floor(Math.random()*cols)
}
     blocks[`${food.x}-${food.y}`].classList.remove("food")
snake.unshift(head)
 }

      snake.forEach(segment=>{
blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    
    snake.unshift(head)//add oneatfirst
 snake.pop()//remove one at end 
    snake.forEach(segment=>{
blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })
}
// intervalid=setInterval(()=>
// {
   
//     render()
// },500
// )
btnstrt.addEventListener("click",()=>{
    modal.style.display="none"
    intervalid=setInterval(()=>{
        render()
    },300)
})

addEventListener("keydown",(event)=>{
if(event.key=="ArrowUp"){
    direction="up"
}else if(event.key=="ArrowRight"){
    direction="right"
}else if(event.key=="ArrowLeft"){
    direction="left"
}else if(event.key=="ArrowDown"){
    direction="down"
}
})