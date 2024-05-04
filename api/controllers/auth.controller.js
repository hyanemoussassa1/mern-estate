import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hash = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hash });
    try{
        await newUser.save();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
    res.status(201).json({ message: "User signup successful" });
    console.log(req.body);
};