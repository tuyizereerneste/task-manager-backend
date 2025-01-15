import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/database";
import User from "./User";
import Board from "./Board";

class Task extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public priority!: 'LOW' | 'MEDIUM' | 'HIGH';
  public status!: 'To Do' | 'In Progress' | 'Completed';
  public due_date!: Date;
  public creator_id!: string;
  public assignee_id!: string;
  public board_id!: string;
  public created_at!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM,
      values: ["LOW", "MEDIUM", "HIGH"],
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["To Do", "In Progress", "Completed"],
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assignee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    board_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Board, // This should match the table name of the Board model
        key: "id",
      },
      onDelete: "CASCADE", // Automatically delete tasks when the board is deleted
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Tasks",
    timestamps: false,
    hooks: {
      beforeCreate: (task: Task) => {
        if (!task.assignee_id) {
          task.assignee_id = task.creator_id;
        }
      },
      beforeUpdate: (task: Task) => {
        if (!task.assignee_id) {
          task.assignee_id = task.creator_id;
        }
      },
    },
  }
);


export default Task;