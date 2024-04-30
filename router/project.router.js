const express = require("express");

const projectController = require("../controller/project.controller");
const isAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.get("", isAuth, projectController.getProjects);

router.get("/:id", isAuth, projectController.getProject);

router.post("", isAuth, projectController.createProject);

router.patch("/:id", isAuth, projectController.updateProject);

router.delete("/:id", isAuth, projectController.deleteProject);

exports.router = router;
