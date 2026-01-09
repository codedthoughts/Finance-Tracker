import React, { useState } from 'react';
import { TrendingUp, FolderOpen, ShoppingCart } from 'lucide-react';
import IncomeTracker from './IncomeTracker';
import Buckets from './Buckets';
import RecentTransactions from './RecentTransactions';
import styles from './FinanceTabs.module.css';

const FinanceTabs = () => {
  const [activeTab, setActiveTab] = useState('buckets');

  const tabs = [
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'buckets', label: 'Buckets', icon: FolderOpen },
    { id: 'expenses', label: 'Expenses', icon: ShoppingCart },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'income':
        return <IncomeTracker />;
      case 'buckets':
        return <Buckets />;
      case 'expenses':
        return <RecentTransactions />;
      default:
        return <IncomeTracker />;
    }
  };

  return (
    <div className={styles.financeTabs}>
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.contentArea}>
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default FinanceTabs;
