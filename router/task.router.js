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
    .not()
    .isEmpty()
      .withMessage("Title can't be empty"),
    body("priority")
      .not()
      .isEmpty()
      .withMessage("The priority field can't be empty")
      .isIn([1, 2, 3])
      .withMessage("Invalid priority !!"),
    body("startDate")
      .if(body("startDate").notEmpty())
      .isISO8601()
      .withMessage("Invalid date format. Expected yyyy-mm-ddThh:mm:ss+hh:mm")
      .custom((startDate, { req }) => {

          if (new Date(startDate).getTime() >= new Date(req.body.endDate).getTime()) {
            throw new Error('start date must be before end date');
        }
        return true
      }),
    body("endDate")
      .if(body("endDate").notEmpty())
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
      .not()
      .isEmpty()
      .withMessage("Title can't be empty"),
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
