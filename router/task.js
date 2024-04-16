const express = require("express");

const taskController = require("../controller/task");
const { body } = require("express-validator");

const router = express.Router();

router.get("/tasks", taskController.getTasks);

router.post(
  "/task",
  [
    body("title")
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("title must be alphanumaric only"),
    body("priority")
      .not()
      .isEmpty()
      .withMessage("The priority field can't be empty")
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid priority !!"),
    body("startDate")
    .if(body("startDate").notEmpty())
    .isISO8601("yyyy-mm-dd")
    .withMessage("Start date must be in the correct format yyyy-mm-dd"),
    body("endDate")
    .if(body("startDate").notEmpty())
      .isISO8601("yyyy-mm-dd")
      .withMessage("End date must be in the correct format yyyy-mm-dd"),
    body("status")
      .not()
      .isEmpty()
      .withMessage("The status field can't be empty")
      .isIn(["To-do", "In-progress", "Done"])
      .withMessage("Invalid status !!"),
  ],
  taskController.postTask
);

exports.router = router;
