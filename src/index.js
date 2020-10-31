import {Project, Task} from './task.js'

import {loadHeader, renderTask} from './gui.js'

let defaultProject = new Project()

let testTask = new Task('My test', 0, '01/01/21', 'This is a thing to do.', "Don't forget to do this.", ['tags', 'n', 'stuff'])
let otherTask = new Task('Another one', 4, '06/01/21', 'We do the stuff.', "Don't forget to do this.", ['tags', 'n', 'stuff'])

defaultProject.add(testTask)
defaultProject.add(otherTask)

let root = document.getElementsByTagName('MAIN')[0]

loadHeader(root)

for (let task in defaultProject.storage){
    renderTask(root, defaultProject.storage[task])
}

