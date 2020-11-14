export default class Task {
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
