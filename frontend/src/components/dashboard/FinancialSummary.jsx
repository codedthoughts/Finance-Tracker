import React, { useState, useEffect } from 'react';
import { Wallet, Lock, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '../../services/api';
import styles from './FinancialSummary.module.css';

const StatCard = ({ title, value, icon: Icon, isHighlighted = false }) => {
  return (
    <div className={`${styles.statCard} ${isHighlighted ? styles.highlighted : ''}`}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <p className={styles.statValue}>
          ₹{value.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
    </div>
  );
};

const FinancialSummary = () => {
  const [summary, setSummary] = useState({
    netWorth: 0,
    generalSavings: 0,
    lockedFunds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getSummary();
        setSummary(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingShimmer}></div>
        </div>
        <div className={styles.loadingCard}>
          <div className={styles.loadingShimmer}></div>
        </div>
        <div className={styles.loadingCard}>
          <div className={styles.loadingShimmer}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Unable to load financial summary</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.financialSummary}>
      <StatCard
        title="Net Worth"
        value={summary.netWorth}
        icon={Wallet}
      />
      
      <StatCard
        title="General Savings"
        value={summary.generalSavings}
        icon={TrendingUp}
        isHighlighted={true}
      />
      
      <StatCard
        title="Locked Funds"
        value={summary.lockedFunds}
        icon={Lock}
      />
    </div>
  );
};

export default FinancialSummary;
