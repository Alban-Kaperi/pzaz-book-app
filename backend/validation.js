// VALIDATION
const Joi= require("joi");

const registerValidation= (data)=>{
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required(),
    
        password: Joi.string()
            .min(6)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });

    // data validation before creating a user
    return schema.validate(data);

}


const loginValidation= (data)=>{
    const schema = Joi.object({
        password: Joi.string()
            .min(6)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });

    // data validation before creating a user
    return schema.validate(data);

}


module.exports = {registerValidation, loginValidation};