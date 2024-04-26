const express = require("express");

const projectController = require("../controller/project");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("", isAuth, projectController.getProjects);

router.post("", isAuth, projectController.createProject);

router.patch("/:id", isAuth, projectController.updateProject);

router.delete("/:id", isAuth, projectController.deleteProject);

exports.router = router;
