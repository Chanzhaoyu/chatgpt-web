// String containing code snippets
let str = "let x = 10; console.log(x);"

// Create regex pattern
let regexp = /^(?:\s{4}|\t).+/gm

// Test if any code snippets were detected
if (str.match(regexp)) {
  // Code snippet was detected, do something with it
  console.log(str)
}
