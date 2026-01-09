import React from 'react';
import { Home, TrendingUp, FolderOpen, Settings, Search, Bell, User } from 'lucide-react';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: TrendingUp, label: 'Transactions', active: false },
    { icon: FolderOpen, label: 'Buckets', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>💰</div>
        </div>
        
        <nav className={styles.nav}>
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
              title={item.label}
            >
              <item.icon size={20} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.topBarActions}>
            <button className={styles.iconButton}>
              <Bell size={20} />
            </button>
            <button className={styles.iconButton}>
              <User size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
