import jwt from "jsonwebtoken";
import UsersModel from "../services/users/schema"
import createHttpError from "http-errors"

type MyPayload = {
    id: string
}

export const JWTAuthenticate = async (user: User) => {
  const accessToken = await generateJWTToken({
    _id: user._id,
    username: user.username,
  });
  return accessToken;
};

const generateJWTToken = (payload: MyPayload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

// USAGE: const token = await generateJWTToken({_id: "oaijsdjasdojasoidj"})

export const verifyJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    })
  );

  const verifyRefreshToken = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, payload) => {
      if (err) reject(err)
      else resolve(payload)
    })
  )

// USAGE: const payload = await verifyJWT(token)

export const verifyRefreshTokenAndGenerateNewTokens = async (
  currentRefreshToken
) => {
  try {
    // 1. Check the validity of the current refresh token (exp date and integrity)
    const payload = await verifyRefreshToken(currentRefreshToken);

    // 2. If token is valid, we shall check if it is the same as the one saved in db
    const user = await UsersModel.findById(payload._id);

    if (!user)
      throw new createHttpError(404, `User with id ${payload._id} not found!`);

    if (user.refreshToken && user.refreshToken === currentRefreshToken) {
      // 3. If everything is fine --> generate accessToken and refreshToken
      const { accessToken, refreshToken } = await JWTAuthenticate(user);

      // 4. Return tokens
      return { accessToken, refreshToken };
    } else {
      throw new createHttpError(401, "Refresh token not valid!");
    }
  } catch (error) {
    throw new createHttpError(401, "Refresh token expired or compromised!");
  }
};
