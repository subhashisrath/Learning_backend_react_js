// Immediately Invoked Function Expressions (IIFE)
// Its a function in js that runs immediately as soon as it i defined.
//The func is wrapped in parentheses.
//It is called immediately.
// Variables inside IIFE can't be accessed outside , so they don't pollute the global scope.

(function tea(){
    //its called named IIFE
    console.log(`DB CONNECTED.`);  
})();

//We must have to add a ";" at the end for others to work properly

((name) => {
    //Unnamed IIFE
    console.log(`DB CONNECTED TWO ${name}`);
})('subhashis'); //DB CONNECTED TWO subhashis

