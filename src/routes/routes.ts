import { Router } from "express";
import UserAuthentication from "../Controllers/UserAuthentication";
import BoardController from "../Controllers/BoardController";
import { verifyUser } from "../Middleware/verifyUser";
import TaskController from "../Controllers/TaskController";
import { verifyAdmin } from "../Middleware/verifyAdmin";

const router = Router();

router.post("/user/register", UserAuthentication.register);
router.post("/user/login", UserAuthentication.login);
router.get("/admin/get-all-users", verifyAdmin, UserAuthentication.getAllUsers);
router.get("/admin/get-user/:id", verifyAdmin, UserAuthentication.getUserById);
router.delete("/admin/delete-user/:id", verifyAdmin, UserAuthentication.deleteUser);
router.put("/user/update-user/:id", verifyUser, UserAuthentication.updateUser);

router.post("/board/create-board", verifyUser, BoardController.createBoard);
router.get("/board/my-boards", verifyUser, BoardController.getUserBoards);
router.delete("/board/delete/:id", verifyUser, BoardController.deleteBoard);

router.post("/task/create-task", verifyUser, TaskController.createTask);
router.get("/task/my-tasks", verifyUser, TaskController.getTasks);
router.get("/task/get-task-by-status", verifyUser, TaskController.getTasksByStatus);
router.delete("/task/delete/:task_id", verifyUser, TaskController.deleteTask);
router.put("/task/update-task/:task_id", verifyUser, TaskController.updateTask);



export default router;