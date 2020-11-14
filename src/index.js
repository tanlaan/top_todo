import Task from './task';
import Project from './project';
import { renderPage } from './gui';

window.projects = [];

if (localStorage.getItem('projects')) {
  window.projects = JSON.parse(localStorage.getItem('projects'));
  for (let i = 0; i < window.projects.length; i += 1) {
    Object.assign(window.projects[i], Project);
  }
} else {
  const defaultProject = new Project();
  defaultProject.name = 'Default';
  const testTask = new Task('My test', 0, '2021-01-01', 'This is a thing to do.', "Don't forget to do this.", ['tags', 'n', 'stuff']);
  const otherTask = new Task('Another one', 4, '2021-06-01', 'We do the stuff.', "Don't forget to do this.", ['tags', 'n', 'stuff']);
  defaultProject.add(testTask);
  defaultProject.add(otherTask);
  window.projects.push(defaultProject);
  const testProject = new Project();
  testProject.name = 'Testing';
  const different = new Task("I'm different", 0, '2021-01-01', 'This is a thing to do.', "Don't forget to do this.", ['tags', 'n', 'stuff']);
  different.complete = true;
  testProject.add(testTask);
  testProject.add(otherTask);
  testProject.add(different);
  window.projects.push(testProject);
}

const root = document.querySelector('main');
renderPage(root, window.projects[0], window.projects);
