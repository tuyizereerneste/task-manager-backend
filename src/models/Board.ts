import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/database";

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

// Define associations
//Board.hasMany(Task, { foreignKey: 'board_id', as: 'tasks' });

export default Board;