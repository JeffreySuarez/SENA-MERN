import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSave = await newUser.save();
    const token = await createAccessToken({ id: userSave.id });
    res.cookie("token", token);
    res.json({
      id: userSave.id,
      username: userSave.username,
      email: userSave.email,
      createdAt: userSave.createdAt,
      updatedAt: userSave.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({ id: userFound.id });
    res.cookie("token", token);
    res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};
