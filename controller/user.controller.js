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

    // validation
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

    // lowercase email
    const lowerCaseEmail =
      email.toLowerCase().trim();

    // check existing user
    const existingUser =
      await User.findOne({

        email: lowerCaseEmail,

      });

    if (existingUser) {

      return res.status(400).json({

        success: false,

        error:
          "User with this email already exists",

      });

    }

    // hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // create user
    const user =
      await User.create({

        name,

        email:
          lowerCaseEmail,

        password:
          hashedPassword,

      });

    return res.status(201).json({

      success: true,

      message:
        "User created successfully",

      user: user._id,

    });

  } catch (error) {

    console.log(
      "CREATE USER ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      error:
        "Server error",

    });

  }

}

export default createUser;