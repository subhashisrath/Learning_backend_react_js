
var c = 30
{
    d=40
    let a = 10
    const b = 20
    // console.log("a = ",a , "b= ",b);
    // console.log("c= ",c);//here c is 30 cz var acts like global scope.
}

// console.log("a= ",a);// Gives error "a is undefined."bcz a & b are defined under block scope.

function one(){
    const username = "subhashis"

    function two(){
        const website = "hackerrank"
        console.log(username);
    }
    // console.log(website);//Error: "website variable is out of its block scope."
    two() 
}
// one()

// if(true){
    
//     const name ="subhas"
//     if(name==="subhas"){
//         const website = " youtube"
//         console.log(name + website);// NO eror
//     }
//     console.log(website);// error bcz website has block scope .
// }

console.log(one(5)) // 6
// we can access function before initializing when we are defining a function like this.
function one(num){
    return num+1
}


two(5)
// we can't access function before initilization when we are defining a function like this.
const two = function(num){ //function can be defined and can be held in a variable like this .
    return num+1
}

