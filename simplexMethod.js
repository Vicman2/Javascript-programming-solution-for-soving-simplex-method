// This is the algorithm for simplex method
const inquirer = require('inquirer');


//The cli table module
const Table = require('cli-table');


//The color module
const colors = require('colors');


// Our header function
function header(title, msg) {
    console.clear();

    var table = new Table({
         chars: { 'top': '═', 'top-left': '╔', 'top-right': '╗', 'bottom': '═', 'bottom-left': '╚', 'bottom-right': '╝', 'left': '║', 'right': '║' },
         head: [title],
         colWidths: [72],
         colAligns: ['middle']
    });
    console.log(table.toString());

    if (msg.length < 1) {
         console.log();
    } else {
         console.log();
         console.log(colors.red('=> '), msg)
         console.log()
    }
}

//The function is our entry point

function init(msg) {
    header("Welcome to Unizik Department", msg)
   inquirer
     .prompt([
          {
               type: "input",
               name: "clientName",
               message: "Please enter your name",
               validate: function(input){
                    if(/^\w+\s?\w+/.test(input)){
                         return true;
                    }else{
                         return "Input a valid name please";
                    }
               }
          }
     ])
     .then(answer => {
          welcome(answer.clientName, "Feel free to solve your problem in our website");
     })
}


// This function is called when we have already know the name of the user
function welcome(Name, msg) {
    header("Welcome to VICTECH SOLUTION Application", msg)
    console.log();
    console.log("Hello!" + " " + Name + " " + "you are welcome to Unizik, Mathematics Department");
    console.log();
    console.log("We solve optimization problems using simplex method")
     inquirer
          .prompt([
          {
               type: "confirm",
               name : "startProgram",
               message : "Do you want to start solving the problem ? "
          }
     ])
     .then( answer =>{
          if(answer.startProgram == true){
              getTheNumberOfDecisionVariables();
          }else{
               console.log("");
               console.log("-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
               console.log("Thank you for choosing VIcTech solution application, would like to see you again.")
               console.log();
               console.log("-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
          }
     })
}

var objFunc = [];

var numberOfConstraints;
 var noOfDecVarWihoutRHS // No of decision variables without right hand side

var noOfDecisionVariables;


// This function gets the number of decision variables
function getTheNumberOfDecisionVariables(){
     header("PROVIDE US WITH THE RELEVANT INFORMATIONS", "The Number of decision variables");
     inquirer.prompt([
          {
               type: "input",
               name: "numberOfDecisionVAriables",
               message : "Please, enter the number of decision variables ",
               validate: function(input){
                    input = parseFloat(input);
                    if(Number.isInteger(input) && input >=2){
                         return true;
                    }else{
                         return "Please enter an integer value";
                    }
               }
          }
     ])
     .then( answer => {
          noOfDecisionVariables = answer.numberOfDecisionVAriables;
          getObjectiveFucntion(noOfDecisionVariables, 1);
     })
}

var  noOfDecVar


// This function gets the objective function
function getObjectiveFucntion(noOfDecisionVariables, ourPosition){
     if(noOfDecisionVariables > 0){
          inquirer.prompt([
               {
                    type: "input",
                    name: "decisionCoefficient",
                    message: "Input the coefficient of decision variable " + ourPosition + " ",
                    validate: function(input){
                         input = parseFloat(input)
                         if(!isNaN(input)){
                              return true;
                         }else{
                              return "Enter a valid number please"
                         }
                    }
               }
          ])
          .then( answer => {
               num =parseFloat(answer.decisionCoefficient)
               objFunc.push(num);
               noOfDecisionVariables--;
               ourPosition++;
               getObjectiveFucntion(noOfDecisionVariables, ourPosition);
          })
     }else{
         objFunc.push(0);
         getNumberOfConstrainsts()
         noOfDecVar = objFunc.length;
     }
}

let ConstAccumulator = []; 
let tabulate = [];


// This gets the number of constraints
function getNumberOfConstrainsts(){
     header("we are now looking at the constraints", "We need to know the number of constraints you have modelled");
     inquirer
          .prompt([
               {
                    type: "input", 
                    name: "noOfContraints",
                    message : "Please enter the number of constraints",
                    validate: function(input){
                         input = parseFloat(input);
                         if(Number.isInteger(input) && input >=2){
                              return true;
                         }else{
                              return "Please enter an integer value";
                         }
                    }
               }
          ])
          .then( answer => {
               numb = parseInt(answer.noOfContraints);
               numberOfConstraints = numb;
               getTheConstriant(numberOfConstraints, noOfDecVar, 1, 1);
          })
}


// Try adding up 0's to the path to make up tjhe standard table

function identityFunction(anArray, num, numOfConstraints){
     for(let i = 1 ; i <= numOfConstraints; i++){
          if(i == num){
               anArray.push(1);
          }else{
               anArray.push(0)
          }
     }
 }

 function fillUpObjectFunction(deAla, numofConst){
      for(i=1 ;i <= numofConst -1; i++){
           deAla.push(0);
      }
 }


// This function gets the constraints
function getTheConstriant(val,noOfDecVarr, constPos, dVPos){
     console.log( objFunc.length)
     if(noOfDecVarr == 1){ // If the we have filled in the spaces for the decision variables, then
          identityFunction(ConstAccumulator, constPos, numberOfConstraints); // Fill the vacums with zeros and one when necessary
     }
     function msg(){ // if the indicator is pointing the right hand side, Indicate the user that he/she should input the right hand side of the constraint
          if(noOfDecVarr == 1){
              return  "Enter the right handside of the constraint " + constPos + "  ";
          }else{
               return "Enter the coefficient of the  decision variable " + dVPos + " in  constraint " + constPos + " ";
          }
    }
    if(noOfDecVarr > 0 && val > 0){
          inquirer
           .prompt([
               {
                    type: "input",
                    name: "constVar",
                    message: msg(),
                    validate: function(input){
                         input = parseFloat(input)
                         if(!isNaN(input)){
                              return true;
                         }else{
                              return "Enter a valid number please"
                         }
                    }
               }
          ]).then( answer => {
               ans = parseFloat(answer.constVar);
               ConstAccumulator.push(ans);
               dVPos++;
               noOfDecVarr--;
               getTheConstriant(val, noOfDecVarr, constPos, dVPos);
          })
    }else if(noOfDecVarr <= 0  && val > 0){
         tabulate.push(ConstAccumulator);
         ConstAccumulator =[];
         val--
         noOfDecVarr = noOfDecVar;
         constPos ++;
         dVPos = val;
         getTheConstriant(val, noOfDecVar,constPos, dVPos);
    }else{
         fillUpObjectFunction(objFunc, numberOfConstraints);
         tabulate.push(objFunc.map(x => {
               return -x
         }));
         console.log(tabulate);
    }
}








init('');

