const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const menuItemSchema = require('./schema.js');

if(process.env.NODE_ENV !== "PRODUCTION"){
  require('dotenv').config();
}

const app = express();
const port = process.env.PORT;

app.use(express.json());

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to Database Successfully"))
  .catch((er) => console.log(er,"Connection failed"))

  app.put('/menu/:id', async (req, res) => {
    try {
      const id = req.params.id;
      console.log("Updating item with ID:", id);
  
      const updatedItem = await menuItemSchema.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedItem) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: updatedItem,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error while updating, try again",
        error: err.message,
      });
    }
  });
  

  app.delete('/menu/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deletedItem = await menuItemSchema.findByIdAndDelete(id);
  
      if (!deletedItem) {
        return res.status(404).json({ success: false, message: "Item not found, could not delete" });
      }
  
      res.status(200).json({ success: true, message: "Deleted Successfully", data: deletedItem });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error while deleting, try again",
        error: err.message,
      });
    }
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
