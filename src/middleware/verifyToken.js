import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    let token = req.headers.token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid Token" })
        req.user = decoded
        next()
    })
}
