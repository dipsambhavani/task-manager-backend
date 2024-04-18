const { validationResult } = require("express-validator");
const Task = require("../model/task");
const User = require("../model/user");

exports.getTasks = async (req, res, next) => {
  const page = req.query.page || 1;
  let limit = req.query.limit || 5;
  let offset = 0 + (page - 1) * limit;

  try {
    const result = await Task.findAndCountAll({
      include: {
        model: User,
        attributes: ["id", "email"],
        through: {
          attributes: [],
        },
      },
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

exports.createTask = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;
  let startDate = req.body.startDate || null;
  let endDate = req.body.endDate || null;
  const status = req.body.status;
  const assignedPerson = req.body.assignedPerson;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!!!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const task = Task.build({
      title: title,
      description: description,
      priority: priority,
      startDate: startDate,
      endDate: endDate,
      status: status,
    });

    const users = [];
    for (let i = 0; i < assignedPerson.length; i++) {
      const userId = assignedPerson[i];
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
  const taskId = req.body.id;

  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;
  let startDate = req.body.startDate || null;
  let endDate = req.body.endDate || null;
  const status = req.body.status;
  const assignedPerson = req.body.assignedPerson;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!!!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const users = [];
    for (let i = 0; i < assignedPerson.length; i++) {
      const userId = assignedPerson[i];
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
          id: taskId,
        },
      }
    );

    if (result[0] == 0) {
      const error = new Error("The Task not found");
      error.statusCode = 404;
      throw error;
    }

    const task = await Task.findByPk(taskId);


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
  const taskId = req.params.taskId;
  const result = Task.destroy({where: {
    id: taskId
  }});
  return res.status(200).json({
    result: result,
  });
}
