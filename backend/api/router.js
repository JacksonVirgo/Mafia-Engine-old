const express = require("express");
const cors = require("cors");
const router = express.Router();
const scrapeReplacement = require("../tools/scrape/scrapeReplacement");
const config = require("../config.json");

let authToken = process.env.DEV_KEY || config.DEV_KEY;

router.use(cors());
router.get("ping", (req, res) => res.send("pong"));
router.get("/replacement/:thread", async (req, res) => {
    console.log(req.params);
    let rawURL = req.params.thread;
    const processedURL = decodeURIComponent(rawURL);
    let replacement = await scrapeReplacement.getReplacementTest(processedURL);
    res.send(replacement);
});
router.route("/auth/:authId").get((req, res) => {
    let requestedAuthToken = req.params.authId;
    let result = requestedAuthToken === authToken ? 200 : 401;
    console.log(result);
    res.send({ result });
});

router.use("/ws", require("./websocket"));

module.exports = router;
