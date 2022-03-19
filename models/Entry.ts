import mongoose, { Schema, Model } from "mongoose";
import { Entry } from "../interfaces";

export interface IEntry extends Entry {}

const entrySchemma = new Schema({
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "in-progress", "finished"],
      message: "{VALUE} not a permitted state",
    },
    default: "pending",
  },
});

const EntryModel: Model<IEntry> =
  mongoose.models?.Entry ?? mongoose.model("Entry", entrySchemma);

export default EntryModel;
