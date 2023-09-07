import mongoose from "mongoose"

import { Schema } from "mongoose";



const formUserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    data: { type: Array, default: [] },
    responses : {type: Array, default:[]}
  });



export default mongoose.model('FormUser', formUserSchema);