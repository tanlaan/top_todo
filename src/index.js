import {Project, Task} from './task.js'
import {renderPage} from './gui.js'

window.projects = []

if(localStorage.getItem('projects')){
    projects = JSON.parse(localStorage.getItem('projects'))
    for (let project in projects){
        projects[project].__proto__ = Project.prototype
    }
} else{
    let defaultProject = new Project()
    defaultProject.name = 'Default'
    
    let testTask = new Task('My test', 0, '2021-01-01', 'This is a thing to do.', "Don't forget to do this.", ['tags', 'n', 'stuff'])
    let otherTask = new Task('Another one', 4, '2021-06-01', 'We do the stuff.', "Don't forget to do this.", ['tags', 'n', 'stuff'])
    
    defaultProject.add(testTask)
    defaultProject.add(otherTask)
    
    projects.push(defaultProject)
    
    let testProject = new Project()
    testProject.name = 'Testing'
    let different = new Task("I'm different", 0, '2021-01-01', 'This is a thing to do.', "Don't forget to do this.", ['tags', 'n', 'stuff'])
    different.complete = true
    testProject.add(testTask)
    testProject.add(otherTask)
    testProject.add(different)
    
    projects.push(testProject)
}

let root = document.querySelector('main')
renderPage(root, projects[0], projects)



