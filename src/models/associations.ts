import User from "./User";
import Task from "./Tasks";
import Board from "./Board";


export const defineAssociations = () => {
    User.hasMany(Task, { foreignKey: "user_id", as: "tasks" });
    Task.belongsTo(User, { foreignKey: "user_id", as: "user" });

    Board.hasMany(Task, { foreignKey: 'board_id', as: 'tasks' });
    Task.belongsTo(Board, { foreignKey: 'board_id', as: 'board' });

    User.hasMany(Board, { foreignKey: "user_id", as: "boards" });
    Board.belongsTo(User, { foreignKey: "user_id", as: "user" });
};
