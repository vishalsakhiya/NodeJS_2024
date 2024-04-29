export const response = (res, { data = null, message = false, error = false, status = 200 }) => {
    message = message ? message : error ? "Failed" : "Success";
    return res.status(status).json({
        error,
        status,
        message,
        data
    })
}