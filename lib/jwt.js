import jwt from "jsonwebtoken";

//login token
export function signJwtToken(payload, options = {}) {
    // console.log("Payload:", payload); // Debugging statement
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT secret is not defined in environment variables.");
    }
    const token = jwt.sign(payload, secret, options);
    return token;
}

//blog token
export function verifyJwtToken(token){
    try{
        const secret = process.env.JWT_SECRET;
        const payload = jwt.verify(token,secret);
        return payload;
    }catch(error){
        console.log(error);
        return null
    }
}
