const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [100, "Task title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Task description cannot exceed 500 characters"],
        },
        status: {
            type: String,
            enum: ["To Do", "In Progress", "Done"],
            default: "To Do",
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true, // parent project
        },
    },
    {
        timestamps: true, // createdAt & updatedAt
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;