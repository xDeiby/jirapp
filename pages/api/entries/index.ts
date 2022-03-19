import type { NextApiRequest, NextApiResponse } from "next";
import { entriesController } from "../../../controllers";
import { IEntry } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IEntry;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return entriesController.GET(req, res);

    case "POST":
      return entriesController.POST(req, res);

    case "PUT":
      return entriesController.PUT(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}
