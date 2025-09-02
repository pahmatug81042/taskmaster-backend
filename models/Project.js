const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Project name is required'] },
        description: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);