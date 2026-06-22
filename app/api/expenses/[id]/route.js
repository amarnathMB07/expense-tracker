import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function DELETE(request, { params }) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ success: false, error: 'MongoDB connection not configured.' }, { status: 500 });
    }

    const { id } = params;
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return NextResponse.json({ success: false, error: 'Expense not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ success: false, error: 'MongoDB connection not configured.' }, { status: 500 });
    }

    const { id } = params;
    const body = await request.json();

    const expense = await Expense.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return NextResponse.json({ success: false, error: 'Expense not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
