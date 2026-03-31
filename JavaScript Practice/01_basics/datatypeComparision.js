// console.log("2">1);//"2" gets converted to number =true
// console.log("02">1);// "02" -> 02>1

/*In >,< null gets converted to number 
which makes it 0, but that doesn't happen in == case.
*/


// console.log(null>0);// False, null gets converted to 0 in case of >,<,>=,<= so here null=0 .so false
// console.log(null==0);//False , here null does't get converted to 0,so null != 0 bcz null has no value
// console.log(null>=0);//True, here conversion happens so its true.

// console.log(undefined>5);


/* -----------STRING COMPARISION--------*/

//1. Strings are compared lexicographically (dictionary order).
//2. Comparison happens character-by-character.Compare 1st character of both strings:If equal → move to next,If not equal → decision made.
//3. Comparison uses Unicode values. -> "a" (97) < "b" (98), -> Uppercase < lowercase → "Z" < "a" is true
//4.5. If all chars are same → shorter string is smaller

let num1="5000000"
let num2="9"
// result=num2>num1
console.log(num2>num1);// = true ,it first compares the first character and compares it ,if its greater -> true,== -> "skip" else false.
