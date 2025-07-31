import jwt from 'jsonwebtoken';

export function verifyAdmin(req) {
     try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            console.log("No auth header");
            return false;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        console.log("Decoded JWT:", decoded);
        return decoded.role === 'admin';
    } catch (err) {
        console.log("JWT verification failed:", err.message);
        return false;
    }
}