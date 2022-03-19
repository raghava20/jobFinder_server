import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send({ message: "Access Denied" });
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decodedToken.accountId;
        next();
    }
    catch (err) {
        res.status(401).send({ message: err })
    }
}