const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, 'Task title is required'] },
        description: { type: String },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Done'],
            default: 'To Do',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);