'use strict'
const gNumbers = []
const gGrid = []
let gPreClicked = 0
let gStartTime = Date.now()
let gTotalMoves = 0
const gModal = document.querySelector(".modal")
let gInterval;
const gNextMoveElm = document.querySelector("span.next-num")
const gElTime = document.querySelector(".timer")
const gJsConfetti = new JSConfetti()
let gBestScore = {
    16: Infinity,
    25: Infinity,
    36: Infinity
}
let gCurrLevel = 16

function init(num){

    gNumbers.length = 0
    createSequence(num)
    gTotalMoves = num
    gPreClicked = 0
    gNextMoveElm.innerText = 1
    gElTime.innerText = 0
    createGrid(num)
    renderTable(num)
    gModal.close()
    clearInterval(gInterval)
    gCurrLevel = num

    const elTimeToBeat = document.querySelector(".time-to-beat")
    if(gBestScore[num] < Infinity){
        elTimeToBeat.style.display = "block"
    } else {
        elTimeToBeat.style.display = "none"
    }
    
}

function createSequence(len){
    for(let i = 1; i<=len; i++){
        gNumbers.push(i)
    }
    return gNumbers
}

function getRandom(){
     return gNumbers.splice(getRandomInt(0,gNumbers.length),1)[0]
}

function createGrid(num){
    const gridSize = Math.sqrt(num)
    gGrid.length = 0
    for(let i = 0 ; i < gridSize; i++){
        gGrid.push([])
        for(let j = 0 ; j < gridSize; j++){
            gGrid[i][j] = getRandom()
        }
    }
    //console.table(gGrid)
}

function renderTable(num){
    const gridSize = Math.sqrt(num)
    let htmlTable = ''
    for(let i = 0 ; i < gridSize; i++){
        htmlTable += '<tr>'
        for(let j = 0 ; j < gridSize; j++){
            const currNum = gGrid[i][j]
            htmlTable += `<td onclick="play(this, ${currNum})"> ${currNum} </td>`
        }
        htmlTable += '</tr>'
    }
    document.querySelector("table").innerHTML = htmlTable
}

function play(btn, clickNum){

    if(gPreClicked + 1 === clickNum){
        gPreClicked = clickNum  
        btn.classList.add('good')
        btn.onclick = null
        gNextMoveElm.innerText = clickNum + 1 
        
        if(clickNum === 1) runTimer()
        
        if(gTotalMoves === clickNum) win()
    }else{
        lose()
    }

}

function runTimer(){
    gStartTime = Date.now()
    gInterval = setInterval(timer,30)
}

function timer(){
    const currentTime = Date.now()
    const elapstTime = (currentTime - gStartTime) / 1000
    const formattedTime = elapstTime.toFixed(3)
    gElTime.innerText = formattedTime;
    return formattedTime
}

function lose(){
    const modalTitle = document.querySelector(".modal .container h3")
    new Audio("./media/wrong.wav").play()
    modalTitle.innerText = 'Game Over'
    gModal.showModal()
    clearInterval(gInterval)
}

function win(){
    const modalTitle = document.querySelector(".modal .container h3")
    const time = +timer()
    clearInterval(gInterval)
    gJsConfetti.addConfetti()
    modalTitle.innerText = 'DONE! in: ' + time + 's'
    gModal.showModal()
    console.log('time ' + time + '\ngBestScore ' + gBestScore[gCurrLevel])
    console.log('time ' + typeof(time) + '\ngBestScore ' + typeof(gBestScore[gCurrLevel]))
    console.log(time < gBestScore[gCurrLevel])

    if (time < gBestScore[gCurrLevel])  newBest(time) 
}

function closeModal(){
    gModal.close()
}

function newBest(bestTime){
    //also include level
    console.log('New best' + gCurrLevel)
    gBestScore[gCurrLevel] = bestTime;
    const elModalTitle = document.querySelector(".modal .container h3")
    const elBestTime = document.querySelector("span.best-time")

    elModalTitle.innerText = 'New Record!: ' + bestTime + 's'
    elBestTime.innerText = bestTime

}

// HELPER FUNCTIONS

function getRandomInt(min = 1, max = 10) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
  