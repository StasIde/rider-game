import { Router } from "express";

import { trickController } from "../controllers/TrickController.js";

const router = new Router();

router.get("/", trickController.getAll);
router.post("/", trickController.create);
router.delete("/:id", trickController.delete);

export default router;
