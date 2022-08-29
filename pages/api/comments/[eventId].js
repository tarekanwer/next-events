import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
} from "../../../helpers/db-util";

async function handler(req, res) {
  const eventId = req.query.eventId;
  let client;
  try {
    client = await connectDatabase("events");
  } catch (error) {
    res.status(500).json({ message: "Connecting to database failed" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;
    if (
      !text ||
      !name ||
      !email.includes("@") ||
      name.trim() === "" ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." });
       client.close();
      return;
    }
    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    let result;

    try {
      result = await insertDocument(client, "comments", newComment);
      newComment._id = result.insertedId;
      res.status(201).json({ message: "Added comment.", comment: newComment });
    } catch (error) {
      res.status(500).json({ message: "Inserting comment failed!" });
    }
  }
  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(client, "comments", {_id: -1 });
      res.status(200).json({ comments: documents });
    } catch (error) {
      res
        .status(500)
        .json({ message: "error fetching data from the database" });
    }
  }
  client.close();
}

export default handler;
