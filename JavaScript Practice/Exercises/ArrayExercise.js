const countries = [
  'Albania',
  'Bolivia',
  'Canada',
  'Denmark',
  'Ethiopia',
  'Finland',
  'Germany',
  'Hungary',
  'Ireland',
  'Japan',
  'Kenya',
]

const webTechs = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB',
]

// 1. Declare an empty array;
const emptyArray = []
// 2. Declare an array with more than 5 number of elements
const numbersArray = [10, 20, 30, 40, 50, 60, 70]
// 3. Find the length of your array
const lengthOfNumbersArray = numbersArray.length
console.log('Length of numbersArray:', lengthOfNumbersArray)
// 4. Get the first item, the middle item and the last item of the array
const firstItem = numbersArray[0]
const middleItem = numbersArray[Math.floor(numbersArray.length / 2)]
const lastItem = numbersArray[numbersArray.length - 1]
console.log('First item:', firstItem)
console.log('Middle item:', middleItem)
console.log('Last item:', lastItem)
// 5. Declare an array called mixedDataTypes, put different data types in the array and find the length of the array. The array size should be greater than 5
const mixedDataTypes = [
  'Hello',
  42,
  true,
  null,
  undefined,
  { name: 'John' }
]
console.log('Length of mixedDataTypes:', mixedDataTypes.length)
// 6. Declare an array variable name itCompanies and assign initial values Facebook, Google, Microsoft, Apple, IBM, Oracle and Amazon
const itCompanies = [
  'Facebook',
  'Google',
  'Microsoft',
  'Apple',
  'IBM',
  'Oracle',
  'Amazon'
]
// 7. Print the array using console.log()
console.log('IT Companies:', itCompanies)
// 8. Print the number of companies in the array
console.log('Number of IT Companies:', itCompanies.length)
// 9. Print the first company, middle and last company
console.log('First company:', itCompanies[0])
console.log('Middle company:', itCompanies[Math.floor(itCompanies.length / 2)])
console.log('Last company:', itCompanies[itCompanies.length - 1])
// 10. Print out each company
itCompanies.forEach(company => console.log(company))
// 11. Change each company name to uppercase one by one and print them out
itCompanies.forEach(company => console.log(company[0].toUpperCase()+company.slice(1,company.length-1)))
// 12. Print the array like as a sentence: Facebook, Google, Microsoft, Apple, IBM,Oracle and Amazon are big IT companies.
// 13. Check if a certain company exists in the itCompanies array. If it exist return the company else return a company is not found
// 14. Filter out companies which have more than one 'o' without the filter method
// 15. Sort the array using sort() method
// 16. Reverse the array using reverse() method
// 17. Slice out the first 3 companies from the array
// 18. Slice out the last 3 companies from the array
// 19. Slice out the middle IT company or companies from the array
// 20. Remove the first IT company from the array
// 21. Remove the middle IT company or companies from the array
// 22. Remove the last IT company from the array
// 23. Remove all IT companies
