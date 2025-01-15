import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/database";
import Task from "./Tasks";

class Board extends Model {
  public id!: string;
  public name!: string;
  public user_id!: string;
  public created_at!: Date;
}

// Initialize the Board model
Board.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,  // Change from INTEGER to UUID
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Boards",
    timestamps: false,
  }
);


export default Board;