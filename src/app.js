const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function idVerification (request, response, next) {
  const { id } = request.params;

  if (isUuid(id)){
    return next();
  }

  return response.status(400).json({ error: "ID isn't valid"});
}


app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repo);

  return response.status(200).json(repo);

});

app.put("/repositories/:id", idVerification, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repositories => repositories.id === id)

  if (index < 0){
    return response.status(400).json({ error: "Didn't find this project"});
  }

  const { likes } = repositories[index];
  const newRepo = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[index] = newRepo;

  return response.status(200).json(newRepo);

});

app.delete("/repositories/:id", idVerification, (req, res) => {
  const { id } = req.params;

  const index = repositories.findIndex(repositories => repositories.id === id)

  if (index < 0){
    return res.status(400).json({ error: "Didn't find this project"});
  }

  repositories.splice(index, 1);

  return res.status(204).json();
});

app.post("/repositories/:id/like", idVerification, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repositories => repositories.id === id);

  if (index < 0) {
    return response.status(400).json({ error: "Didn't find this project" });
  }

  repositories[index].likes++;
  const likes = repositories[index].likes;

  return response.json({ likes });

});

module.exports = app;
