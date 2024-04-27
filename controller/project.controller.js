const jwt = require("jsonwebtoken");

const { validationResult } = require('express-validator');

const Project = require("../model/project.model");
const User = require("../model/user.model");
const sequelize = require("../utils/database");

const jwtSecret = "skdnguidfg";

exports.getProjects = async (req, res, next) => {
  try {
    const userId = +req?.userId;
    const response = await sequelize.query(`
      select 
        p.*,
        json_build_object(
          'id', u1.id,
          'email', u1.email
        ) as owner,
        json_agg(
          json_build_object(
            'id', u2.id,
            'email', u2.email
          )
        ) as users
      from 
        projects as p
      left join 
        project_members as pm on p.id = pm."projectId"
      left join 
        users as u1 on p."ownerId" = u1.id
      left join 
        users as u2 on pm."userId" = u2.id
      where 
        p."ownerId" = ${userId}
        or p.id in (
          select 
            "projectId" 
          from 
            project_members
          where
            "userId" = ${userId}
        )
      group by
        p.id, u1.id
    `);
    return res.status(200).json(response[0]);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description || null;
  const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
  const endDate = req.body.endDate ? new Date(req.body.endDate) : null;
  const token = req.get("Authorization").split(" ")[1];
  const userIds = req.body.userIds;

  try {
    const tokenData = await jwt.verify(token, jwtSecret);
    const project = await Project.build({
      title: title,
      ownerId: tokenData.id,
      description: description,
      startDate: startDate,
      endDate: endDate,
    });

    const users = [];
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error("The person you assigned doesn't exist");
        error.statusCode = 422;
        throw error;
      }
      users.push(user);
    }

    const createdProject = await project.save();
    const response = await createdProject.addUsers(users);

    return res.status(200).json({
      message: "project created !!",
      response
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  const id = req.params.id;
  const title = req.body.title;
  const description = req.body.description || null;
  const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
  const endDate = req.body.endDate ? new Date(req.body.endDate) : null;
  const userIds = req.body.userIds;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!!!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const result = await Project.update(
      {
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (result[0] == 0) {
      const error = new Error("The Project not found");
      error.statusCode = 404;
      throw error;
    }

    const users = [];
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error("The person you assigned doesn't exist");
        error.statusCode = 422;
        throw error;
      }
      users.push(user);
    }

    const project = await Project.findByPk(id);

    await project.removeUsers();
    const updatedProject = await project.setUsers(users);

    return res.status(200).json({
      response: updatedProject,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = Project.destroy({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      result: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}