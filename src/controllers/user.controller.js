import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;
    const checkUser = await userModel.findOne({ username });

    if (checkUser)
      return responseHandler.badrequest(res, "username already used");

    const users = new userModel();

    users.displayName = displayName;
    users.username = username;
    users.setPassword(password);

    await users.save();
  
    const token = jsonwebtoken.sign(
      { data: users.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
   
    responseHandler.created(res, {
      token,
      ...users._doc,
      id: users.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await userModel
      .findOne({ username })
      .select("username password salt id displayName");

    if (!users) return responseHandler.badrequest(res, "User not exist");

    if (!users.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");
    const token = jsonwebtoken.sign(
      { data: users.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    users.password = undefined;
    users.salt = undefined;

    responseHandler.created(res, {
      token,
      ...users._doc,
      id: users.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const users = await userModel
      .findById(req.users.id)
      .select("password id salt");

    if (!users) return responseHandler.unauthorize(res);

    if (!users.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    users.setPassword(newPassword);

    await users.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const users = await userModel.findById(req.users.id);

    if (!users) return responseHandler.notfound(res);

    responseHandler.ok(res, users);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword,
};
