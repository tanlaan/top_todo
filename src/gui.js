export function renderHeader(element) {
    let header = document.createElement('header')
    let title = document.createElement('h1')
    title.textContent = `Chris' Todo`
    header.appendChild(title)
    element.appendChild(header)
}

export function renderTabs(element, projects) {
    console.log(projects)
    let list = document.createElement('ul')
    for (let project of projects){
        let item = document.createElement('li')
        item.textContent = project.name
        // item.addEventListener('click', doGuiStuff)
        list.appendChild(item)
    }
    // + icon for adding a new project
    element.appendChild(list)
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


export function renderTask(element, task) {
    _removeChildren(element)

    element.addEventListener('click', function taskListener(event){
        renderFullTask(event.currentTarget, task)
        element.removeEventListener('click', taskListener)
    })

    let title = document.createElement('h3')
    title.textContent = task.title
    element.appendChild(title)

    let taskText = document.createElement('p')
    taskText.textContent = task.task
    element.appendChild(taskText)

    let remove = document.createElement('button')
    remove.textContent = '🗑️'
    remove.addEventListener('click', function removeListener(event){
        _removeChildren(event.currentTarget.parentNode)
        event.stopPropagation()
    })
    element.appendChild(remove)

}

export function renderFullTask(element, task) {
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
    
}

function _removeChildren(element) {
    while(element.firstChild) {
        element.removeChild(element.lastChild)
    }
}