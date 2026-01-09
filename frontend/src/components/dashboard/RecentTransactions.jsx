import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Home, Car, Heart, Coffee, Briefcase, MoreHorizontal } from 'lucide-react';
import { expenseAPI, bucketAPI } from '../../services/api';
import styles from './RecentTransactions.module.css';

const categoryIcons = {
  'Shopping': ShoppingCart,
  'Home': Home,
  'Transport': Car,
  'Health': Heart,
  'Food': Coffee,
  'Work': Briefcase,
  'Other': MoreHorizontal,
};

const TransactionRow = ({ transaction, buckets, onDelete }) => {
  const getCategoryIcon = (note) => {
    const noteLower = note.toLowerCase();
    if (noteLower.includes('shop') || noteLower.includes('buy')) return ShoppingCart;
    if (noteLower.includes('home') || noteLower.includes('rent')) return Home;
    if (noteLower.includes('car') || noteLower.includes('transport')) return Car;
    if (noteLower.includes('health') || noteLower.includes('medical')) return Heart;
    if (noteLower.includes('food') || noteLower.includes('coffee')) return Coffee;
    if (noteLower.includes('work') || noteLower.includes('office')) return Briefcase;
    return MoreHorizontal;
  };

  const getCategoryName = (note) => {
    const noteLower = note.toLowerCase();
    if (noteLower.includes('shop') || noteLower.includes('buy')) return 'Shopping';
    if (noteLower.includes('home') || noteLower.includes('rent')) return 'Home';
    if (noteLower.includes('car') || noteLower.includes('transport')) return 'Transport';
    if (noteLower.includes('health') || noteLower.includes('medical')) return 'Health';
    if (noteLower.includes('food') || noteLower.includes('coffee')) return 'Food';
    if (noteLower.includes('work') || noteLower.includes('office')) return 'Work';
    return 'Other';
  };

  const Icon = getCategoryIcon(transaction.note || '');
  const categoryName = getCategoryName(transaction.note || '');
  const bucketName = transaction.type === 'Bucket' && transaction.bucketId 
    ? buckets.find(b => b._id === transaction.bucketId)?.bucketName 
    : null;

  return (
    <div className={styles.transactionRow}>
      <div className={styles.transactionLeft}>
        <div className={styles.categoryIcon}>
          <Icon size={20} />
        </div>
        <div className={styles.transactionInfo}>
          <div className={styles.transactionNote}>
            {transaction.note || 'No note'}
          </div>
          <div className={styles.transactionMeta}>
            <span className={styles.category}>{categoryName}</span>
            <span className={styles.date}>
              {new Date(transaction.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.transactionRight}>
        <div className={styles.transactionAmount}>
          -₹{transaction.amount.toLocaleString('en-IN')}
        </div>
        <div className={styles.transactionTag}>
          {bucketName || transaction.type}
        </div>
        <button 
          onClick={() => onDelete(transaction)}
          className={styles.deleteButton}
          title="Delete"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expensesData, bucketsData] = await Promise.all([
          expenseAPI.getHistory(),
          bucketAPI.getAll(),
        ]);
        
        setTransactions(expensesData.slice(0, 10)); // Show last 10 transactions
        setBuckets(bucketsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Mock data for development
        setTransactions([
          {
            _id: '1',
            amount: 1500,
            type: 'Manual',
            date: '2026-01-10T00:00:00.000Z',
            note: 'Grocery shopping'
          },
          {
            _id: '2',
            amount: 2000,
            type: 'Bucket',
            bucketId: '1',
            date: '2026-01-12T00:00:00.000Z',
            note: 'Emergency medical expense'
          },
          {
            _id: '3',
            amount: 800,
            type: 'Manual',
            date: '2026-01-08T00:00:00.000Z',
            note: 'Coffee and snacks'
          },
          {
            _id: '4',
            amount: 3500,
            type: 'Bucket',
            bucketId: '2',
            date: '2026-01-05T00:00:00.000Z',
            note: 'Vacation booking'
          },
        ]);
        setBuckets([
          {
            _id: '1',
            bucketName: 'Emergency Fund',
            percentage: 20,
            purpose: 'Emergency expenses',
          },
          {
            _id: '2',
            bucketName: 'Vacation',
            percentage: 10,
            purpose: 'Travel and leisure',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (transaction) => {
    if (window.confirm(`Delete this expense of ₹${transaction.amount.toLocaleString('en-IN')}?`)) {
      try {
        await expenseAPI.deleteExpense(transaction._id);
        setTransactions(prev => prev.filter(t => t._id !== transaction._id));
      } catch (err) {
        alert('Failed to delete expense: ' + err.message);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowModal(false);
    // Refresh transactions
    window.location.reload();
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className={styles.recentTransactions}>
        <div className={styles.loadingState}>
          <div className={styles.loadingShimmer}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recentTransactions}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}></h3>
          <div className={styles.totalExpenses}>
            Total: ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
        </div>
        
        <button 
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      <div className={styles.transactionsList}>
        {transactions.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingCart size={48} className={styles.emptyIcon} />
            <h4>No transactions yet</h4>
            <p>Start tracking your expenses to see them here</p>
            <button 
              className={styles.createButton}
              onClick={() => setShowModal(true)}
            >
              Add Expense
            </button>
          </div>
        ) : (
          transactions.map(transaction => (
            <TransactionRow
              key={transaction._id}
              transaction={transaction}
              buckets={buckets}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showModal && (
        <AddExpenseModal
          buckets={buckets}
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
};

const AddExpenseModal = ({ buckets, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'Manual',
    date: new Date().toISOString().split('T')[0],
    bucketId: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (formData.type === 'Bucket' && !formData.bucketId) {
      setError('Please select a bucket for bucket expenses');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payload = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formData.date,
        note: formData.note,
      };

      if (formData.type === 'Bucket') {
        payload.bucketId = formData.bucketId;
      }
      
      await expenseAPI.addExpense(payload);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Add Expense</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Type</label>
            <div className={styles.typeToggle}>
              <button
                type="button"
                className={`${styles.typeButton} ${formData.type === 'Manual' ? styles.active : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'Manual', bucketId: '' }))}
              >
                Manual
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${formData.type === 'Bucket' ? styles.active : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'Bucket' }))}
              >
                Bucket
              </button>
            </div>
          </div>
          
          {formData.type === 'Bucket' && (
            <div className={styles.formGroup}>
              <label>Select Bucket</label>
              <select name="bucketId" value={formData.bucketId} onChange={handleChange} required>
                <option value="">Choose a bucket...</option>
                {buckets.map(bucket => (
                  <option key={bucket._id} value={bucket._id}>
                    {bucket.bucketName} ({bucket.percentage}%)
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label>Note (Optional)</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="e.g., Grocery shopping"
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecentTransactions;
