import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { incomeAPI } from '../../services/api';
import styles from './IncomeTracker.module.css';

const IncomeTracker = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        setLoading(true);
        const data = await incomeAPI.getHistory();
        setIncomeData(data);
      } catch (err) {
        console.error('Failed to fetch income:', err);
        // Mock data for development
        setIncomeData([
          { _id: '1', amount: 50000, type: 'Salary', date: '2026-01-01T00:00:00.000Z' },
          { _id: '2', amount: 5000, type: 'Manual', date: '2026-01-15T00:00:00.000Z' },
          { _id: '3', amount: 50000, type: 'Salary', date: '2025-12-01T00:00:00.000Z' },
          { _id: '4', amount: 3000, type: 'Manual', date: '2025-12-20T00:00:00.000Z' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  // Process data for chart
  const chartData = incomeData.reduce((acc, income) => {
    const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      existing.total += income.amount;
      if (income.type === 'Salary') {
        existing.salary += income.amount;
      } else {
        existing.manual += income.amount;
      }
    } else {
      acc.push({
        month,
        total: income.amount,
        salary: income.type === 'Salary' ? income.amount : 0,
        manual: income.type === 'Manual' ? income.amount : 0,
      });
    }
    
    return acc;
  }, []).slice(-6); // Last 6 months

  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
  const salaryIncome = incomeData.filter(i => i.type === 'Salary').reduce((sum, i) => sum + i.amount, 0);
  const manualIncome = incomeData.filter(i => i.type === 'Manual').reduce((sum, i) => sum + i.amount, 0);

  const toggleChart = () => {
    setIsChartExpanded(!isChartExpanded);
  };

  if (loading) {
    return (
      <div className={styles.incomeTracker}>
        <div className={styles.loadingState}>
          <div className={styles.loadingShimmer}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.incomeTracker}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}></h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total</span>
              <span className={styles.statValue}>₹{totalIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Salary</span>
              <span className={styles.statValue}>₹{salaryIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Manual</span>
              <span className={styles.statValue}>₹{manualIncome.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.chartToggle}
            onClick={toggleChart}
          >
            <ChevronDown size={20} className={isChartExpanded ? styles.rotated : ''} />
          </button>
          
          <button 
            className={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Add Income
          </button>
        </div>
      </div>

      <div className={`${styles.chartContainer} ${isChartExpanded ? styles.expanded : styles.collapsed}`}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)'
                }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
              />
              <Bar dataKey="salary" fill="#F79009" radius={[8, 8, 0, 0]} />
              <Bar dataKey="manual" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isChartExpanded && (
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#F79009' }}></div>
            <span>Salary Income</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#10B981' }}></div>
            <span>Manual Income</span>
          </div>
        </div>
      )}

      {showModal && (
        <AddIncomeModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            // Refresh data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

const AddIncomeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'Salary',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await incomeAPI.addIncome({
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formData.date,
      });
      
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
          <h3>Add Income</h3>
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
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Salary">Salary</option>
              <option value="Manual">Manual</option>
            </select>
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
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Adding...' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeTracker;
