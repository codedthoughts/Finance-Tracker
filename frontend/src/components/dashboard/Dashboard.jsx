import React from 'react';
import FinancialSummary from './FinancialSummary';
import IncomeTracker from './IncomeTracker';
import Buckets from './Buckets';
import RecentTransactions from './RecentTransactions';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      {/* Section A: Money Stats (Top Row) */}
      <section className={styles.moneyStats}>
        <FinancialSummary />
      </section>

      {/* Section B: Income & Buckets (Middle Row) */}
      <section className={styles.incomeBuckets}>
        <div className={styles.incomeSection}>
          <IncomeTracker />
        </div>
        <div className={styles.bucketsSection}>
          <Buckets />
        </div>
      </section>

      {/* Section C: Expenses & Activity (Bottom Row) */}
      <section className={styles.expensesSection}>
        <RecentTransactions />
      </section>
    </div>
  );
};

export default Dashboard;
