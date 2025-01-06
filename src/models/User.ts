import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/database";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.UUID,  // Change to UUID if you want consistency across models
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Users",
  }
);

// Define associations
//User.hasMany(Task, { foreignKey: 'creator_id', as: 'createdTasks' }); // One user can create many tasks
//User.hasMany(Task, { foreignKey: 'assignee_id', as: 'assignedTasks' }); // One user can be assigned many tasks

export default User;