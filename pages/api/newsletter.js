import { connectDatabase, insertDocument } from "../../helpers/db-util";

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({
        message: "invalid email address",
      });
      return;
    }

    let client;

    try {
      client = await connectDatabase('newsletter');
    } catch (error) {
      res.status(500).json({ message: "Connecting to database failed" });
      return;
    }

    try {
      await insertDocument(client, "emails", { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Inserting data failed" });
      return;
    }

    res.status(201).json({
      message: "email registered",
    });
  }
}

export default handler;
