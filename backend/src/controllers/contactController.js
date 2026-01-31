import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contact = await Contact.create({ name, email, message });
    res.status(201).json(contact);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
