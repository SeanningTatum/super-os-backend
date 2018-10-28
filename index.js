require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log('Connected to database!'))
  .catch(() => console.error('Failed to connect to database!'));

const { ApolloServer, gql } = require('apollo-server');

const teamController = require('./controllers/Team');
const userController = require('./controllers/User');
const todoController = require('./controllers/Todo');
const projectController = require('./controllers/Project');
const boardController = require('./controllers/Board');
const taskController = require('./controllers/Task');
const columnController = require('./controllers/Column');

// The GraphQL schema
const typeDefs = gql`
  type Query {
    User(user_id: ID!): User
    Project(project_id: ID!): Project
    Team(team_id: ID!): Team
    Todo(todo_id: ID!): Todo
    Board(board_id: ID!): Board 
    Column(column_id: ID!): Column 
    Task(task_id: ID!): Task
  }

  type Mutation {
    # Team
    createTeam(name: String!): Team
    updateTeam(name: String!, team_id: ID!): Team
    deleteTeam(team_id: ID!): Team

    # Users
    createUser(username: String!, email: String!, team_id: ID, user_type: [UserTypes]!): User
    deleteUser(user_id: ID!): User
    updateUser(user_id: ID!, user_type: [UserTypes], username: String): User
    joinTeam(team_id: ID!, user_id: ID!): User
    register(email: String!, username: String!, password: String!): String
    login(email: String!, password: String!): String
    
    # Todos
    createTodo(title: String!, description: String!, project_id: ID!): Todo
    deleteTodo(todo_id: ID!): Todo
    assignTodoToUser(todo_id: ID!, user_id: ID!): Todo

    # Projects
    createProject(name: String!, description: String, team_id: ID!, members: [ID]): Project
    deleteProject(project_id: ID!): Project
    addMemberToProject(members_id: [ID], project_id: ID!): Project
    updateProject(name: String, description: String, project_id: ID!): Project

    # Board
    createBoard(user_id: ID!, board_name: String!, background: String!): Board

    # Column
    createColumn(board_id: ID!, title: String): Column
    addTaskToColumn(column_id: ID!, content: String!): Column
    updateTaskOrder(column_id: ID! updated_task_id_arr: [String]!): Column

    # Task
    createTask(content: String!, board_id: ID!): Task
  }

  enum UserTypes {
    Owner
    Project_Manager
    Senior_Developer
    Developer
    Designer
    Marketer
  }

  type User {
    id: ID!
    team_id: ID!
    team: Team
    username: String
    email: String
    type: String
    user_type: [UserTypes]
    tasks: [Todo]
    boards: [Board]
  }

  type Team {
    id: ID!
    name: String
    date_created: String
    members: [User]
    projects: [Project]
  }

  type Project {
    id: ID!
    team_id: ID!
    name: String
    description: String
    members: [User]
  }

  type Todo {
    id: ID!
    completed_by: ID
    assigned_to: [User]
    project_id: ID
    project: Project
    title: String
    description: String
    date_completed: String
    date_due: String
  }

  type Board {
    id: ID!
    owned_by: ID!
    name: String!
    background: String!
    columns: [Column]
    tasks: [Task]
  }

  type Column {
    id: ID!
    title: String!
    tasks: [Task]
    task_order: [String]
  }

  type Task {
    id: ID!
    content: String!
  }

`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    User: (_, { user_id }) => userController.getUser(user_id),
    Project: (_, { project_id }) => projectController.getProject(project_id),
    Team: (_, { team_id }) => teamController.getTeam(team_id),
    Todo: (_, { todo_id }) => todoController.getTodo(todo_id),
    Board: (_, { board_id }) => boardController.getBoard(board_id),
    Column: (_, { column_id }) => columnController.getColumn(column_id),
    Task: (_, { task_id }) => taskController.getTask(task_id),
  },

  Mutation: {
    // Team
    createTeam: (_, { name }) => teamController.createTeam(name),
    deleteTeam: (_, { team_id }) => teamController.deleteTeam(team_id),
    updateTeam: (_, args) => teamController.updateTeam(args),

    // User
    createUser: (_, args) => userController.createUser(args),
    updateUser: (_, args) => userController.updateUser(args),
    deleteUser: (_, { user_id }) => userController.deleteUser(user_id),
    joinTeam: (_, { user_id, team_id }) => userController.joinTeam(user_id, team_id),
    register: (_, args) => userController.register(args),
    login: (_, args) => userController.login(args),

    // Project
    createProject: (_, args) => projectController.createProject(args),
    deleteProject: (_, { project_id }) => projectController.deleteProject(project_id),
    addMemberToProject: (_, { project_id, members_id }) => projectController.addMemberToProject(project_id, members_id),
    updateProject: (_, args) => projectController.updateProject(args),

    // Todo
    createTodo: (_, args) => todoController.createTodo(args),
    deleteTodo: (_, { todo_id }) => todoController.deleteTodo(todo_id),
    assignTodoToUser: (_, { todo_id, user_id }) => todoController.assignTodoToUser(todo_id, user_id),

    // Board
    createBoard: (_, args) => boardController.createBoard(args),

    // Column
    createColumn: (_, { title, board_id }) => columnController.createColumn(title, board_id),
    addTaskToColumn: (_, { content, column_id }) => columnController.addTaskToColumn(column_id, content),
    updateTaskOrder: (_, { column_id, updated_task_id_arr }) => columnController.updateTaskOrder(column_id, updated_task_id_arr),

    // Task
    createTask: (_, { content, board_id }) => taskController.createTask(content, board_id),
  },

  User: {
    team: ({ team_id }) => teamController.getTeam(team_id),
    tasks: ({ id }) => todoController.getTodos(id),
    boards: ({ id }) => boardController.findBoardsByUser(id),
  },

  Team: {
    members: ({ id }) => userController.getMembers(id),
    projects: ({ id }) => projectController.getProjectsByTeam(id),
  },

  Project: {
    members: ({ members_id }) => userController.getMembersInProject(members_id),
  },

  Todo: {
    project: ({ project_id }) => projectController.getProject(project_id),
    assigned_to: ({ assigned_to }) => userController.getUsersAssignedToTask(assigned_to),
  },

  Board: {
    columns: ({ id }) => columnController.getColumnsByBoard(id),
    tasks: ({ id }) => taskController.getTasksInBoard(id),
  },

  Column: {
    tasks: ({ tasks }) => taskController.getTasksInColumn(tasks),
  },

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
