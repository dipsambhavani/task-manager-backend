const jwt = require("jsonwebtoken");

const Project = require("../model/project");
const User = require("../model/user");

const jwtSecret = "skdnguidfg";

exports.getProjects = (req, res, next) => {
    
}

exports.createProject = async (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description || null;
    const startDate = req.body.startDate || null;
    const endDate = req.body.endDate || null;
    const token = req.body.token;
    const tokenData = jwt.verify(token, jwtSecret);
    const project = await Project.build({
        title: title,
        owner: tokenData.id,
        description: description,
        startDate: startDate,
        endDate: endDate,
    });
    const result = await project.save();
    return res.status(200).json({
        message: "project created !!",
        response: result
    });
}