import express from "express";
import createHttpError from "http-errors";
import  UserModel  from "../users/schema";
import { JWTAuthenticate } from "../../auth/tools";
import bcrypt from "bcrypt"


const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});



const checkCredentials = async (name: string, password: string) => {
  const user = await UserModel.findOne({ name });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
}



usersRouter.post("/login", async (req:Request, res:Response, next:any) => {

  try {
    // 1. Get credentials from req.body
    const { name, password } = req.body

    // 2. Verify credentials
  const user:any = await checkCredentials(name, password)

    if (user) {
      // 3. If credentials are fine we are going to generate an access token
      const accessToken = await JWTAuthenticate(user)
      res.send({ accessToken })
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials not ok!"))
    }
  } catch (error) {
    next(error)
  }
});

usersRouter.post("/delete", async (req:any, res:any, next:any) => {

    try {
      const { name, password } = req.body
  
    const user:any = await checkCredentials(name, password)
  
      if (user) {
       
      } else {
        // 4. If they are not --> error (401)
        next(createHttpError(401, "Credentials not ok!"))
      }
    } catch (error) {
      next(error)
    }
  });
  





export default usersRouter;