
// const mongoose = require('mongoose');


// const renterSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   Rid: { type: String, required: true, unique: true },
//   email: { type: String, required: true , unique: true},
//   propertyId: { type: String, required: true },
//   mobaile: { type: String, required: true },
//   rent: { type: Number, required: true },
//   day: { type: Number, required: true },
//   ownerID: { type: String, required: true },
//   status: { type: String, required: true, default: 'due' },
// });

// const Renter = mongoose.model('Renter', renterSchema);

// module.exports = Renter;


const mongoose = require('mongoose');

const renterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Rid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobaile: { type: String, required: true },
  rent: { type: Number, required: true },
  day: { type: Number, required: true },
  ownerID: { type: String, required: true },

  status: {
    type: String,
    enum: ['paid', 'due', 'overdue', 'upcoming'],
    default: 'upcoming'   
  },

  daysLate: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('Renter', renterSchema);