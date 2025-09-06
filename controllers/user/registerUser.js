const User = require("../../models/User");
const Project = require("../../models/Project");
const Task = require("../../models/Task");
const generateToken = require("../../utils/generateToken");
const { projects: dummyProjects } = require("../../utilities/data");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            // ✅ Seed dummy projects + tasks for new user
            for (const proj of dummyProjects) {
                const newProject = await Project.create({
                    name: proj.name,
                    description: proj.description,
                    user: user._id,
                });

                // Create tasks for this project
                if (proj.tasks && proj.tasks.length > 0) {
                    for (const t of proj.tasks) {
                        await Task.create({
                            title: t.title,
                            description: t.description,
                            status: t.status,
                            dueDate: t.dueDate,
                            project: newProject._id,
                        });
                    }
                }
            }

            // Return response with JWT
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = registerUser;