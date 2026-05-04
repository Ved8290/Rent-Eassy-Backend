const mongoose = require('mongoose');

const RentDataSchema = new mongoose.Schema({
  Rid: { type: String, required: true },
  rent: { type: Number, required: true },
  date: { type: Date, required: true },
  ownerID: { type: String, required: true },

 
}, { timestamps: true });

module.exports = mongoose.model('RentData', RentDataSchema);