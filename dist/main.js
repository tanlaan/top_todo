/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./src/task.js

class Task {
    constructor(title, priority = 0, dueDate, task, note, tags) {
        this.title = title
        this.priority = priority
        this.dueDate = dueDate
        this.task = task
        this.note = note
        this.tags = tags
        this.complete = false
    }

    changePriority(number){
        this.priority = number
    }

    toggleComplete(){
        this.complete == true ? this.complete = false : this.complete = true
    }

    addTag(tag){
        this.tag.push(tag)
    }

    removeTag(tag){
        this.tag.splice(this.tag.indexOf(tag),1)
    }
}


class Project {
    constructor(name){
        this.name = name
        this.storage = []
    }

    add(task){
        this.storage.push(task)
    }

    list(){
        return this.storage
    }

    remove(taskTitle){
        for(let i = 0; i < this.storage.length; i ++){
            if(this.storage[i].title == taskTitle){
                this.storage.splice(i, 1)
            }
        }
    }
}
// CONCATENATED MODULE: ./src/gui.js


function renderPage(element, project, projects) {
    _removeChildren(element)
    renderHeader(element)
    renderTabs(element, project.name, projects)
    renderProject(element, project)
}

function renderHeader(element) {
    let header = document.createElement('header')
    let title = document.createElement('h1')
    title.textContent = `Chris' Todo`
    header.appendChild(title)
    element.appendChild(header)
}

function renderTabs(element, selectedProject, projects) {
    let tabs = document.createElement('div')
    tabs.setAttribute('id', 'project-tabs')

    let list = document.createElement('ul')
    for (let project of projects){
        let item = document.createElement('li')
        if(selectedProject == project.name){
            item.setAttribute('id', 'selected-tab')
        }
        item.textContent = project.name
        item.addEventListener('click', function tabListener(event){
            renderPage(element, project, projects)
            item.removeEventListener('click', tabListener)
        })
        list.appendChild(item)
    }
    tabs.append(list)
    tabs.appendChild(_getAddProjectButton(projects))
    element.appendChild(tabs)
}

function makeTaskContainer(){
    let container = _makeClassContainer('task-box')
    return container
}

function _makeClassContainer(name) {
    let container = document.createElement('div')
    container.setAttribute('class', name)
    return container
}


function renderTask(element, task, project) {
    _removeChildren(element)

    element.addEventListener('click', function taskListener(event){
        renderFullTask(event.currentTarget, task, project)
        element.removeEventListener('click', taskListener)
    })

    let title = document.createElement('h3')
    title.textContent = task.title
    element.appendChild(title)

    let complete = document.createElement('input')
    complete.setAttribute('type', 'checkbox')
    complete.checked = task.complete

    let taskText = document.createElement('p')
    taskText.textContent = task.task
    element.appendChild(taskText)
    element.appendChild(_getRemoveTaskButton(task, project))

}

function renderFullTask(element, task, project) {
    _removeChildren(element)
    element.classList.add('expanded')

    element.addEventListener('click', function fullTaskListener(event) {
        element.classList.remove('expanded')
        renderTask(event.currentTarget, task, project)
        element.removeEventListener('click', fullTaskListener)
    })

    let title = document.createElement('h3')
    title.textContent = task.title
    element.appendChild(title)

    let subtitle = document.createElement('p')
    subtitle.textContent = `Priority: ${task.priority} | Due: ${task.dueDate} | Complete: `
    let complete = document.createElement('input')
    complete.setAttribute('type', 'checkbox')
    complete.checked = task.complete
    complete.addEventListener('click', function completeListener(event){
        event.stopPropagation()
        task.toggleComplete()
    })
    subtitle.append(complete)
    element.appendChild(subtitle)

    let taskText = document.createElement('p')
    taskText.textContent = task.task
    element.appendChild(taskText)

    let noteText = document.createElement('p')
    noteText.textContent = task.noteText
    element.appendChild(noteText)

    let tagText = document.createElement('p')
    tagText.textContent = `[${task.tags}]`
    element.appendChild(tagText)

    element.appendChild(_getEditButton(task, project))
    element.appendChild(_getRemoveTaskButton(task, project))
}

