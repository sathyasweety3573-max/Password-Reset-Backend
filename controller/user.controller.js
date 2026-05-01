import User from "../models/user.schema.js";

import bcrypt from "bcrypt";

async function createUser(
  req,
  res
) {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK REQUIRED FIELDS

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        error:
          "All fields are required",

      });

    }

    // CLEAN EMAIL

    const lowerCaseEmail =
      email
        .toLowerCase()
        .trim();

    // CHECK EXISTING USER

    const existingUser =
      await User.findOne({

        email:
          lowerCaseEmail,

      });

    if (existingUser) {

      return res.status(400).json({

        success: false,

        error:
          "User already exists",

      });

    }

    // HASH PASSWORD

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // CREATE USER

    const newUser =
      await User.create({

        name:
          name.trim(),

        email:
          lowerCaseEmail,

        password:
          hashedPassword,

      });

    return res.status(201).json({

      success: true,

      message:
        "Signup successful",

      user:
        newUser._id,

    });

  } catch (error) {

    console.log(
      "SIGNUP ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        "Error creating user",

    });

  }

}

export default createUser;