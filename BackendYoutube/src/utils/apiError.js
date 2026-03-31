/*
ApiError (Custom Error Class)

Purpose:
Creates standardized API error objects for consistent error responses in the backend.

Why use it:
Instead of throwing generic errors, this class allows us to include
HTTP status codes, success flags, and additional error details.

Key features:
- Extends the built-in JavaScript Error class
- Adds custom properties like statusCode, success, and errors
- Generates a proper stack trace for debugging

Stack handling:
If a stack trace is provided, it uses that.
Otherwise Error.captureStackTrace() generates a stack trace starting
from where the error occurred (excluding the constructor).

Example usage:
throw new ApiError(404, "User not found");

Typical API response:
{
  success: false,
  message: "User not found",
  errors: []
}
*/
class apiError extends Error{

    constructor(
        statusCode ,
        message = "Something went wrog",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {apiError}