import { NextApiRequest, NextApiResponse } from "next";
import { entriesController } from "../../../controllers";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  entriesController.PUT(req, res);

  switch (req.method) {
    case "PUT":
      return entriesController.PUT(req, res);
    case "GET":
      return entriesController.GETBYID(req, res);

    case "DELETE":
    default:
      res.status(400).json({ error: "El id no es válido" });
  }
};

export default handler;
