const Task = require("../model/task");

exports.getTasks = async (req, res, next) => {
  const tasks = await Task.findAll();
  if (!tasks) {
    return res.json({
      message: "No Task Found!!!",
      statusCode: 404,
    });
  }
  return res.status(200).json({
    tasks: tasks,
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
