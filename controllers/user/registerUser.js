const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const { dummyProjects, dummyTasks } = require('../../utilities/data');

// @desc    Register a new user with dummy projects and tasks
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Create new user
        const user = await User.create({ username, email, password });

        if (user) {
            // Seed projects for the new user
            const projectsToInsert = dummyProjects.map(p => ({ ...p, user: user._id }));
            const createdProjects = await Project.insertMany(projectsToInsert);

            if (createdProjects) {
                // Seed the tasks for each project
                for (const project of createdProjects) {
                    const tasksForProject = dummyTasks[project.name].map(task => ({
                        ...task,
                        project: project._id
                    }));
                    await Task.insertMany(tasksForProject);
                }
            }
        }

        // Return response without password
        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = registerUser;