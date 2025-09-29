const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
            maxlength: [100, "Project name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Project description cannot exceed 500 characters"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // owner of the project
        },
    },
    {
        timestamps: true, // createdAt & updatedAt
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;