const Task = require("../models/taskmodel.js");
const Counter = require("../models/countermodel.js");

module.exports = {
    name: "task",
    description: "Collects a task to send to database.",
    usage: "[responsible] [task]",
    args: true,
    cooldown: 1,
    execute(message, args) {
        const taskUser = args.shift();
        const taskUserLowcase = taskUser.toLowerCase();
        const taskDescription = args.join(" ");
        let taskID;

        // first get the next available ID from db
        Counter.findOne({ _id: "taskcounter" })
            .exec()
            .then((counter) => {
                taskID = counter.COUNT;
            })
            .then(() => {

                // increment an ID for the next task
                Counter.findById("taskcounter", (err, counter) => {
                    if(err) {
                        console.log("Can't update the ID counter :(");
                    }
                    counter.COUNT++;
                    counter.save();
                });

                // make and save the task to database
                const task = new Task({ user: taskUserLowcase, task: taskDescription, ID: taskID });

                task.save((err) => {
                    if(err) {
                        return message.reply("Something went wrong with adding the task: " + err);
                    }

                    return message.reply(`Added task "${taskDescription}" for user ${taskUser}. Mark this done by calling its ID: ${taskID}`);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    },
};