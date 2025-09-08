import { randomBytes, createHmac } from "node:crypto";


export function hashedPasswordWithSalt(password, userSalt){
    // Generate salt & hash password
  const salt = userSalt ?? randomBytes(16).toString("hex"); 
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    return { salt, password : hashedPassword};
}