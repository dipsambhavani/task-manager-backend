const express = require("express");

const projectController = require("../controller/project");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/fetch-all/:ownerId", isAuth, projectController.getProjects);

router.post("/create", isAuth, projectController.createProject);

router.patch("/update/:projectId", isAuth, projectController.updateProject);

router.delete("/delete/:projectId", isAuth, projectController.deleteProject);

exports.router = router;
