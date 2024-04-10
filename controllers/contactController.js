const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json({ contacts });
});

const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).send("all feilds are mandatory");
    //throw new Error('all feilds are mandatory')
    return;
  }
  const contact = await Contact.create({ name, email, phone, user_id: req.user.id });
  res.status(201).json(contact);
});

// const getContact = asyncHandler(async(req, res) => {
//   const contact = await Contact.findById(req.params.id)
//   if(!contact){
//     return res.status(404).json({ message: 'Contact not found' });
//     res.status(400).send('contact not found');
//     throw new Error('contact not found')
//     return;
//   }
//   res.status(200).json(contact)
// })

const getContact = asyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    console.log(contact);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    // res.status(400).send('contact not found');
    throw new Error("contact not found");
    // return;
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("user dont have permission to update other user contacts")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404)
    throw new Error("contact not found")
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("user dont have permission to dalete other user contacts")
  }

  await Contact.deleteOne({ _id: req.params.id });

  return res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
