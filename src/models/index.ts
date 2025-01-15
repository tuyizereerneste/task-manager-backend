import { sequelize } from '../utils/database';
import Board from './Board';
import Task from './Tasks';
import User from './User';
import { defineAssociations } from './associations';

// Initialize models
const models = {
    User,
    Board,
    Task,
};

// Define relationships
defineAssociations();

export { sequelize, models };
