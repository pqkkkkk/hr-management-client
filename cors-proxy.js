const express = require("express");
const cors = require("cors");
const request = require("request");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  const url =
    "https://hr-management-server-243775569608.europe-west1.run.app" + req.url;

  req.pipe(request(url)).pipe(res);
});

app.listen(8080, () => {
  console.log("CORS Proxy running on http://localhost:8080");
});