function renderProject(element, project){
    let projectTasks = document.createElement('div')
    projectTasks.id = 'project-tasks'
    for (let task of project.storage){
        let container = makeTaskContainer()
        renderTask(container, task, project)
        projectTasks.appendChild(container)
    }
    _getAddTaskButton(projectTasks, project)
    element.appendChild(projectTasks)
    _saveState()
}

function _getAddTaskButton(element, project){
    let add = document.createElement('button')
    add.classList.add('add-task')
    add.innerHTML =  "&#43;"
    add.addEventListener('click', function editListener(event){
        event.stopPropagation()
        let formCheck = document.getElementById('new-task')
        if(typeof(formCheck) == 'undeclared' || formCheck == null){
            element.appendChild(_getAddTaskForm(project))
        }

    })
    element.appendChild(add)
}

function _getAddProjectButton(projects) {
    let add = document.createElement('button')
    add.classList.add('add-project')
    add.innerHTML = "&#43;"
    add.setAttribute('type', 'button')
    add.addEventListener('click', function editListener(event){
        event.stopPropagation()
        event.currentTarget.parentNode.appendChild(_getAddProjectForm(projects))
    })
    return add
}

function _getEditButton(task, project){
    let edit = document.createElement('button')
    edit.classList.add('edit-task')
    edit.innerHTML = "&#128221;"
    edit.setAttribute('type', 'button')
    edit.addEventListener('click', function editListener(event){
        event.stopPropagation()
        let element = event.currentTarget.parentNode
        element.parentNode.insertBefore(_getAddTaskForm(project, task), element.nextSibling)
    })
    return edit
}

function _getRemoveTaskButton(task, project) {
    let remove = document.createElement('button')
    remove.textContent = '🗑️'
    remove.addEventListener('click', function removeListener(event){
        event.stopPropagation()
        let message = "Are you sure you want to delete this task?"
        if(confirm(message)){
            let parentDiv = event.currentTarget.parentNode
            project.remove(task.title)
            _saveState()
            _removeChildren(parentDiv)
            parentDiv.remove()
        }  
    })
    return remove
}

function _removeChildren(element) {
    while(element.firstChild) {
        element.removeChild(element.lastChild)
    }
}

function _getAddProjectForm(projects){
    let projectForm = document.createElement('form')
    projectForm.setAttribute('id', 'new-project')

    // title
    let titleLabel = document.createElement('label')
    titleLabel.textContent = 'Project:'
    titleLabel.setAttribute('for', 'title')
    projectForm.appendChild(titleLabel)

    let title = document.createElement('input')
    title.setAttribute('type', 'text')
    title.setAttribute('name', 'title')
    projectForm.appendChild(title)

    let okay = document.createElement('button')
    okay.textContent = 'OK'
    okay.setAttribute('type', 'button')
    okay.addEventListener('click', (event) => newProjectListener(event, projects))
    
    projectForm.appendChild(okay)

    let cancel = document.createElement('button')
    cancel.textContent = 'Cancel'
    cancel.setAttribute('type', 'button')
    cancel.addEventListener('click', function cancelListener(event){
        let form = document.getElementById('new-project')
        _removeChildren(form)
        form.remove()
    })

    projectForm.appendChild(cancel)

    return projectForm
}

