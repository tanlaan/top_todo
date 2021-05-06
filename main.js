/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./src/task.js
class task_Task {
  constructor(title, priority = 0, dueDate, task, note, tags) {
    this.title = title;
    this.priority = priority;
    this.dueDate = dueDate;
    this.task = task;
    this.note = note;
    this.tags = tags;
    this.complete = false;
  }

  changePriority(number) {
    this.priority = number;
  }

  toggleComplete() {
    this.complete = this.complete !== true;
  }

  addTag(tag) {
    this.tag.push(tag);
  }

  removeTag(tag) {
    this.tag.splice(this.tag.indexOf(tag), 1);
  }
}

// CONCATENATED MODULE: ./src/project.js
class project_Project {
  constructor(name) {
    this.name = name;
    this.storage = [];
  }

  add(task) {
    this.storage.push(task);
  }

  list() {
    return this.storage;
  }

  remove(taskTitle) {
    // Should this be a  map or reduce?
    for (let i = 0; i < this.storage.length; i += 1) {
      if (this.storage[i].title === taskTitle) {
        this.storage.splice(i, 1);
      }
    }
  }
}

// CONCATENATED MODULE: ./src/state.js



let db = firebase.firestore()
const docRef = db.collection('projects').doc('chris')

function saveState() {
  // localStorage.setItem('projects', JSON.stringify(window.projects));
  docRef
    .withConverter(projectConverter)
    .set(window.projects)
  .then(() => {
    console.log('saved.')
  })
  .catch((error) => {
    console.log('error saving:', error)
  })
}

async function getState() {
  await docRef
    .withConverter(projectConverter)
    .get().then((doc) => {
      if(doc.exists){
        let data = doc.data()
        window.projects = data
      } else {
        // Project didn't exist
        window.projects = []
      }
    })
    .catch((error) => {
      console.log('error getting document:', error)
    })
  return;
}

var projectConverter = {
  toFirestore: function(projects) {
    return { projects: JSON.parse(JSON.stringify(projects)) }
  },
  fromFirestore: function(snapshot, options){
    let data = snapshot.data(options)
    console.log(data)
    return data["projects"].map(project => {

      // Don't modify the project object itself
      let expandedTabs = project
      
      // Turn project's tasks into Task objects
      expandedTabs.storage = expandedTabs.storage.map(task => Object.assign(new task_Task, task))

      // Turn project into Project object and return
      return Object.assign(new project_Project(), expandedTabs)
    });
  }
}

function expandState(jsonState) {
   return JSON.parse(jsonState).map(project => {

    // Don't modify the project object itself
    let expandedTabs = project
    
    // Turn project's tasks into Task objects
    expandedTabs.storage = expandedTabs.storage.map(task => Object.assign(new Task, task))

    // Turn project into Project object and return
    return Object.assign(new Project(), expandedTabs)
  });
}



// CONCATENATED MODULE: ./src/gui.js




function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function renderHeader(element) {
  const header = document.createElement('header');
  const title = document.createElement('h1');
  title.textContent = 'Chris\' Todo';
  header.appendChild(title);
  element.appendChild(header);
}

function getAddTaskButton(element, project) {
  const add = document.createElement('button');
  add.classList.add('add-task');
  add.innerHTML = '&#43;';
  add.addEventListener('click', function editListener(event) {
    event.stopPropagation();
    const formCheck = document.getElementById('new-task');
    if(typeof(formCheck) == 'undeclared' || formCheck == null) {
      element.appendChild(getAddTaskForm(project));
    }
  });
  element.appendChild(add);
}

