import React from 'react';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
