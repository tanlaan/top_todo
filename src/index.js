import {Project, Task} from './task.js'

let test = new Task('test',0,'10-10-21','Do the thing', "But don't forget that thing", ['#bro'])
let todos = new Project('todos')
todos.add(test)
console.log(todos.list())