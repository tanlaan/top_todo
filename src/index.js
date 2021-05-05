import { renderPage } from './gui';
import { expandState } from './state';

var provider = new firebase.auth.GoogleAuthProvider()
// Check if firebase has information for our user?
// So that means we need to do user authentication now though...
//

// Initialize projects storage
window.projects = [];

// Check local storage for prior usage
if (localStorage.getItem('projects')) {
  window.projects = expandState(localStorage.getItem('projects'));
} 

const root = document.querySelector('main');
renderPage(root, window.projects[0], window.projects);

