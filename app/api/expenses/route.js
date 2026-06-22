import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ success: false, error: 'MongoDB connection not configured.' }, { status: 500 });
    }

    const expenses = await Expense.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ success: false, error: 'MongoDB connection not configured.' }, { status: 500 });
    }

    const body = await request.json();
    const expense = await Expense.create(body);
    
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
