import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Lock } from 'lucide-react';
import { dashboardAPI } from '../../services/api';
import styles from './FinancialSummary.module.css';

const StatCard = ({ title, value, icon: Icon, trend, isHighlighted = false }) => {
  const isPositive = trend > 0;
  
  return (
    <div className={`${styles.statCard} ${isHighlighted ? styles.highlighted : ''}`}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon}>
          <Icon size={24} />
        </div>
        {trend !== undefined && (
          <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
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
        // Mock data for development
        setSummary({
          netWorth: 85000,
          generalSavings: 15000,
          lockedFunds: 70000,
        });
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
        trend={12.5}
      />
      
      <StatCard
        title="General Savings"
        value={summary.generalSavings}
        icon={TrendingUp}
        trend={8.2}
        isHighlighted={true}
      />
      
      <StatCard
        title="Locked Funds"
        value={summary.lockedFunds}
        icon={Lock}
        trend={-2.1}
      />
    </div>
  );
};

export default FinancialSummary;
