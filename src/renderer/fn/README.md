## src/renderer/fn/ ##

A function goes here if it interacts with the Node API; if a function requires `path` or 
`fs`, it should go in this folder. The function should then be imported into the 
corresponding Vue Component for execution. 

Each function should take input from the corresponding Vue Component and return output 
that updates the Component's local state or the user's FS.

These functions should not alter global state or hook into the Vuex Store in any way. If 
the Store needs to be updated as a result of one of these functions, pass a 
`$store.dispatch`-type callback to the function that is executed from the Component 
once the function has called it.
