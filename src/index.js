import { renderPage } from './gui';
import { getState } from './state';

// Initialize projects storage
//
window.projects = [];

// Check local storage for prior usage
// if (localStorage.getItem('projects')) {
//   window.projects = expandState(localStorage.getItem('projects'));
// } 

const root = document.querySelector('main');
renderPage(root, window.projects[0], window.projects);

