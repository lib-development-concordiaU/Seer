function open_question(bubbleID){

        let bubbleElement = document.querySelector('#'+bubbleID);
        bubbleElement.setAttribute('stop_animation','true');
        bubbleElement.classList.add('smooth');
        bubbleElement.classList.add('opened-question');
        bubbleElement.querySelector('#question-text').style.display = 'none';
        bubbleElement.style.left = '400px';
        bubbleElement.style.top = '0px';
        //move_to_center(bubbleElement);

        setTimeout(()=>{
            let open_question = bubbleElement.querySelector('#open-question');
            open_question.classList.add('show');
            open_question.classList.remove('hidden');           
        },1000);

        // close the question after 5 minutes
        setTimeout( ()=>{
            close_question(bubbleID)  
        },300000);
          
}


function close_question(bubbleID){    
    let bubbleElement = document.querySelector('#'+bubbleID);
    bubbleElement.setAttribute('stop_animation','false');
    bubbleElement.classList.remove('opened-question');
    
    let open_question = bubbleElement.querySelector('#open-question');
    open_question.classList.remove('show');
    open_question.classList.add('hidden');

    setTimeout(()=>{
        bubbleElement.querySelector('#question-text').style.display = 'block';
        animate_bubble(bubbleID);
        bubbleElement.classList.remove('smooth');
    },1000);
 
}

function open_detail(bubbleID,factID){
    let bubbleElement = document.querySelector('#'+bubbleID);
    let detailElement = bubbleElement.querySelector('#detail-fact');

    const fact = getFact(factID);

    detailElement.querySelector('#number').innerHTML = fact['number'];
    detailElement.querySelector('#text').innerHTML = fact['phrase'];
    detailElement.querySelector('#citation').innerHTML = fact['citation'];
    detailElement.querySelector('#rights').innerHTML = fact['rights'];
    detailElement.querySelector('#qr-code').setAttribute('src','Data/qrcodes/'+factID+'.png');



    detailElement.classList.add('display');
    detailElement.classList.remove('hidden');
    setTimeout( ()=>{
        detailElement.classList.add('show');
    },100);
}


function close_detail(bubbleID){
    let bubbleElement = document.querySelector('#'+bubbleID);
    let detailElement = bubbleElement.querySelector('#detail-fact');
    
    detailElement.classList.remove('show');
    setTimeout( ()=>{
        detailElement.classList.add('hidden');
        detailElement.classList.remove('display');
    },1000);
    
}


function generatepath(y){
    let path = [];
    for(let i = 0; i < 10000; i++){
        let new_y = Math.floor( Math.sin(i/360)*100 ) + y;
        path[i] = new_y;
    }
    return(path);
}


function animate_bubble(bubbleID){

   
    let bubbleElement = document.querySelector('#'+bubbleID);
    let boundingRect = bubbleElement.getBoundingClientRect();
    let moves_count = bubbleElement.getAttribute("moves_count");
    
    let x = boundingRect.x;
    let y = boundingRect.y;

    const screen_width = screen.width;
    const screen_height = screen.height;

    let direction = bubbleElement.getAttribute("current_direction");
    let angle = bubbleElement.getAttribute("rotation");
    let speed = bubbleElement.getAttribute("speed");

    let path = getAnimationPath(bubbleID);
    
    
    if(parseInt(x) == parseInt(screen_width) + 200){
        direction = 'left';
        angle = Math.floor( Math.random() * 45);
        //redraw the path
        path = generatepath(Math.floor(Math.random() * (screen_height-300) ));
        setAnimationPath(bubbleID,path);
        changeLevel(bubbleElement);
        changeSpeed(bubbleElement);
        moves_count = 10000;
    }
    if(parseInt(x) == -300){
        direction = 'right';
        angle = Math.floor( Math.random() * 45);
        path =  generatepath(Math.floor(Math.random() * (screen_height-300) ));
        setAnimationPath(bubbleID,path);
        changeLevel(bubbleElement);
        changeSpeed(bubbleElement);
        moves_count = 1;
    }

    if(direction == 'right'){
        if(moves_count < 10000){
            moves_count = parseInt(moves_count) + 1;
        }else{
            direction = 'left';
        }          
        if(moves_count % parseInt(speed) == 0){   
            bubbleElement.style.left = (parseInt(x) + 1 ) + "px";
            bubbleElement.style.top = parseInt(path[moves_count])*(1 + Math.cos(angle) ) + "px";
        }  
    }else if(direction == 'left'){
        if(moves_count > 1){
            moves_count = parseInt(moves_count) - 1;
        }else{
            direction = 'right';
        }
        
        if(moves_count % parseInt(speed) == 0 ){
            bubbleElement.style.left = (parseInt(x) - 1 )+ "px";
            bubbleElement.style.top =  parseInt(path[moves_count])*(1 + Math.cos(angle) )+ "px";    
        }
        
    }

    bubbleElement.setAttribute("rotation",angle);  
    bubbleElement.setAttribute("current_direction",direction);
    bubbleElement.setAttribute('moves_count',moves_count);
  
   
}

