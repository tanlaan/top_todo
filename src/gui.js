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
    for (let project in projects){
        let item = document.createElement('li')
        item.textContent = projects[project].name
        list.appendChild(item)
    }
    element.appendChild(list)
}

export function renderTask(element, task) {
    let container = document.createElement('div')
    container.setAttribute('class', 'task-box')

    let title = document.createElement('h3')
    title.textContent = task.title
    container.appendChild(title)

    let subtitle = document.createElement('p')
    subtitle.textContent = `Priority: ${task.priority} | Due: ${task.dueDate} | Complete: ${task.complete}`
    container.appendChild(subtitle)

    let taskText = document.createElement('p')
    taskText.textContent = task.task
    container.appendChild(taskText)

    let noteText = document.createElement('p')
    noteText.textContent = task.noteText
    container.appendChild(noteText)

    let tagText = document.createElement('p')
    tagText.textContent = task.tags
    container.appendChild(tagText)

    element.appendChild(container)
    
}

function removeChildren(element) {
    while(element.firstChild) {
        element.removeChild(element.lastChild)
    }
}