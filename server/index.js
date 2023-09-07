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
      ...newFormData, // Include all the fields from the front end data object
    };

    // Update the user's data array with the new form data object using $push
    const updatedUser = await formUser.findOneAndUpdate(
      { name: userName },
      { $push: { data: formDataWithId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(201).json({ id: templateId }); // Send the generated ID in the response with a 201 status code (Created)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error adding user data");
  }
});

app.get('/responses', authenticateToken, async (req, res) => {
  try {
    const userName = req.name;

    // Assuming you want to retrieve the 'responses' property for a specific user
    const user = await formUser.findOne({ name: userName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const responses = user.responses;

    // Assuming you want to send the responses as a JSON response
    res.json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.post("/users/login", async (req, res) => {
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

    // Find the user who has the matching form data
    const user = await formUser.findOne({ "data.id": formId });

    if (!user) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Find the specific form data object with the matching ID
    const formData = user.data.find((data) => data.id === formId);

    if (!formData) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Send the form data as a JSON response
    res.json(formData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/users/responses/:id", async (req, res) => {
  try {
    // Extract the Data ID from the URL parameters
    const dataId = req.params.id;

    // Find the user who has the specified data ID in their 'data' array
    const user = await formUser.findOne({ "data.id": dataId });

    if (!user) {
      return res.status(404).send("User or data not found");
    }

    // Extract the form data from the request body
    const formData = req.body; // Assuming your form data is in the request body

    // Push the form data into the user's 'responses' array
    user.responses.push(formData);

    // Save the updated user document
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
