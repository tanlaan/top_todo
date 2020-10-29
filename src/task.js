
export class Task {
    constructor(title, priority = 0, dueDate, task, note, tags) {
        this.title = title
        this.priority = priority
        this.dueDate = dueDate
        this.task = task
        this.note = note
        this.tags = tags
    }
}

export class Project {
    constructor(name){
        this.name = name
        this.storage = []
    }

    add(task){
        this.storage.push(task)
    }

    list(){
        return this.storage
    }

    remove(taskTitle){
        for(let i = 0; i < this.storage.length; i ++){
            if(this.storage[i].title == taskTitle){
                this.storage.splice(i, 1)
            }
        }
    }
}