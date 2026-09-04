import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

const updateUser = async (req, res, next) => {

	if (req.user._id !== req.params._id)
		return next(errorHandler(401, "You can only update your own account!"));
	try {
		if (req.body.password) {
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}

		
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id, 
			{
				$set: {
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
					avatar: req.body.avatar,
				},
			},
			{ returnDocument: "after" },
		);

		const { password, ...rest } = updatedUser._doc;
		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};

export { updateUser };
