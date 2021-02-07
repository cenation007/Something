const joi = require('@hapi/joi')

const registerValidation = data => {
    const schema = {
    name: joi.string().min(6).required(),
    email: joi.string().min(10).required().email(),
    password: joi.string().min(8).required()
    }
    return joi.validate(data,schema);
}

const loginValidation = data => {
    const schema = {
    email: joi.string().min(10).required().email(),
    password: joi.string().min(8).required()
    }
    return joi.validate(data,schema);
}

const postValidation = data => {
    const schema = {
        title: joi.string().min(3).required(),
        body: joi.string().min(3).required(),
    }
    return joi.validate(data,schema)
}

const updateValidation = data => {
    const schema ={ 
        email: joi.string().min(10).required(),
    }
    return joi.validate(data,schema)
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.updaateValidation = updateValidation;