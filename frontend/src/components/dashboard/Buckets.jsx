import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen, Target } from 'lucide-react';
import { bucketAPI } from '../../services/api';
import styles from './Buckets.module.css';

const BucketCard = ({ bucket, onEdit, onDelete }) => {
  return (
    <div className={styles.bucketCard}>
      <div className={styles.bucketHeader}>
        <div className={styles.bucketInfo}>
          <div className={styles.bucketIcon}>
            <FolderOpen size={20} />
          </div>
          <div>
            <h4 className={styles.bucketName}>{bucket.bucketName}</h4>
            <p className={styles.bucketPurpose}>{bucket.purpose}</p>
          </div>
        </div>
        
        <div className={styles.bucketActions}>
          <button 
            onClick={() => onEdit(bucket)}
            className={styles.actionButton}
            title="Edit"
          >
            <Edit2 size={16} />
            <span className={styles.buttonText}>Edit</span>
          </button>
          <button 
            onClick={() => onDelete(bucket)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete"
          >
            <span className={styles.deleteText}>×</span>
          </button>
        </div>
      </div>

      <div className={styles.bucketStats}>
        <div className={styles.fundDisplay}>
          <span className={styles.fundLabel}>Bucket Fund</span>
          <span className={styles.fundAmount}>
            ₹{bucket.bucketFund.toLocaleString('en-IN')}
          </span>
        </div>
        <div className={styles.otherStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Current</span>
            <span className={styles.statValue}>
              ₹{bucket.currentMonthAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>
              ₹{(bucket.currentMonthAmount + bucket.bucketFund).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Money Used</span>
          <span className={styles.progressPercentage}>
            {Math.min((bucket.currentMonthAmount / (bucket.currentAllocationAmount || 1)) * 100, 100).toFixed(0)}%
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${Math.min((bucket.currentMonthAmount / (bucket.currentAllocationAmount || 1)) * 100, 100)}%` }}
          ></div>
        </div>
        <div className={styles.progressDetails}>
          <span>₹{bucket.currentMonthAmount.toLocaleString('en-IN')} / ₹{bucket.currentAllocationAmount.toLocaleString('en-IN')}</span>
          <span className={styles.percentageBadge}>{bucket.percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const Buckets = () => {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        setLoading(true);
        const data = await bucketAPI.getAll();
        setBuckets(data);
      } catch (err) {
        console.error('Failed to fetch buckets:', err);
        // Mock data for development
        setBuckets([
          {
            _id: '1',
            bucketName: 'Emergency Fund',
            percentage: 20,
            purpose: 'Emergency expenses',
            currentAllocationAmount: 10000,
            currentMonthAmount: 5000,
            bucketFund: 15000,
          },
          {
            _id: '2',
            bucketName: 'Vacation',
            percentage: 10,
            purpose: 'Travel and leisure',
            currentAllocationAmount: 5000,
            currentMonthAmount: 2500,
            bucketFund: 8000,
          },
          {
            _id: '3',
            bucketName: 'Investment',
            percentage: 30,
            purpose: 'Stock market investments',
            currentAllocationAmount: 15000,
            currentMonthAmount: 12000,
            bucketFund: 25000,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, []);

  const handleEdit = (bucket) => {
    setSelectedBucket(bucket);
    setShowEditModal(true);
  };

  const handleDelete = (bucket) => {
    // Create a custom alert
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const alertContent = `
      <div style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15); max-width: 400px; width: 90%;">
        <h3 style="margin: 0 0 16px 0; color: #DC2626; font-size: 18px; font-weight: 600;">Delete Bucket</h3>
        <p style="margin: 8px 0; color: #6B7280; line-height: 1.5;">Are you sure you want to delete "<strong>${bucket.bucketName}</strong>"?</p>
        <p style="margin: 8px 0; color: #6B7280; font-size: 14px;">This will release <strong>₹${(bucket.currentMonthAmount + bucket.bucketFund).toLocaleString('en-IN')}</strong> to general savings.</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
          <button id="cancelDelete" style="padding: 8px 16px; background: #6B7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">Cancel</button>
          <button id="confirmDelete" style="padding: 8px 16px; background: #DC2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">Delete</button>
        </div>
      </div>
    `;
    
    alertDiv.innerHTML = alertContent;
    document.body.appendChild(alertDiv);
    
    // Handle button clicks
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDelete');
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        alertDiv.remove();
      });
    }
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async () => {
        try {
          const bucketId = bucket._id;
          
          // Call the delete API
          await bucketAPI.deleteBucket(bucketId);
          
          // Update local state
          setBuckets(prev => prev.filter(b => b._id !== bucketId));
          
          // Remove the alert
          alertDiv.remove();
        } catch (error) {
          console.error('Delete error:', error);
          alertDiv.remove();
        }
      });
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    // Refresh buckets
    window.location.reload();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedBucket(null);
    // Refresh buckets
    window.location.reload();
  };

  if (loading) {
    return (
      <div className={styles.buckets}>
        <div className={styles.loadingState}>
          <div className={styles.loadingShimmer}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.buckets}>
      <div className={styles.header}>
        <h3 className={styles.title}></h3>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          New Bucket
        </button>
      </div>

      <div className={styles.bucketsList}>
        {buckets.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderOpen size={48} className={styles.emptyIcon} />
            <h4>No buckets yet</h4>
            <p>Create your first bucket to start organizing your finances</p>
            <button 
              className={styles.createButton}
              onClick={() => setShowAddModal(true)}
            >
              Create Bucket
            </button>
          </div>
        ) : (
          buckets.map(bucket => (
            <BucketCard
              key={bucket._id}
              bucket={bucket}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showAddModal && (
        <BucketModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {showEditModal && selectedBucket && (
        <BucketModal
          bucket={selectedBucket}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

const BucketModal = ({ bucket, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bucketName: bucket?.bucketName || '',
    percentage: bucket?.percentage || '',
    purpose: bucket?.purpose || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bucketName || !formData.percentage || !formData.purpose) {
      setError('All fields are required');
      return;
    }

    if (parseFloat(formData.percentage) <= 0 || parseFloat(formData.percentage) > 100) {
      setError('Percentage must be between 1 and 100');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (bucket) {
        await bucketAPI.updateBucket(bucket._id, formData);
      } else {
        await bucketAPI.addBucket(formData);
      }
      
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
          <h3>{bucket ? 'Edit Bucket' : 'Create Bucket'}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Bucket Name</label>
            <input
              type="text"
              name="bucketName"
              value={formData.bucketName}
              onChange={handleChange}
              placeholder="e.g., Emergency Fund"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Percentage (%)</label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              placeholder="e.g., 20"
              min="1"
              max="100"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Purpose</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Emergency expenses"
              required
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Saving...' : (bucket ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Buckets;
