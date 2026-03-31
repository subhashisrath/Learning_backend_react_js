/*
asyncHandler

Purpose:
Wraps async Express route handlers to automatically catch errors and pass them
to Express error middleware using next(err). This removes the need to write
try-catch blocks in every async controller.

How it works:
1. Takes an async function (requestHandler) as input.
2. Returns a new middleware function (req, res, next).
3. Executes the async function inside Promise.resolve().
4. If the promise rejects, .catch(next) sends the error to Express error middleware.

Usage:
router.get("/users", asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
}));
*/
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }
}

export { asyncHandler }

// Way One of making asyncHandler(using trycatch)
// const asyncHandler = (fn) => async (req, res, next) => {

//     try {

//         await fn(req, res, next)

//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message : err.message,
//         })
//     }
// }