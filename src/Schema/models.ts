import mongoose from "mongoose";
import {UserSchema} from './userSchema'
//import IUser from '../interfaces/Iuser'
import {Model, Types } from "mongoose"
import { User } from "../types";

const { model } = mongoose;


interface UserModel extends Model<User> {
    checkCredentials(): any;
  }
export const UserModel = model("User", UserSchema)
