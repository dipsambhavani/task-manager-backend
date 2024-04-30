const { validationResult } = require("express-validator");
const Task = require("../model/task.model");
const User = require("../model/user.model");

exports.getAllTasks = async (req, res, next) => {
  const page = req?.query?.page || 1;
  const limit = req?.query?.limit || 10;
  const offset = 0 + (page - 1) * limit;
  const projectId = req?.query?.projectId;
  const status = req?.query?.status;
  const isMyTasks = req?.query?.myTasks;

  try {
    if (!projectId) {
      return res.status(404).json({
        message: "No Task Found!!!",
      });
    }
    let where = { projectId };
    if (status) {
      where = { 
        ...where,
        status
      };
    }
    const result = await Task.findAndCountAll({
      where,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: {
        model: User,
        attributes: ["id", "email"],
        ...(!!isMyTasks && { where: { id: req.userId } }),
        through: {
          attributes: [],
        },
      },
      order: [["id", 'ASC']],
      // offset: offset,
      // limit: limit,
    });

    const tasks = result.rows;
    if (!tasks) {
      return res.status(404).json({
        message: "No Task Found!!!",
      });
    }
    return res.status(200).json({
      message: "These are the items",
      tasks: tasks,
      count: await Task.count(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleTask = async (req, res, next) => {
  const id = req.params.id;
  try {
    const task = await Task.findByPk(id, {
      include: {
        model: User,
        attributes: ["id", "email"],
      },
    });
    if (!task) {
      return res.status(404).json({
        message: "Task Not Found!!!",
      });
    }
    return res.status(200).json({
      message: "task found successfully",
      task: task,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  const title = req?.body?.title;
  const description = req?.body?.description;
  const priority = req?.body?.priority;
  const startDate = req?.body?.startDate ? new Date(req?.body?.startDate) : null;
  const endDate = req?.body?.endDate ? new Date(req?.body?.endDate) : null;
  const status = req?.body?.status;
  const userIds = req?.body?.userIds;
  const projectId = req?.body?.projectId;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!!!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const task = Task.build({ title, description, priority, startDate, endDate, status, projectId });

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

    const resultTask = await task.save();
    const result = await resultTask.addUsers(users);
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

exports.updateTask = async (req, res, next) => {
  const id = req.body.id;

  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;
  const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
  const endDate = req.body.endDate ? new Date(req.body.endDate) : null;
  const status = req.body.status;
  const userIds = req.body.userIds;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!!!");
      error.statusCode = 422;
      error.data = errors.array();
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
    const result = await Task.update(
      {
        title: title,
        description: description,
        priority: priority,
        startDate: startDate,
        endDate: endDate,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (result[0] == 0) {
      const error = new Error("The Task not found");
      error.statusCode = 404;
      throw error;
    }

    const task = await Task.findByPk(id);

    await task.removeUsers();
    const resultTask = await task.setUsers(users);
    return res.status(200).json({
      result: resultTask,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTask = (req, res, next) => {
  try {
    const id = req.params.id;
    const result = Task.destroy({
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
};
