import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../database";
import { Entry } from "../models";

const entriesController = {
  GET: async (req: NextApiRequest, res: NextApiResponse) => {
    await db.connect();
    const entries = await Entry.find().sort({ createdAt: "ascending" });
    await db.disconnect();

    res.status(200).json(entries);
  },

  GETBYID: async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ msg: "id no válido" });

    await db.connect();
    const entry = await Entry.findById(id);
    await db.disconnect();

    return !id ? res.status(404).end() : res.status(200).json(entry);
  },

  POST: async (req: NextApiRequest, res: NextApiResponse) => {
    const { description = "" } = req.body;
    const newEntry = new Entry({
      description,
      createdAt: Date.now(),
    });

    try {
      await db.connect();
      await newEntry.save();
      await db.disconnect();
      return res.status(201).json(newEntry);
    } catch (error) {
      await db.disconnect();
      return res.status(500).end();
    }
  },
  PUT: async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const entry = req.body;

    try {
      await db.connect();

      const existEntry = await Entry.findById(id);

      if (!existEntry) {
        return res.status(400).json({ error: "no existe entry con id " + id });
      }
      const updatedEntry = await Entry.findByIdAndUpdate(id, entry, {
        new: true,
        runValidators: true,
      });

      await db.disconnect();
      return res.status(200).json(updatedEntry);
    } catch (error) {
      await db.disconnect();
      return res.status(500).end();
    }
  },
};

export default entriesController;
