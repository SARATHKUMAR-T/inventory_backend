import express from "express";
import { User } from "../Models/Users.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";

export const userRouter = express.Router();
// login user
userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(500).json({ message: "user doesn't exist" });
    }

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validatePassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    res
      .status(200)
      .json({ message: "user logged in successfully", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
});

// Signup User
userRouter.post("/signup", async (req, res) => {
  try {
    const signupUser = await User.findOne({ email: req.body.email });

    if (signupUser) {
      return res
        .status(400)
        .json({ message: "user already exists", existingUser: true });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = await new User({
      ...req.body,
      password: hashedPassword,
    }).save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    user
      ? res
          .status(200)
          .json({ message: "user created successfully", user, token })
      : res.status(500).json({ message: "unable to create new user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
});

// add company name

userRouter.post("/addcompanyname", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    if (!token) {
      res.status(400).json({ message: "invalid credentilas" });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const company = await User.findOneAndUpdate(
      { _id: decode.id },
      { $set: { companyName: req.body.companyName } },
      { new: true }
    );

    res.status(200).json({ message: "company name updated", company });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
});

//edit user name

userRouter.put("/editname", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    if (!token) {
      res.status(400).json({ message: "invalid credentilas" });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const name = await User.findOneAndUpdate(
      { _id: decode.id },
      { $set: { firstName: req.body.firstName, lastName: req.body.lastName } },
      { new: true }
    );

    res.status(200).json({ message: "Username update successfully", name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
});

// forgot-password
userRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ message: "User Not Exists!!", user: false });
    }
    const secret = process.env.SECRET_KEY + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "15m",
    });
    const link = `https://forgot-password-1.netlify.app/reset-password/${oldUser._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "spellbee931@gmail.com",
        pass: "yltkrnhhtfyurhaw",
      },
    });
    var mailOptions = {
      from: "spellbee931@gmail.com",
      to: `${oldUser.email}`,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).json({ message: "error occured", error });
        console.log(error);
      } else {
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error", error });
  }
});

// reset password
userRouter.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.SECRET_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);

    if (!verify) {
      res.status(500).json({ message: "invalid credentials" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.status(200).json({
      message: "new password updated successfully",
      newpassword: true,
    });
  } catch (error) {
    res.json({ status: "Something Went Wrong", error });
  }
});
