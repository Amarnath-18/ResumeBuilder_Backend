import jwt from 'jsonwebtoken'

export const verifyToken = async(req , res , next)=>{
    try {
        // Check for token in Authorization header first, then in cookies
        const authHeader = req.headers['authorization'];
        let token = authHeader && authHeader.split(' ')[1];
        
        // If no token in header, check cookies
        if (!token) {
            token = req.cookies.token;
        }        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}