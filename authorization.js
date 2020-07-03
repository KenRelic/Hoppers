const Joi = require('@hapi/joi');



const registerAdminUserValidation = data => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
        role: Joi.string().min(4).required()
    })
    return schema.validate(data)
}

const adminLoginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    })
    return schema.validate(data)
}

const createNewJobValidation = data => {
    const schema = Joi.object({
        position: Joi.string().min(2).required(),
        department: Joi.string().min(2).required(),
        location: Joi.string().min(2).required(),
        role: Joi.string().required(),
        description: Joi.object().required(),
        role_requirement: Joi.object().required(),
        perks: Joi.object()
    })
    return schema.validate(data)
}


module.exports.adminLoginValidation = adminLoginValidation;
module.exports.registerAdminUserValidation = registerAdminUserValidation;
module.exports.createNewJobValidation = createNewJobValidation;