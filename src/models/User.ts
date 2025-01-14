import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/database";
import { queryObjects } from "v8";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: Role;
}

// Initialize the model
User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
      defaultValue: Role.USER,
    }
  },
  {
    sequelize,
    tableName: "Users",
  }
);

export default User;
export { Role };