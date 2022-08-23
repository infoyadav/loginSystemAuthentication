const userValidation = async (req, res, next) => {
	const payload = {
		userName: req.body.userName,
		email: req.body.email,
		password: req.body.password,
		mobileNumber: req.body.mobileNumber,
		birthYear: req.body.birthYear,
		skillSet: req.body.skillSet,
		is_active: req.body.is_active,
	};

	const { error } = validation.validate(payload);
	if (error) {
		res.status(406);
		return res.json(
			errorFunction(true, `Error in User Data : ${error.message}`)
		);
	} else {
		next();
	}
};
module.exports = userValidation;