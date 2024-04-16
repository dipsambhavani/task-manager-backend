const Task = require("../model/task");
const User = require("../model/user");

exports.getTasks = async (req, res, next) => {
  const page = req.query.page || 1;
  let limit = req.query.limit || 5;
  let offset = 0 + (page - 1) * limit;

  try {
    const result = await Task.findAndCountAll({
      include: User,
      offset: offset,
      limit: limit,
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
      count: result.count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

};

exports.postTask = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const priority = req.body.priority;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  const status = req.body.status;
  const assignedPerson = req.body.assignedPerson;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  
  try {
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
      const userId = assignedPerson[i].id;
      const user = await User.findByPk(userId);
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
