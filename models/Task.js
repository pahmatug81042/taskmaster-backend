const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, 'Task title is required'] },
        description: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);