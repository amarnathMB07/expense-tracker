"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  X,
  Home,
  Coffee,
  ShoppingCart,
  Zap,
  MoreHorizontal,
  Power,
  Trash2
} from 'lucide-react';
import FluidBackground from '@/components/FluidBackground';
import ExpenseAnalytics from '@/components/ExpenseAnalytics';

const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: Coffee, color: 'bg-orange-500/20 text-orange-500' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingCart, color: 'bg-pink-500/20 text-pink-500' },
  { id: 'utilities', label: 'Utilities', icon: Zap, color: 'bg-blue-500/20 text-blue-500' },
  { id: 'housing', label: 'Housing', icon: Home, color: 'bg-indigo-500/20 text-indigo-500' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: 'bg-gray-500/20 text-gray-500' },
];

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fluidEnabled, setFluidEnabled] = useState(true);

  // Form State
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [category, setCategory] = useState('food');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Initial fetch
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/expenses');
        const json = await res.json();
        
        if (json.success && json.data) {
          setTransactions(json.data);
        } else {
          // Fallback to local storage if DB not configured
          const saved = localStorage.getItem('expense-tracker-data');
          if (saved) setTransactions(JSON.parse(saved));
        }
      } catch (err) {
        // Fallback to local storage
        const saved = localStorage.getItem('expense-tracker-data');
        if (saved) setTransactions(JSON.parse(saved));
      }
      setIsLoaded(true);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('expense-tracker-data', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !title) return;

    const newTransaction = {
      title,
      amount: parseFloat(amount),
      type,
      category: type === 'expense' ? category : 'income',
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      const json = await res.json();
      
      if (json.success) {
        setTransactions([json.data, ...transactions]);
      } else {
        // Fallback to local storage if DB fails
        newTransaction.id = Math.random().toString(36).substr(2, 9);
        setTransactions([newTransaction, ...transactions]);
      }
    } catch (err) {
      newTransaction.id = Math.random().toString(36).substr(2, 9);
      setTransactions([newTransaction, ...transactions]);
    }

    setAmount('');
    setTitle('');
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = async (id) => {
    if (!id) return;
    
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      
      if (json.success) {
        setTransactions(transactions.filter(t => (t._id || t.id) !== id));
      } else {
        // Fallback for local storage 
        setTransactions(transactions.filter(t => (t._id || t.id) !== id));
      }
    } catch (err) {
      setTransactions(transactions.filter(t => (t._id || t.id) !== id));
    }
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate daily expenses (today)
  const today = new Date().toDateString();
  const dailyExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === today)
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-indigo-500/30 relative">
      {/* Background Fluid Simulation */}
      {fluidEnabled && (
        <div className="fixed inset-0 z-0 opacity-50" aria-hidden="true">
          <FluidBackground />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Nexus Tracker
            </h1>
            <p className="text-neutral-400 mt-1">Manage your wealth intelligently</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFluidEnabled(!fluidEnabled)}
              aria-label={fluidEnabled ? "Disable Visual Effects" : "Enable Visual Effects"}
              title={fluidEnabled ? "Disable Visual Effects (Saves Battery)" : "Enable Visual Effects"}
              className={`p-2.5 rounded-full border transition-colors ${fluidEnabled ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-neutral-900 border-neutral-700 text-neutral-500'}`}
            >
              <Power size={20} />
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              aria-label="Add New Transaction"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Transaction</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard 
            title="Total Balance" 
            amount={totalBalance} 
            icon={<Wallet size={24} className="text-indigo-400" aria-hidden="true" />} 
            delay={0.1} 
            isBalance
          />
          <DashboardCard 
            title="Monthly Income" 
            amount={totalIncome} 
            icon={<TrendingUp size={24} className="text-emerald-400" aria-hidden="true" />} 
            delay={0.2} 
          />
          <DashboardCard 
            title="Total Expenses" 
            amount={totalExpenses} 
            icon={<TrendingDown size={24} className="text-rose-400" aria-hidden="true" />} 
            delay={0.3} 
          />
        </div>

        {/* Daily Summary & Analytics Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" aria-hidden="true" />
              Category Breakdown
            </h2>
            
            {/* New Recharts Analytics */}
            <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 p-4">
               <ExpenseAnalytics transactions={transactions} categories={CATEGORIES} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
               <div className="bg-black/40 backdrop-blur-2xl rounded-xl p-4 mb-4 border border-white/10">
                 <p className="text-neutral-400 text-sm mb-1">Spent Today</p>
                 <p className="text-2xl font-bold text-white">${dailyExpenses.toFixed(2)}</p>
               </div>
               <StatRow label="Total Transactions" value={transactions.length} />
               <StatRow label="Avg. Expense" value={`$${transactions.filter(t => t.type === 'expense').length > 0 ? (totalExpenses / transactions.filter(t => t.type === 'expense').length).toFixed(2) : '0.00'}`} />
               <StatRow label="Largest Expense" value={`$${Math.max(0, ...transactions.filter(t => t.type === 'expense').map(t => t.amount)).toFixed(2)}`} />
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
          </div>

          <div className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <ArrowRightLeft size={48} className="mx-auto mb-4 opacity-20" aria-hidden="true" />
                <p>No transactions yet. Start tracking!</p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-800/50" role="list">
                <AnimatePresence>
                  {transactions.slice(0, 10).map((t, index) => {
                    const categoryData = CATEGORIES.find(c => c.id === t.category) || CATEGORIES[4];
                    const Icon = t.type === 'income' ? TrendingUp : categoryData.icon;
                    
                    return (
                      <motion.li 
                        key={t._id || t.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 sm:p-6 hover:bg-white/5 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-500' : categoryData.color}`}>
                            <Icon size={20} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-medium text-lg">{t.title}</p>
                            <p className="text-sm text-neutral-400">
                              {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {t.type === 'income' ? 'Income' : categoryData.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`font-semibold text-lg ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                          </div>
                          <button 
                            onClick={() => handleDeleteTransaction(t._id || t.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                            title="Delete transaction"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </motion.div>

        {/* Add Transaction Modal */}
        <div className="pointer-events-auto">
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsModalOpen(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] w-full max-w-md relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                >
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close modal"
                    className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                  
                  <h3 className="text-2xl font-bold mb-6 text-white">New Transaction</h3>
                  
                  <form onSubmit={handleAddTransaction} className="space-y-5">
                    <div className="flex p-1 bg-black/50 backdrop-blur-md rounded-xl border border-white/5" role="group" aria-label="Transaction Type">
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'expense' ? 'bg-white/10 shadow text-white' : 'text-neutral-400 hover:text-white'}`}
                        onClick={() => setType('expense')}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'income' ? 'bg-white/10 shadow text-white' : 'text-neutral-400 hover:text-white'}`}
                        onClick={() => setType('income')}
                      >
                        Income
                      </button>
                    </div>

                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-neutral-300 mb-2">Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" aria-hidden="true">$</span>
                        <input 
                          id="amount"
                          type="number"
                          required
                          min="0.01"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                      <input 
                        id="title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3 px-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Groceries, Salary..."
                      />
                    </div>

                    {type === 'expense' && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Expense Category">
                          {CATEGORIES.map(cat => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategory(cat.id)}
                              className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${category === cat.id ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-black/30 border-white/10 text-neutral-400 hover:border-white/20'}`}
                            >
                              <cat.icon size={16} aria-hidden="true" />
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold mt-4 transition-colors"
                    >
                      Save {type === 'income' ? 'Income' : 'Expense'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
}

// Subcomponents
function DashboardCard({ title, amount, icon, delay, isBalance }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors ${isBalance ? 'ring-1 ring-indigo-500/30' : ''}`}
    >
      {isBalance && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" aria-hidden="true" />}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-neutral-400 text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-bold tracking-tight flex items-baseline gap-1 text-white">
          <span className="text-neutral-500 text-xl" aria-hidden="true">$</span>
          <span>{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-neutral-400 text-sm">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
