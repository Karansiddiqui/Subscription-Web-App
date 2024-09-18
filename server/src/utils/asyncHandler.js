import { ApiError } from "../utils/ApiError.js";

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => res.status(400).json(new ApiError(400, {message: err.message})))
    }
}


export default asyncHandler;