let firstNumber = "0";
let secondNumber = "0";
let result = "0";
let lastResult;
let currentOperator;
let evaluation = [];
const screen = document.querySelector(".screen");
const keyboard = document.querySelector(".keyboard");

//eはイベントオブジェクト、イベント発生時の情報があり、内容にtarget(これは発生させた場所、ここではkeyboard),type(clickのこと),pointerType(発生させたデバイス)などがある
keyboard.addEventListener('click', function(e) {
    e.stopImmediatePropagation(); //同じイベントが複数ある場合の伝播をなくす。対象のボタンだけ反応させる
    onButtonPress(e);
})

function onButtonPress(e) {
    switch (e.target.getAttribute('data-button-type')){
        case 'digit':
            AssignNumber(e)
            break;
        case 'operator':
            AssignOperator(e)
            break;
    }
    render(e)
}

function AssignNumber(e){
// firstNumber
    if(evaluation.length <= 1){
        firstNumber = (firstNumber=="0") ? e.target.getAttribute('data-value') //(条件)?(真の場合):(負の場合)
                    : (lastResult) ? e.target.getAttribute('data-value')
                    : firstNumber + e.target.getAttribute('data-value');

        if(evaluation.length == 1) evaluation.shift();
        evaluation.push(firstNumber)
        result = firstNumber
        return;
    } 

    // secondNumber
    if(evaluation.length >= 2){
        secondNumber = (secondNumber=="0") ? e.target.getAttribute('data-value')
                    : secondNumber + e.target.getAttribute('data-value');
        if(evaluation.length == 3) evaluation.pop();
        evaluation.push(secondNumber);
        result = secondNumber;
    }
}

function AssignOperator(e){
    currentOperator =  e.target.getAttribute('data-value');
    if(
        currentOperator == '%' || 
        currentOperator == '+/-' ||
        currentOperator == 'clear' ||
        currentOperator == '=' 
        ){
            return operate();
        }

        if(evaluation==3) operate();
        if(evaluation.length==2) evaluation.pop();
        evaluation.splice(1,1,currentOperator);
}

function operate(){
    if(currentOperator == '%' && evaluation.length){
        let number = parseInt(evaluation[evaluation.length-1])
        result = (number/100).toString();
        result = (result=='NaN') ? 'Error' :result;
        evaluation.splice(evaluation.length-1, 1, result);
        return;
    }
    if(currentOperator == '+/-' && evaluation.length){
        result = (evaluation[evaluation.length-1] * -1).toString();
        result = (result=='NaN') ? 'Error' :result;
        evaluation.splice(evaluation.length-1, 1, result);
        return;
    }
    if(currentOperator == 'clear'){
        firstNumber = '0';
        evaluation = [];
        secondNumber = '0';
        result = '0';
        return;
    }
    // Right
    if(evaluation.length==3){
        result = (eval(evaluation.join().replace(/,/g,''))).toString();
        firstNumber = result;
        secondNumber ='0';
        evaluation = [firstNumber];
        lastResult = result;
    }
}

function render(e){
    let newOperatorButton = e.target;
    let lastOperatorButton = document.querySelector('.selected_operator');

    lastOperatorButton ? lastOperatorButton.classList.remove('selected_operator') : null;
    newOperatorButton ? newOperatorButton.classList.add('selected_operator') : null;

    // Change font-size
    switch (result.toString().length){
        case 5:
            screen.style.fontSize = '4.2rem'
            break;
        case 6:
            screen.style.fontSize = '3.7rem'
            break;
        case 7:
            screen.style.fontSize = '3.5rem'
            break;
        case 8:
            screen.style.fontSize = '3.0rem'
            break;
        case 9:
            screen.style.fontSize = '2.7rem'
            break;

        default:
            break;
    }

    if(result.toString().length > 9){
        screen.textContent = parseFloat(result).toPrecision(3);
    }else {
        screen.textContent = result;
    }    
}