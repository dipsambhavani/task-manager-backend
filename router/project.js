const express = require("express");

const projectController = require("../controller/project");
const { body } = require("express-validator");

const router = express.Router();

router.get("/fetch-all", projectController.getProjects);

router.post("/create", projectController.createProject);

exports.router = router;
