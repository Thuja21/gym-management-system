import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) return res.status(403).json("Token is not valid!");
        req.user = decoded; // contains id and member_id
        next();
    });
};

