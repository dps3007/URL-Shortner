import { hashedPasswordWithSalt } from "../utils/hashPassword.js";
import db from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { getUserByEmail } from "../services/user.service.js";
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from "../validation/request.validation.js";
import { createUserToken } from "../utils/token.js";

export async function signup(req, res) {
  try {
    // Validate request body
    const body = signupPostRequestBodySchema.parse(req.body);

    // Check if user already exists
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password and generate salt
    const { salt, password: hashedPassword } = hashedPasswordWithSalt(body.password);

    // Insert user into database
    await db.insert(usersTable).values({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hashedPassword,
      salt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    console.log("LOGIN BODY:", req.body);
    const body = loginPostRequestBodySchema.parse(req.body);

    const user = await getUserByEmail(body.email.trim());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Correct destructuring here
    const { password: hashedPassword } = hashedPasswordWithSalt(body.password.trim(), user.salt);

    if (hashedPassword !== user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // create token
    const token = await createUserToken({id: user.id});
    

    return res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
