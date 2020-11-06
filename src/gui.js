export function renderPage(element, project, projects) {
    _removeChildren(element)
    renderHeader(element)
    renderTabs(element, projects)
    renderProject(element, project)
}

export function renderHeader(element) {
    let header = document.createElement('header')
    let title = document.createElement('h1')
    title.textContent = `Chris' Todo`
    header.appendChild(title)
    element.appendChild(header)
}

export function renderTabs(element, projects) {
    let tabs = document.createElement('div')
    tabs.setAttribute('id', 'project-tabs')

    let list = document.createElement('ul')
    for (let project of projects){
        let item = document.createElement('li')
        item.textContent = project.name
        item.addEventListener('click', function tabListener(event){
            renderPage(element, project, projects)
            item.removeEventListener('click', tabListener)
        })
        list.appendChild(item)
    }
    tabs.append(list)
    _addProjectButton(tabs)
    element.appendChild(tabs)
}

export function makeTaskContainer(){
    let container = _makeClassContainer('task-box')
    return container
}

function _makeClassContainer(name) {
    let container = document.createElement('div')
    container.setAttribute('class', name)
    return container
}


export function renderTask(element, task, project) {
    _removeChildren(element)

    element.addEventListener('click', function taskListener(event){
        renderFullTask(event.currentTarget, task, project)
        element.removeEventListener('click', taskListener)
    })

    let title = document.createElement('h3')
    title.textContent = task.title
    element.appendChild(title)

    let taskText = document.createElement('p')
    taskText.textContent = task.task
    element.appendChild(taskText)

    _editButton(element, task)
    _removeTaskButton(element, task, project)

}

export function renderFullTask(element, task, project) {
    _removeChildren(element)
    element.classList.add('expanded')

    element.addEventListener('click', function fullTaskListener(event) {
        element.classList.remove('expanded')
        renderTask(event.currentTarget, task)
        element.removeEventListener('click', fullTaskListener)
    })

    let title = document.createElement('h3')
    title.textContent = task.title
    element.appendChild(title)

    let subtitle = document.createElement('p')
    subtitle.textContent = `Priority: ${task.priority} | Due: ${task.dueDate} | Complete: ${task.complete}`
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

    _editButton(element, task, project)
    _removeTaskButton(element, task, project)
    
}

export function renderProject(element, project){
    for (let task of project.storage){
        let container = makeTaskContainer()
        renderTask(container, task, project)
        element.appendChild(container)
    }
    _addTaskButton(element, project)
}

function _addTaskButton(element, project){
    let add = document.createElement('button')
    add.classList.add('add-task')
    add.innerHTML =  "&#43;"
    add.addEventListener('click', function editListener(event){
        event.stopPropagation()
        addTaskForm(element, project)
    })
    element.appendChild(add)
}

function _addProjectButton(element) {
    let add = document.createElement('button')
    add.classList.add('add-project')
    add.innerHTML = "&#43;"
    add.addEventListener('click', function editListener(event){
        event.stopPropagation()
    })
    element.appendChild(add)
}

function _editButton(element, task, project){
    let edit = document.createElement('button')
    edit.classList.add('edit-task')
    edit.innerHTML = "&#128221;"
    edit.addEventListener('click', function editListener(event){
        event.stopPropagation()
    })
    element.appendChild(edit)
}

function _removeTaskButton(element, task, project) {
    let remove = document.createElement('button')
    remove.textContent = '🗑️'
    remove.addEventListener('click', function removeListener(event){
        event.stopPropagation()
        project.remove(task.title)
        _removeChildren(event.currentTarget.parentNode)
    })
    element.appendChild(remove)
}

function _removeChildren(element) {
    while(element.firstChild) {
        element.removeChild(element.lastChild)
    }
}

function addTaskForm(element, project) {
    let taskForm = document.createElement('form')
    taskForm.setAttribute('id', 'new-task')

    // title
    let titleLabel = document.createElement('label')
    titleLabel.textContent = 'Title:'
    taskForm.appendChild(titleLabel)

    let title = document.createElement('input')
    title.setAttribute('type', 'text')
    taskForm.appendChild(title)

    // priority
    let priorityLabel = document.createElement('label')
    priorityLabel.textContent = 'Priority:'
    taskForm.appendChild(priorityLabel)
    
    let priority = document.createElement('input')
    priority.setAttribute('type', 'number')
    taskForm.appendChild(priority)

    // dueDate
    let dueDateLabel = document.createElement('label')
    dueDateLabel.textContent = 'Due Date:'
    taskForm.appendChild(dueDateLabel)

    let dueDate = document.createElement('input')
    dueDate.setAttribute('type', 'date')
    taskForm.appendChild(dueDate)

    // task
    let taskLabel = document.createElement('label')
    taskLabel.textContent = 'Task:'
    taskForm.appendChild(taskLabel)

    let task = document.createElement('input')
    task.setAttribute('type', 'text')
    taskForm.appendChild(task)
    // note
    let noteLabel = document.createElement('label')
    noteLabel.textContent = 'Note:'
    taskForm.appendChild(noteLabel)

    let note = document.createElement('input')
    note.setAttribute('type', 'text')
    taskForm.appendChild(note)
    // tags
    let tagsLabel = document.createElement('label')
    tagsLabel.textContent = 'Tags:'
    taskForm.appendChild(tagsLabel)

    let tags = document.createElement('input')
    tags.setAttribute('type', 'text')
    taskForm.appendChild(tags)
    // complete
    let completeLabel = document.createElement('label')
    completeLabel.textContent = 'Complete:'
    taskForm.appendChild(completeLabel)

    let complete = document.createElement('input')
    complete.setAttribute('type', 'text')
    taskForm.appendChild(complete)

    element.appendChild(taskForm)
}
