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

getState().then(() => {
  renderPage(root, window.projects[0], window.projects);
})
.catch((error) => {
  console.log('Something went wrong rendering the page:', error)
});
