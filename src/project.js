export default class Project {
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
    for (let i = 0; i < this.storage.length; i += 1) {
      if (this.storage[i].title === taskTitle) {
        this.storage.splice(i, 1);
      }
    }
  }
}
