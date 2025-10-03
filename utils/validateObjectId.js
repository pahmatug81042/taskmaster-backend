const validator = require("validator");

const validateObjectId = (id) => {
    return validator.isMongoId(id);
};

module.exports = validateObjectId;