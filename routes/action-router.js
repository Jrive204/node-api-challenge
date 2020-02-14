const express = require("express");

const router = express.Router();

const ActionData = require("../data/helpers/actionModel");
const ProjectData = require("../data/helpers/projectModel");

//GET ----

router.get("/", (req, res) => {
  ActionData.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json({ error: "Something went wrong" }));
});

router.get("/:id", validateActionid, (req, res) => {
  res.status(200).json(req.action);
});
router.get("/:id/projects", validateProjectid, (req, res) => {
  const { id } = req.params;
  ProjectData.getProjectActions(id)
    .then(projects =>
      projects.length === 0
        ? res.status(404).json({ message: "Project doesn't have any actions" })
        : res.status(200).json(projects)
    )
    .catch(err => res.status(500).json(err.message));
});

// Post -----
router.post("/:id/projects", validateAction, validateProjectid, (req, res) => {
  const { id } = req.params;
  const actionbody = { ...req.body, project_id: id };

  ActionData.insert(actionbody)
    .then(action => res.status(200).json(action))
    .catch(err => res.status(500).json(err.message));
});

// Delete ----

router.delete("/:id", validateActionid, (req, res) => {
  const { id } = req.params;

  ActionData.remove(id)
    .then(action => res.status(200).json(req.action))
    .catch(err => res.status(500).json(err.message));
});

// PUT -----
router.put("/:id", validateAction, validateActionid, (req, res) => {
  const { id } = req.params;

  ActionData.update(id, req.body)
    .then(update =>
      req.body.project_id
        ? res.status(400).json({ message: "Cannot Change Project ID" })
        : res.status(200).json(update)
    )
    .catch(err => res.status(500).json(err.message));
});

//Custom MiddleWare
function validateActionid(req, res, next) {
  const { id } = req.params;
  ActionData.get(id)
    .then(actions =>
      actions
        ? (req.action = actions) & next()
        : res.status(400).json({ error: "Not a Valid ID" })
    )
    .catch(err => res.status(500).json(err.message));
}

function validateAction(req, res, next) {
  req.body && req.body.notes && req.body.description
    ? next()
    : !req.body.notes || !req.body.description
    ? res.status(400).json({ error: "needs to have notes and description" })
    : res.stattus(500).json({ Error: "Something went wrong!!" });
}

function validateProjectid(req, res, next) {
  const { id } = req.params;
  ProjectData.get(id)
    .then(projects =>
      projects
        ? (req.project = projects) & next()
        : res.status(400).json({ error: "Not a Valid ID" })
    )
    .catch(err => res.status(500).json(err.message));
}

module.exports = router;
