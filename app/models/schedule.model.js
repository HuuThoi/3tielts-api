const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const ScheduleSchema = mongoose.Schema(
  {
    
    day: Number,
    timeOpen: {
        type: Date,
        default: new Date(),
      },
    timeOut: {
        type: Date,
        default: new Date(),
      },
    status: Boolean
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('Schedule', ScheduleSchema);