function renderTabs(element) {
  const tabs = document.createElement('div');
  tabs.setAttribute('id', 'project-tabs');
  const list = document.createElement('ul');
  for (const project of window.projects) {
    const item = document.createElement('li');
      //  if(selectedProject == project.name) {
      //    item.setAttribute('id', 'selected-tab');
      //  }
    item.textContent = project.name;
    item.addEventListener('click', function tabListener(event){
      
      // Maybe I should add remove selectedProject and make this
      // click action cause the id to change on the tabs? They 
      // don't really need to be reloaded at all, just the id or
      // class changed for them.
      //
      // If I render the page, then search for the li with text
      // content of the project.name then set the attribute id to
      // selected, I can get rid of the selectedProject pass
      renderPage(element, project);
      selectProjectTab(project.name);
      item.removeEventListener('click', tabListener);
    });
    list.appendChild(item);
  }

  // Default tab selection
  if (list.children[0]){
    list.children[0].setAttribute('id', 'selected-tab');
  };

  tabs.append(list);
  tabs.appendChild(getAddProjectButton());
  element.appendChild(tabs);
}

function selectProjectTab(name) {
    // Select li elements of tabs
    const tabs = document.getElementById('project-tabs').getElementsByTagName('ul')[0].children

    // Remove default selected tab
    document.getElementById('selected-tab').removeAttribute('id')

    // Correctly set selected tab
    for (let i = 0; i < tabs.length; i++ ) {
      if (tabs[i].textContent == name) {
        tabs[i].setAttribute('id', 'selected-tab')
      }
    }

}

function makeClassContainer(name) {
  const container = document.createElement('div');
  container.setAttribute('class', name);
  return container;
}

function makeTaskContainer() {
  const container = makeClassContainer('task-box');
  return container;
}

function renderTask(element, task, project) {
  removeChildren(element);

  element.addEventListener('click', function taskListener(event) {
    renderFullTask(event.currentTarget, task, project);
    element.removeEventListener('click', taskListener);
  });

  const title = document.createElement('h3');
  title.textContent = task.title;
  element.appendChild(title);

  const complete = document.createElement('input');
  complete.setAttribute('type', 'checkbox');
  complete.checked = task.complete;

  const taskText = document.createElement('p');
  taskText.textContent = task.task;
  element.appendChild(taskText);
  element.appendChild(getRemoveTaskButton(task, project));
}

function renderFullTask(element, task, project) {
  removeChildren(element);
  element.classList.add('expanded');

  element.addEventListener('click', function fullTaskListener(event) {
    element.classList.remove('expanded');
    renderTask(event.currentTarget, task, project);
    element.removeEventListener('click', fullTaskListener);
  });

  const title = document.createElement('h3');
  title.textContent = task.title;
  element.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = `Priority: ${task.priority} | Due: ${task.dueDate} | Complete: `;
  const complete = document.createElement('input');
  complete.setAttribute('type', 'checkbox');
  complete.checked = task.complete;
  complete.addEventListener('click', function completeListener(event) {
    event.stopPropagation();
    task.toggleComplete();
  });
  subtitle.append(complete);
  element.appendChild(subtitle);

  const taskText = document.createElement('p');
  taskText.textContent = task.task;
  element.appendChild(taskText);

  const noteText = document.createElement('p');
  noteText.textContent = task.noteText;
  element.appendChild(noteText);

  const tagText = document.createElement('p');
  tagText.textContent = `[${task.tags}]`;
  element.appendChild(tagText);

  element.appendChild(getEditButton(task, project));
  element.appendChild(getRemoveTaskButton(task, project));
}

function renderProject(element, project) {
  
  // We don't have any project to get tasks from!
  if (!project) return

  const projectTasks = document.createElement('div');
  projectTasks.id = 'project-tasks';
  
  for (const task of project.storage) {
    const container = makeTaskContainer();
    renderTask(container, task, project);
    projectTasks.appendChild(container);
  }
  getAddTaskButton(projectTasks, project);
  element.appendChild(projectTasks);
}

function renderPage(element, project) {
  removeChildren(element);
  renderHeader(element);
  renderTabs(element);
  renderProject(element, project);
}

