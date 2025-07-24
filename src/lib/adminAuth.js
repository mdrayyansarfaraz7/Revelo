import jwt from 'jsonwebtoken';

export function verifyAdmin(req) {
    const authHeader = req.header.get('authorization');
    if (!authHeader) {
        return false;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        return decoded.role === 'admin';
    } catch {
        return false;
    }
}