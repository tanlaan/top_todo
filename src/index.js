import Task from './task';
import Project from './project';
import { renderPage } from './gui';

// Initialize projects storage
window.projects = [];

// Check local storage for prior usage
if (localStorage.getItem('projects')) {
  window.projects = JSON.parse(localStorage.getItem('projects')).map(project => {

    // Don't modify the project object itself
    let expandedTabs = project
    
    // Turn project's tasks into Task objects
    expandedTabs.storage = expandedTabs.storage.map(task => Object.assign(new Task, task))

    // Turn project into Project object and return
    return Object.assign(new Project(), expandedTabs)
  });
} 

const root = document.querySelector('main');
console.log(window.projects)
renderPage(root, window.projects[0], window.projects);