function getAddProjectButton() {
  const add = document.createElement('button');
  add.classList.add('add-project');
  add.innerHTML = "&#43;";
  add.setAttribute('type', 'button');
  add.addEventListener('click', function editListener(event) {
    event.stopPropagation();
    event.currentTarget.parentNode.appendChild(getAddProjectForm(window.projects));
  });
  return add;
}

function getEditButton(task, project) {
  const edit = document.createElement('button');
  edit.classList.add('edit-task');
  edit.innerHTML = '&#128221;';
  edit.setAttribute('type', 'button');
  edit.addEventListener('click', function editListener(event) {
    event.stopPropagation();
    const element = event.currentTarget.parentNode;
    element.parentNode.insertBefore(getAddTaskForm(project, task), element.nextSibling);
  });
  return edit;
}

function getRemoveTaskButton(task, project) {
  const remove = document.createElement('button');
  remove.textContent = '🗑️';
  remove.addEventListener('click', function removeListener(event) {
    event.stopPropagation();
    const message = "Are you sure you want to delete this task?";
    if(confirm(message)) {
      const parentDiv = event.currentTarget.parentNode;
      project.remove(task.title);
      saveState();
      removeChildren(parentDiv);
      parentDiv.remove();
    }
  });
  return remove;
}

function getAddProjectForm() {
  const projectForm = document.createElement('form');
  projectForm.setAttribute('id', 'new-project');

  // title
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Project:';
  titleLabel.setAttribute('for', 'title');
  projectForm.appendChild(titleLabel);

  const title = document.createElement('input');
  title.setAttribute('type', 'text');
  title.setAttribute('name', 'title');
  projectForm.appendChild(title);

  const okay = document.createElement('button');
  okay.textContent = 'OK';
  okay.setAttribute('type', 'button');
  okay.addEventListener('click', (event) => newProjectListener(event));
  projectForm.appendChild(okay);
  const cancel = document.createElement('button');
  cancel.textContent = 'Cancel';
  cancel.setAttribute('type', 'button');
  cancel.addEventListener('click', function cancelListener(event) {
    const form = document.getElementById('new-project');
    removeChildren(form);
    form.remove();
  });
  projectForm.appendChild(cancel);
  return projectForm;
}

