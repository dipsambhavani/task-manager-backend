const express = require("express");

const taskController = require("../controller/task");
const { body } = require("express-validator");

const router = express.Router();

router.get("/fetch-all", taskController.getTasks);

router.post(
  "/create",
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

router.patch("/update", taskController.updateTask);

router.delete("/delete/:taskId", taskController.deleteTask);

exports.router = router;
