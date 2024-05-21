const joi = require("joi");

module.exports.listingSchema =  joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string(),
    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5),
        comment: joi.string(),
    }),
})