function getAddTaskForm(project, task) {
  const taskForm = document.createElement('form');
  taskForm.setAttribute('id', 'new-task');

  // title
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title:';
  titleLabel.setAttribute('for', 'title');
  taskForm.appendChild(titleLabel);

  const title = document.createElement('input');
  title.setAttribute('type', 'text');
  title.setAttribute('name', 'title');
  if (task) title.value = task.title;
  taskForm.appendChild(title);

  // priority
  const priorityLabel = document.createElement('label');
  priorityLabel.textContent = 'Priority:';
  priorityLabel.setAttribute('for', 'prirority');
  taskForm.appendChild(priorityLabel);

  const priority = document.createElement('input');
  priority.setAttribute('type', 'number');
  priority.setAttribute('min', '-4');
  priority.setAttribute('max', '5');
  priority.setAttribute('name', 'priority');
  if (task) priority.value = task.priority;
  taskForm.appendChild(priority);

  // dueDate
  const dueDateLabel = document.createElement('label');
  dueDateLabel.textContent = 'Due Date:';
  dueDateLabel.setAttribute('for', 'dueDate');
  taskForm.appendChild(dueDateLabel);

  const dueDate = document.createElement('input');
  dueDate.setAttribute('type', 'date');
  dueDate.setAttribute('name', 'dueDate');
  if (task) dueDate.value = task.dueDate;
  taskForm.appendChild(dueDate);

  // task
  const taskLabel = document.createElement('label');
  taskLabel.textContent = 'Task:';
  taskLabel.setAttribute('for', 'task');
  taskForm.appendChild(taskLabel);

  const taskValue = document.createElement('input');
  taskValue.setAttribute('type', 'text');
  taskValue.setAttribute('name', 'task');
  if (task) taskValue.value = task.task;
  taskForm.appendChild(taskValue);
  // note
  const noteLabel = document.createElement('label');
  noteLabel.textContent = 'Note:';
  noteLabel.setAttribute('for', 'note');
  taskForm.appendChild(noteLabel);

  const note = document.createElement('input');
  note.setAttribute('type', 'text');
  note.setAttribute('name', 'note');
  if (task) note.value = task.note;
  taskForm.appendChild(note);
  // tags
  const tagsLabel = document.createElement('label');
  tagsLabel.textContent = 'Tags:';
  tagsLabel.setAttribute('for', 'tags');
  taskForm.appendChild(tagsLabel);

  const tags = document.createElement('input');
  tags.setAttribute('type', 'text');
  tags.setAttribute('name', 'tags');
  if (task) tags.value = task.tags;
  taskForm.appendChild(tags);
  // complete
  const completeLabel = document.createElement('label');
  completeLabel.textContent = 'Complete:';
  completeLabel.setAttribute('for', 'complete');
  taskForm.appendChild(completeLabel);

  const complete = document.createElement('input');
  complete.setAttribute('type', 'checkbox');
  complete.setAttribute('name', 'complete');
  if (task) complete.checked = task.complete;
  taskForm.appendChild(complete);

  const okay = document.createElement('button');
  okay.textContent = 'OK';
  okay.setAttribute('type', 'button');
  if (task) {
    okay.addEventListener('click', (event) => newTaskListener(event, project, task));
  } else {
    okay.addEventListener('click', (event) => newTaskListener(event, project));
  }

  taskForm.appendChild(okay);

  const cancel = document.createElement('button');
  cancel.textContent = 'Cancel';
  cancel.setAttribute('type', 'button');
  cancel.addEventListener('click', function cancelListener(event) {
    const form = document.getElementById('new-task');
    removeChildren(form);
    form.remove();
  });

  taskForm.appendChild(cancel);

  return taskForm;
}

function newProjectListener(event) {
  const data = event.currentTarget.parentNode;
  const title = data.querySelector('input[name="title"]').value;
  const newProject = new project_Project(title);
  window.projects.push(newProject);
  saveState();
  const root = document.querySelector('main');
  removeChildren(root);
  renderPage(root, newProject);
  selectProjectTab(title)
}

function newTaskListener(event, project, task) {
  const data = event.currentTarget.parentNode;
  const title = data.querySelector('input[name="title"]').value;
  const priority = data.querySelector('input[name="priority"]').value;
  const dueDate = data.querySelector('input[name="dueDate"]').value;
  const newTask = data.querySelector('input[name="task"]').value;
  const note = data.querySelector('input[name="note"]').value;
  const tags = data.querySelector('input[name="tags"]').value;
  const complete = data.querySelector('input[name="complete"]').checked;
  if (!task) {
    const formTask = new task_Task(title, priority, dueDate, newTask, note, tags, complete);
    project.add(formTask);
  } else {
    task.title = title;
    task.priority = priority;
    task.dueDate = dueDate;
    task.task = newTask;
    task.note = note;
    task.tags = tags;
    if (task.complete !== complete) {
      task.toggleComplete();
    }
  }
  saveState();

  const projectTasks = document.getElementById('project-tasks');
  const root = projectTasks.parentNode;
  removeChildren(projectTasks);
  projectTasks.remove();
  renderProject(root, project);
}

// CONCATENATED MODULE: ./src/index.js



// Initialize projects storage
//
window.projects = [];

// Check local storage for prior usage
// if (localStorage.getItem('projects')) {
//   window.projects = expandState(localStorage.getItem('projects'));
// } 

const root = document.querySelector('main');

getState().then(() => {
  renderPage(root, window.projects[0], window.projects);
})
.catch((error) => {
  console.log('Something went wrong rendering the page:', error)
});

/******/ })()
;