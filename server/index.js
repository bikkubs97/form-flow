import dotenv from "dotenv";

import { v4 as uuidv4 } from "uuid";

import jwt from "jsonwebtoken";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";

import cors from "cors";

import mongoose from "mongoose";

import bcrypt from "bcrypt";

import formUser from "./model.js";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => {
  console.log("connected to mongoose!!");
});

function generateUniqueId() {
  return uuidv4();
}

app.put("/users/data", authenticateToken, async (req, res) => {
  try {
    const userName = req.name;
    const newFormData = req.body;
    console.log(newFormData);
    const templateId = generateUniqueId();
    const formDataWithId = {
      id: templateId,
      ...newFormData,
    };

    const updatedUser = await formUser.findOneAndUpdate(
      { name: userName },
      { $push: { data: formDataWithId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(201).json({ id: templateId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error adding user data");
  }
});

app.get("/responses", authenticateToken, async (req, res) => {
  try {
    const userName = req.name;
    const user = await formUser.findOne({ name: userName });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const responses = user.responses;

    res.json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new formUser({
      name: req.body.name,
      password: hashedPassword,
      data: req.body.data,
    });
    await user.save();
    res.status(201).send("success!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("error");
  }
});

app.post("/users/login", authenticateToken, async (req, res) => {
  try {
    const user = await formUser.findOne({ name: req.body.name });
    if (!user) {
      return res.status(400).send("can not find user");
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ user: user }, process.env.JWT_SECRET);

      res.status(202).json({ token });
    } else {
      res.send("Failure");
    }
  } catch {
    res.status(500).send();
  }
});

app.get("/form/:id", async (req, res) => {
  try {
    const formId = req.params.id;

    const user = await formUser.findOne({ "data.id": formId });

    if (!user) {
      return res.status(404).json({ error: "Form not found" });
    }

    const formData = user.data.find((data) => data.id === formId);

    if (!formData) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json(formData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/users/responses/:id", async (req, res) => {
  try {
    const dataId = req.params.id;

    const user = await formUser.findOne({ "data.id": dataId });

    if (!user) {
      return res.status(404).send("User or data not found");
    }

    const formData = req.body;

    user.responses.push(formData);

    await user.save();

    res.status(200).json({ message: "Form data submitted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error submitting form data");
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.name = payload.user.name;
    next();
  });
}

app.listen(3000);
