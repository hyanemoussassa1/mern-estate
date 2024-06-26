import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export default (req, res) => {
    res.json({ message: "Api route is working" });
    };

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, "Forbidden to do this action"));

    try {
        if (req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true})

        const {password, updatedAt, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }

};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, "Forbidden to do this action"));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        next(error);
    }
};