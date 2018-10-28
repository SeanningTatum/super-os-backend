const Project = require('../models/Project');

module.exports.createProject = project_form => new Project({ ...project_form }).save();

module.exports.getProjectsByTeam = team_id => Project.find({ team_id });

module.exports.deleteProject = async project_id => Project.findByIdAndDelete(project_id);

module.exports.updateProject = ({ project_id, ...project_form }) => Project.findByIdAndUpdate(project_id, { ...project_form });

module.exports.getProject = project_id => Project.findById(project_id);

module.exports.addMemberToProject = async (project_id, members_id) => {
  const project = await Project.findById(project_id);

  const filtered_members_id = members_id.filter((id) => {
    if (!project.members_id.includes(id)) {
      return id;
    }
  });

  project.members_id = [...project.members_id, ...filtered_members_id];

  return project.save();
};
