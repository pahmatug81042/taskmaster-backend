// Dummy projects
const dummyProjects = [
    {
        name: 'Project Alpha',
        description: 'First project'
    },
];

// Dummy tasks for each project
// We'll map these when seeding to the correct project IDs
const dummyTasks = {
    'Project Alpha': [
        {
            title: 'Alpha Task 1',
            description: 'First task of Project Alpha',
            status: 'To Do',
            dueDate: new Date()
        },
        {
            title: 'Alpha Task 2',
            description: 'Second task of Project Alpha',
            status: 'In Progress',
            dueDate: new Date()
        }
    ],
    'Project Beta': [
        {
            title: 'Beta Task 1',
            description: 'First task of Project Beta',
            status: 'To Do',
            dueDate: new Date()
        },
        {
            title: 'Beta Task 1',
            description: 'Second task of Project Beta',
            status: 'Done',
            dueDate: new Date()
        }
    ]
};

module.exports = { dummyProjects, dummyTasks };