const mongoose = require("mongoose");

/**
 * Middleware to validate MongoDB objectId params
 * Blocks requests early if the ID is malformed
 */
const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid ${paramName}` });
        }
        next();
    };
};

module.exports = validateObjectId;