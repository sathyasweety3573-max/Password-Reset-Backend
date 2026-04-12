import User from "../models/user.schema.js";
import bcrypt from "bcrypt";

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // check if user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    //Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({ name, email, password: hashedPassword });

    return res
      .status(201)
      .json({ message: "User created successfully", user: user._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error creating user: " + error.message });
  }
}

export default createUser;