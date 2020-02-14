const express = require("express");

const router = express.Router();
const ProjectData = require("../data/helpers/projectModel");

//GET ----

router.get("/", (req, res) => {
  ProjectData.get()
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(500).json({ error: "Something went wrong" }));
});

router.get("/:id", validateProjectid, (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateProjectid, (req, res) => {
  const { id } = req.params;
  ProjectData.getProjectActions(id)
    .then(projects =>
      projects.length === 0
        ? res.status(404).json({ message: "Project doesn't have any actions" })
        : res.status(200).json(projects)
    )
    .catch(err => res.status(500).json(err.message));
});

//POST -----

router.post("/", validateProject, (req, res) => {
  ProjectData.insert(req.body)
    .then(project => res.status(200).json(project))
    .catch(err => res.status(500).json(err.message));
  console.log(Object.keys(req.body).length, "USERSSS!!@#!");
});

// DELETE -----

router.delete("/:id", validateProjectid, (req, res) => {
  const { id } = req.params;

  ProjectData.remove(id)
    .then(project => res.status(200).json(req.project))
    .catch(err => res.status(500).json(err.message));
});

//Middleware

function validateProjectid(req, res, next) {
  // do your magic!
  const { id } = req.params;
  ProjectData.get(id)
    .then(projects =>
      projects
        ? (req.project = projects) & next()
        : res.status(400).json({ error: "Not a Valid ID" })
    )
    .catch(err => res.status(500).json(err.message));
}

function validateProject(req, res, next) {
  req.body && req.body.name && req.body.description
    ? next()
    : !req.body.name || !req.body.description
    ? res.status(400).json({ error: "needs to have name and description" })
    : res.stattus(500).json({ Error: "Something went wrong!!" });
}

module.exports = router;
