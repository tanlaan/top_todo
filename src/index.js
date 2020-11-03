import {Project, Task} from './task.js'

import {renderHeader, renderTabs, renderTask, renderFullTask, makeTaskContainer} from './gui.js'

let projects = []

let defaultProject = new Project()
defaultProject.name = 'Default'

let testTask = new Task('My test', 0, '01/01/21', 'This is a thing to do.', "Don't forget to do this.", ['tags', 'n', 'stuff'])
let otherTask = new Task('Another one', 4, '06/01/21', 'We do the stuff.', "Don't forget to do this.", ['tags', 'n', 'stuff'])

defaultProject.add(testTask)
defaultProject.add(otherTask)

projects.push(defaultProject)

let root = document.getElementsByTagName('MAIN')[0]

renderHeader(root)
renderTabs(root, projects)

for (let task of defaultProject.storage){
    let container = makeTaskContainer()
    renderTask(container, task)
    root.appendChild(container)
}

