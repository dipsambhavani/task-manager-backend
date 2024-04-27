const express = require("express");

const taskController = require("../controller/task.controller");
const { body } = require("express-validator");
const isAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("", isAuth, taskController.getAllTasks);
router.get("/:id", isAuth, taskController.getSingleTask);

router.post(
  "",
  isAuth,
  [
    body("title")
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("title must be alphanumaric only"),
    body("priority")
      .not()
      .isEmpty()
      .withMessage("The priority field can't be empty")
      .isIn([1, 2, 3])
      .withMessage("Invalid priority !!"),
    body("startDate")
      .if(body("startDate").notEmpty())
      .isISO8601()
      .withMessage("Invalid date format. Expected yyyy-mm-ddThh:mm:ss+hh:mm"),
    body("endDate")
      .if(body("startDate").notEmpty())
      .isISO8601()
      .withMessage("Invalid date format. Expected yyyy-mm-ddThh:mm:ss+hh:mm"),
    body("status")
      .not()
      .isEmpty()
      .withMessage("The status field can't be empty")
      .isIn(["To-do", "In-progress", "Done"])
      .withMessage("Invalid status !!"),
  ],
  taskController.createTask
);

router.patch(
  "",
  isAuth,
  [
    body("title")
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("title must be alphanumaric only"),
    body("priority")
      .not()
      .isEmpty()
      .withMessage("The priority field can't be empty")
      .isIn([1, 2, 3])
      .withMessage("Invalid priority !!"),
    body("startDate")
      .if(body("startDate").notEmpty())
      .isISO8601()
      .withMessage("Invalid date format. Expected yyyy-mm-ddThh:mm:ss+hh:mm"),
    body("endDate")
      .if(body("startDate").notEmpty())
      .isISO8601()
      .withMessage("Invalid date format. Expected yyyy-mm-ddThh:mm:ss+hh:mm"),
    body("status")
      .not()
      .isEmpty()
      .withMessage("The status field can't be empty")
      .isIn(["To-do", "In-progress", "Done"])
      .withMessage("Invalid status !!"),
  ],
  taskController.updateTask
);

router.delete("/:id", isAuth, taskController.deleteTask);

exports.router = router;
