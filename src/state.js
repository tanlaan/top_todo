import Project from './project'
import Task from './task'

let db = firebase.firestore()
const docRef = db.collection('projects').doc('chris')

export default function saveState() {
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
      expandedTabs.storage = expandedTabs.storage.map(task => Object.assign(new Task, task))

      // Turn project into Project object and return
      return Object.assign(new Project(), expandedTabs)
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

export {saveState, getState};
