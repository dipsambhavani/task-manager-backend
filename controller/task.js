const Task = require("../model/task");

exports.getTasks = async (req, res, next) => {
    const page = req.query.page || 1;
    let limit = 3;
    let offset = 0 + (page - 1) * limit;
  const result = await Task.findAndCountAll({
    offset: offset,
    limit: limit
  });

  const tasks = result.rows;
  if (!tasks) {
    return res.json({
      message: "No Task Found!!!",
      statusCode: 404,
    });
  }
  return res.status(200).json({
    message: "These are the items",
    tasks: tasks,
    count: result.count
  });
};

exports.postTask = async (req, res, next) => {
  const name = req.body.name;
  try {
    const task = Task.build({
      name: name,
    });
    const result = await task.save();
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
