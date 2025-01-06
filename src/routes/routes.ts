import { Router } from "express";
import UserAuthentication from "../Controllers/UserAuthentication";
import BoardController from "../Controllers/BoardController";
import { verifyUser } from "../Middleware/verifyUser";

const router = Router();

router.post("/user/register", UserAuthentication.register);
router.post("/user/login", UserAuthentication.login);

router.post("/board/create-board", verifyUser, BoardController.createBoard);
router.get("/board/my-boards", verifyUser, BoardController.getUserBoards);
router.delete("/board/delete/:id", verifyUser, BoardController.deleteBoard);

export default router;