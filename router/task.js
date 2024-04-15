const express = require("express");

const taskController = require('../controller/task');

const router = express.Router();

router.get('/tasks', taskController.getTasks);

router.post('/task', taskController.postTask);

exports.router = router;