function identityFunction(anArray, num, numOfConstraints){
    for(let i = 1 ; i <= numOfConstraints; i++){
         if(i == num){
              anArray.push(1);
         }else{
              anArray.push(0)
         }
    }

    console.log(anArray)
}


identityFunction([], 2, 3)
