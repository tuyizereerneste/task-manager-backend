import User from "./User";
//import Task from "./Tasks";
import Board from "./Board";

User.hasMany(Board, { foreignKey: "user_id", as: "boards" });
Board.belongsTo(User, { foreignKey: "user_id", as: "user" });

//User.hasMany(Task, { sourceKey: "id", foreignKey: "creator_id", as: "tasks" });
//Task.belongsTo(User, { foreignKey: "creator_id", as: "user" });

//User.hasMany(Task, { foreignKey: "assignee_id" });
//Task.belongsTo(User, { foreignKey: "assignee_id" });

//Board.hasMany(Task, { foreignKey: "board_id" });
//Task.belongsTo(Board, { foreignKey: "board_id" });

export { User, Board };