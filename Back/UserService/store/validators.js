import Joi, { string } from "joi";

export function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string() .min(1) .max(99999) .required() .email(),
        password: Joi.string() .min(1) .max(99999) .required()
    });

    return schema.validate(user);
}

export function validateRegister(user) {
    const schema = Joi.object({
        username: Joi.string() .min(1) .max(50) .required(),
        email: Joi.string() .min(1) .max(99999) .required() .email(),
        password: Joi.string() .min(1) .max(99999) .required()
    });

    return schema.validate(user);
}

export function validateUpdateUser(user) {
    const schema = Joi.object({
        username: Joi.string() .min(1) .max(50),
        email: Joi.string() .min(1) .max(99999) .email(),
        role: Joi.string() .min(1) .max(50),
        password: Joi.string() .min(1) .max(99999),
        access_token: Joi.string() .min(64) .max(64),
        refresh_token: Joi.string() .min(64) .max(64),
        gitlabID: Joi.string() .min(5) .max(12)
    });

    return schema.validate(user);
}

export function validateGitLab(user) {
    const schema = Joi.object({
        code: Joi.string() .min(64) .max(64) .required(),
    })

    return schema.validate(user);
}

export function validateProfileCreation(profile) {
    const schema = Joi.object({
        userId: Joi.string() .required(),
        name: Joi.string() .min(1) .max(50),
        surname: Joi.string() .min(1) .max(50),
        age: Joi.number() .min(1) .max(100),
        skills: Joi.array().items(Joi.string().valid('Security', 'Best practice', 'Optimization', 'Javascript', 'Python', 'HTML', 'CSS', 'NodeJs', 'React', 'Mongo', 'Rust', 'Go', 'C', 'C++', 'C#'))
    })

    console.log('profile validation')
    return schema.validate(profile);
}

export function validateProfileUpdate(profile) {
    const schema = Joi.object({
        name: Joi.string() .min(1) .max(50),
        surname: Joi.string() .min(1) .max(50),
        age: Joi.number() .min(1) .max(100),
        skills: Joi.array().items(Joi.string().valid('Security', 'Best practice', 'Optimization', 'Javascript', 'Python', 'HTML', 'CSS', 'NodeJs', 'React', 'Mongo', 'Rust', 'Go', 'C', 'C++', 'C#'))
    })

    return schema.validate(profile);
}

export function validateReviewCreation(review) {
    const schema = Joi.object({
        userId: Joi.string() .required(),
        name: Joi.string() .min(1) .max(25) .required(),
        description: Joi.string() .min(1) .max(99999) .required(),
        repoUrl:  Joi.string() .min(1) .max(99999) .required(),
        status:  Joi.string() .min(1) .max(99999) .required(),
        objectives: Joi.array().items(Joi.string().valid('Security', 'Best practice', 'Optimization')),
        skillsNeeded: Joi.array().items(Joi.string().valid('Javascript', 'Python', 'HTML', 'CSS', 'NodeJs', 'React', 'Mongo', 'Rust', 'Go', 'C', 'C++', 'C#')),
        thumbnail: Joi.string() .min(1) .max(99999),
    })

    return schema.validate(review);
}

export function validateReviewUpdate(review) {
    const schema = Joi.object({
        name: Joi.string() .min(1) .max(25),
        description: Joi.string() .min(1) .max(99999),
        repoUrl:  Joi.string() .min(1) .max(99999),
        status:  Joi.string() .min(1) .max(99999),
        objectives: Joi.array().items(Joi.string().valid('Security', 'Best practice', 'Optimization')),
        skillsNeeded: Joi.array().items(Joi.string().valid('Javascript', 'Python', 'HTML', 'CSS', 'NodeJs', 'React', 'Mongo', 'Rust', 'Go', 'C', 'C++', 'C#')),
        thumbnail: Joi.string() .min(1) .max(99999),
    })

    return schema.validate(review);
}

export function validateCommentCreation(review) {
    const schema = Joi.object({
        comment: Joi.string() .min(1) .max(99999) .required(),
        lineSuggestion: Joi.string() .min(1) .max(99999) .required(),
        lineContent: Joi.string() .min(1) .max(99999) .required(),
        line: Joi.string() .min(1) .max(25) .required(),
        fileName: Joi.string() .min(1) .max(25) .required(),
        language: Joi.string() .min(1) .max(25) .required(),
        reviewId: Joi.string() .required(),
    })

    return schema.validate(review);
}

export function validateCommentUpdate(review) {
    const schema = Joi.object({
        comment: Joi.string() .min(1) .max(99999),
        lineSuggestion: Joi.string() .min(1) .max(99999),
        lineContent: Joi.string() .min(1) .max(99999),
        line: Joi.string() .min(1) .max(25),
        fileName: Joi.string() .min(1) .max(25),
        language: Joi.string() .min(1) .max(25),
        reviewId: Joi.string(),
    })

    return schema.validate(review);
}

export function validateClaim(claim) {
    const schema = Joi.object({
        reviewId: Joi.string() .required(),
    })

    return schema.validate(claim);
}