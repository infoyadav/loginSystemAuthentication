const joi = require("joi");

const validation = joi.object({
    name: joi.string().alphanum().min(3).max(25).trim(true).required(),
    email: joi.string().email().trim(true).required(),
    password: joi.string().min(8).trim(true).required(),
    // mobileNumber: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
    mobileNumber: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).regex(/^\d{3}-\d{3}-\d{4}$/).required(),
    // birthYear: joi.number().integer().min(1920).max(2000),
//     skillSet: joi.array().items(joi.string().alphanum().trim(true))
// .default([]),
//    is_active: joi.boolean().default(true),
});

module.exports = validation;