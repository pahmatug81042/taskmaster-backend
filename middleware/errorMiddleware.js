/**
 * notFound - create a consistent "not found" error and forward to errorHandler
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * errorHandler - central error handler middleware
 * 
 * - Normalizes various error types (Mongoose, JSON parse, duplicate keys)
 * - Hides stack traces and sensitive details in production
 * - Logs the full error server-side for later inspection
 */
const errorHandler = (err, req, res, next) => {
    // If headers already sent, delegate to the default Express handler
    if (res.headersSent) {
        return next(err);
    }

    // Default status code
    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        // Aggregate validation messages
        const errors = Object.values(err.errors || {}).map((e) => e.message).filter(Boolean);
        if (errors.length) {
            message = errors.join(", ");
        }
    }

    // Handle Mongo duplicate key error (e.g., unique index violation)
    if (err.code && err.code === 11000) {
        statusCode = 400;
        const fields = Object.keys(err.keyValue || {}).join(", ");
        message = fields ? `Duplicate value for field(s): ${fields}` : "Duplicate key error";
    }

    // Handle bad JSON parse (SyntaxError thrown by body parser)
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        statusCode = 400;
        message =  "Malformed JSON in request body";
    }

    // Log the full error server-side (stack included)
    // In production you may want to forward this to a logging pipeline (winston/pino, Sentry, etc.)
    console.error("ErrorHandler:", {
        message: err.message,
        name: err.name,
        statusCode,
        stack: err.stack,
        ...(err.code && { code: err.code }),
    });

    // Send safe response to client
    res.status(statusCode);

    const payload = {
        message,
    };

    // Only include stack in development for debugging
    if (process.env.NODE_ENV === "development") {
        payload.stack = err.stack;
    }
    
    return res.json(payload);
};

module.exports = { notFound, errorHandler };