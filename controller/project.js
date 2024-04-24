const jwt = require("jsonwebtoken");

const { validationResult } = require('express-validator');

const Project = require("../model/project");
const User = require("../model/user");

const jwtSecret = "skdnguidfg";

exports.getProjects = async (req, res, next) => {
  const ownerId = req.params.ownerId;
  try {
    const projects = await Project.findAll({
      // where: {
      //   owner: ownerId,
      // },
      include: {
        model: User,
        as: "owner",
      },
    });
    return res.status(200).json(projects);
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
  const startDate = req.body.startDate || null;
  const endDate = req.body.endDate || null;
  const token = req.get("Authorization").split(" ")[1];

  try {
    const tokenData = await jwt.verify(token, jwtSecret);
    const project = await Project.build({
      title: title,
      ownerId: tokenData.id,
      description: description,
      startDate: startDate,
      endDate: endDate,
    });
    const result = await project.save();
    return res.status(200).json({
      message: "project created !!",
      response: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  const title = req.body.title;
  const description = req.body.description || null;
  const startDate = req.body.startDate || null;
  const endDate = req.body.endDate || null;
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
          id: projectId,
        },
      }
    );

    if (result[0] == 0) {
      const error = new Error("The result not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      result: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const result = Project.destroy({
      where: {
        id: projectId,
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