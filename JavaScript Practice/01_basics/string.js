// name="subhashis"
// age=25
// console.log("heyy its "+ name +" and i am "+age+" years old.");

// console.log(`heyy i am ${name} and i am ${age}.`);

// we are creating a string of object type here.it saves each chars in key value pair.
const gameName = new String("subhashis")
// console.log(gameName.length)//9
// console.log(gameName[0]);//s
// console.log(gameName.toUpperCase());
// console.log(gameName.charAt(2));//it finds the character at an index number.
// console.log(gameName.indexOf('s'));//it gives the index of a character at its first appearance.

const newString = gameName.substring(0,4)//It gives characters from 0 to 3.It doesn't include negative values.
console.log(newString);//subh

// const anotherName=gameName.slice(-2)
// console.log(anotherName);//"is"

const anotherName=gameName.slice(1,5)
console.log(anotherName);//"ubha"

// const newStringOne="     subha    "
// console.log(newStringOne);
// console.log(newStringOne.trim());// It trims the white space and line terminator characters from both front and back.

//  const newStringTwo="subhashis20rath"
//  console.log(newStringTwo.replace("20"," "));//It replaces characters with another desirable character.

//  let exampleForSplit="i-am-really-hungry"//it splits the string into arraay based on a separator.
//  console.log(exampleForSplit.split("-"))//["i","am","really","hungry"]
 

