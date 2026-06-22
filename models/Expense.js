import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this transaction.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount.'],
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
