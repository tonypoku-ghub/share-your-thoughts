const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

//If the request gets this far without resolving then it must be a wrong route
router.use((req, res) => res.send("Wrong route!!"));

module.exports = router;
