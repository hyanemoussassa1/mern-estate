import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";


export const signup = async (req, res, next) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    try {
        const hash = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hash });
        await newUser.save();
        res.status(201).json({ message: "User signup successful" });
    } catch (error) {
        next(error);
    }
}