function _getAddTaskForm(project, task) {
    let taskForm = document.createElement('form')
    taskForm.setAttribute('id', 'new-task')

    // title
    let titleLabel = document.createElement('label')
    titleLabel.textContent = 'Title:'
    titleLabel.setAttribute('for', 'title')
    taskForm.appendChild(titleLabel)

    let title = document.createElement('input')
    title.setAttribute('type', 'text')
    title.setAttribute('name', 'title')
    if(task) title.value = task.title
    taskForm.appendChild(title)

    // priority
    let priorityLabel = document.createElement('label')
    priorityLabel.textContent = 'Priority:'
    priorityLabel.setAttribute('for', 'prirority')
    taskForm.appendChild(priorityLabel)
    
    let priority = document.createElement('input')
    priority.setAttribute('type', 'number')
    priority.setAttribute('min', '-4')
    priority.setAttribute('max', '5')
    priority.setAttribute('name', 'priority')
    if(task) priority.value = task.priority
    taskForm.appendChild(priority)

    // dueDate
    let dueDateLabel = document.createElement('label')
    dueDateLabel.textContent = 'Due Date:'
    dueDateLabel.setAttribute('for', 'dueDate')
    taskForm.appendChild(dueDateLabel)

    let dueDate = document.createElement('input')
    dueDate.setAttribute('type', 'date')
    dueDate.setAttribute('name', 'dueDate')
    if(task) dueDate.value = task.dueDate
    taskForm.appendChild(dueDate)

    // task
    let taskLabel = document.createElement('label')
    taskLabel.textContent = 'Task:'
    taskLabel.setAttribute('for', 'task')
    taskForm.appendChild(taskLabel)

    let taskValue = document.createElement('input')
    taskValue.setAttribute('type', 'text')
    taskValue.setAttribute('name', 'task')
    if(task) taskValue.value = task.task
    taskForm.appendChild(taskValue)
    // note
    let noteLabel = document.createElement('label')
    noteLabel.textContent = 'Note:'
    noteLabel.setAttribute('for', 'note')
    taskForm.appendChild(noteLabel)

    let note = document.createElement('input')
    note.setAttribute('type', 'text')
    note.setAttribute('name', 'note')
    if(task) note.value = task.note
    taskForm.appendChild(note)
    // tags
    let tagsLabel = document.createElement('label')
    tagsLabel.textContent = 'Tags:'
    tagsLabel.setAttribute('for', 'tags')
    taskForm.appendChild(tagsLabel)

    let tags = document.createElement('input')
    tags.setAttribute('type', 'text')
    tags.setAttribute('name', 'tags')
    if(task) tags.value = task.tags
    taskForm.appendChild(tags)
    // complete
    let completeLabel = document.createElement('label')
    completeLabel.textContent = 'Complete:'
    completeLabel.setAttribute('for', 'complete')
    taskForm.appendChild(completeLabel)

    let complete = document.createElement('input')
    complete.setAttribute('type', 'checkbox')
    complete.setAttribute('name', 'complete')
    if(task) complete.checked = task.complete
    taskForm.appendChild(complete)

    let okay = document.createElement('button')
    okay.textContent = 'OK'
    okay.setAttribute('type', 'button')
    if(task) {
        okay.addEventListener('click', (event) => newTaskListener(event, project, task))
    } else {
        okay.addEventListener('click', (event) => newTaskListener(event, project))
    }
    
    taskForm.appendChild(okay)

    let cancel = document.createElement('button')
    cancel.textContent = 'Cancel'
    cancel.setAttribute('type', 'button')
    cancel.addEventListener('click', function cancelListener(event){
        let form = document.getElementById('new-task')
        _removeChildren(form)
        form.remove()
    })
    
    taskForm.appendChild(cancel)

    return taskForm
}

function newProjectListener(event, projects){
    let data = event.currentTarget.parentNode
    let title = data.querySelector('input[name="title"]').value
    let newProject = new Project(title)
    projects.push(newProject)
    let root = document.querySelector('main')
    _removeChildren(root)
    renderPage(root, newProject, projects)
}

function newTaskListener(event, project, task){
    let data = event.currentTarget.parentNode
    let title = data.querySelector('input[name="title"]').value
    let priority = data.querySelector('input[name="priority"]').value
    let dueDate = data.querySelector('input[name="dueDate"]').value
    let newTask = data.querySelector('input[name="task"]').value
    let note = data.querySelector('input[name="note"]').value
    let tags = data.querySelector('input[name="tags"]').value
    let complete = data.querySelector('input[name="complete"]').checked
    if(!task) {
        let formTask = new Task(title, priority, dueDate, newTask, note, tags, complete)
        project.add(formTask)
    } else {
        task.title = title
        task.priority = priority
        task.dueDate = dueDate
        task.task = newTask
        task.note = note
        task.tags = tags
        if(task.complete != complete){
            task.toggleComplete()
        }
        
    }
    
    
    let projectTasks = document.getElementById('project-tasks')
    let root = projectTasks.parentNode
    _removeChildren(projectTasks)
    projectTasks.remove()
    renderProject(root, project)
}

function _saveState(){
    localStorage.setItem('projects', JSON.stringify(window.projects))
}
// CONCATENATED MODULE: ./src/index.js



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




/******/ })()
;