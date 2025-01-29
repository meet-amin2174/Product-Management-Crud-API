
const Joi = require("joi");



const regSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
  role: Joi.string().valid('admin', 'member').default('member')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required()
});

const requireNameSchema = Joi.object({
    name : Joi.string().required()
})

const createProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category_id: Joi.number().required()
})

const updateProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    currency: Joi.string().length(3).required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    category_id: Joi.number().required(),
    active:Joi.bool().required()

})

exports.regUser = (req,res,next) => {
    
    const {value,error} = regSchema.validate(req.body,{abortEarly:false});
    if(error){
        const errorMessages = error.details.map(err => `${err.context.label} is required!`);
        return res.status(400).json({errorMessages}); 
    }      req.body = value;

    next();
}
exports.loginUser = (req,res,next) => {
    const {error} = loginSchema.validate(req.body,{abortEarly:false});
    if(error){
        const errorMessages = error.details.map(err => `${err.context.label} is required!`);
        return res.status(400).send(errorMessages); 
    }   
    next();
}
exports.requireName = (req,res,next) => {
    const {error} = requireNameSchema.validate(req.body,{abortEarly:false});
    if(error){
        const errorMessages = error.details.map( err => `${err.context.label} is required!`);
        return res.status(400).json({errorMessages}); 
    }   
    next();
}
exports.createProductSchema = (req,res,next) => {
    const {error} = createProductSchema.validate(req.body,{abortEarly:false});
    if(error){
        const errorMessages = error.details.map(err => `${err.context.label} is required!`);
        return res.status(400).json({errorMessages}); 
    }   
    next();
}

exports.updateProductSchema = (req,res,next) => {
    const {error} = updateProductSchema.validate(req.body,{abortEarly:false});
    if(error){
        const errorMessages = error.details.map(err => `${err.context.label} is required!`);
        return res.status(400).json({errorMessages}); 
    }   
    next();
}