function close_bubbles(){
    bubbles.forEach( (bubble) =>{
        close_question(bubble);
    })
}

function animate_bubbles() {
    bubbles.forEach( (bubble) =>{
        const bubbleElement = document.querySelector('#'+bubble['id']);
        if( bubbleElement.getAttribute('stop_animation') == 'false' ){
            animate_bubble(bubble['id']);
        }
    })

    window.requestAnimationFrame(animate_bubbles);
}

function getAnimationPath(bubble_id){
    let path = [];
    bubbles.forEach( (bubble) =>{
        if(bubble['id'] == bubble_id){
            path = bubble['path'];
        }
    });
    return(path);
}

function setAnimationPath(bubble_id,path){
    bubbles.forEach( (bubble) =>{
        if(bubble['id'] == bubble_id){
            bubble['path'] = path;
        }
    });
}

function getFact(factID){
    let returnval = [];
    facts.forEach( (fact) =>{
        if(fact['id'] == factID){
            returnval = fact;
        }
    });
    return(returnval);
}

function changeLevel(bubbleElement){
    const level = Math.floor(Math.random() * 2) + 1;
    bubbleElement.classList.remove('level1');
    bubbleElement.classList.remove('level2');
    
    if(level <= 1){
        bubbleElement.classList.add('level1');
    }else{
        bubbleElement.classList.add('level2');
    }
}

function changeSpeed(bubbleElement){
    const speed = Math.floor(Math.random() * 4) + 1;
    bubbleElement.setAttribute('speed',speed);
}

let bubbles = [];
let facts = [];

function init(){
    fetch('Data/seer.json').then( (defitions) => {
        defitions.json().then( (questions) =>{
            let index = 0;
            questions.forEach( (question) =>{
                let newBubbleHTML = document.querySelector('#bubble-template').content.cloneNode(true);

                const bubble_id = 'bubble_'+index;
                
                newBubbleHTML.querySelector('#question-text').innerHTML = question['question'] + "?";
                newBubbleHTML.querySelector('#question-text').setAttribute('onclick',"open_question('"+bubble_id+"')");  
                newBubbleHTML.querySelector('#close-grid-btn').setAttribute('onclick',"close_question('"+bubble_id+"')");

                
                for(let i =0; i < 6; i++){
                    if(question['cards'][i] !== undefined){
                        let fact = newBubbleHTML.querySelector('#fact'+(i+1));
                        fact.setAttribute('onclick',"open_detail('"+bubble_id+"','"+question['cards'][i]['id']+"')");
                        fact.querySelector('#number').innerHTML = question['cards'][i]['number'];
                        if(parseInt(question['cards'][i]['number'].length) < 8){
                
                            fact.querySelector('#number').classList.remove('open-question-number');
                            fact.querySelector('#number').classList.add('open-question-number-2');
                        }
                        
                        fact.querySelector('#text').innerHTML = question['cards'][i]['phrase'];
                        facts.push(question['cards'][i]);        
                    }
                }
                
                newBubbleHTML.querySelector('#close-detail-btn').setAttribute('onclick',"close_detail('"+bubble_id+"')");
                
                let mainBubble = newBubbleHTML.querySelector('#bubble-id');
                let xpos = parseInt(index)*250;
                mainBubble.style.left = xpos + "px";
                mainBubble.style.top = parseInt(index)*50 + "px";
                mainBubble.setAttribute('id',bubble_id);
                mainBubble.setAttribute('moves_count',xpos+4000);

                changeLevel(mainBubble);
                changeSpeed(mainBubble);

                let direction = Math.random();
                if(direction <= 0.5){
                    mainBubble.setAttribute('current_direction','left');
                }else{
                    mainBubble.setAttribute('current_direction','right');
                }

                document.querySelector('#main').append(newBubbleHTML);

                //generate initial position and animation paths

                let path = generatepath( parseInt(index)*50 );
                const bubble = {
                    "id":'bubble_'+index,
                    "path": path
                }

                bubbles[index] = bubble;
                index++;
            });
        });
    
    });
    
    window.requestAnimationFrame(animate_bubbles);
}
