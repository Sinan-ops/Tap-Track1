import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Classes.css';
import { useAuth } from '../contexts/AuthContext';
import { SyncService } from '../services/sync';

function Classes() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({ name: '' });
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Load classes from database
  useEffect(() => {
    const loadClasses = async () => {
      if (!currentUser) return;
      try {
        const data = await SyncService.getClasses(currentUser.id);
        setClasses(data);
      } catch (err) {
        setError('Failed to load classes');
        console.error(err);
      }
    };

    loadClasses();
  }, [currentUser]);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to create a class');
      return;
    }

    if (!newClassName.trim()) {
      setError('Class name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newClass = await SyncService.createClass(newClassName, currentUser.id);
      setClasses([...classes, newClass]);
      setNewClassName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create class. Please try again.');
      console.error('Error creating class:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      await SyncService.deleteClass(classId);
      setClasses(classes.filter((c) => c.id !== classId));
    } catch (err) {
      setError('Failed to delete class');
      console.error(err);
    }
  };

  const getSortedClasses = () => {
    const sorted = [...classes];

    switch (sortOrder) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return sorted;
  };

  const handleEditClass = (cls) => {
    setEditingClass(cls.id);
    setEditForm({ name: cls.name });
    setShowSortMenu(false);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) {
      setError('Class name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updated = await SyncService.updateClass(editingClass, editForm.name);
      setClasses(
        classes.map((c) => (c.id === editingClass ? { ...c, ...updated } : c))
      );
      setEditingClass(null);
      setEditForm({ name: '' });
    } catch (err) {
      setError('Failed to update class');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingClass(null);
    setEditForm({ name: '' });
  };

  return (
    <div className="classes-container">
      <div className="classes-header">
        <p className="classes-subtitle">Create and manage classes across your institution</p>
      </div>

      <div className="classes-actions">
        <div className="sort-menu-container">
          <button
            type="button"
            className="btn-sort"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            📊 Sort
          </button>
          {showSortMenu && (
            <div className="sort-menu-dropdown">
              <button
                type="button"
                className={`sort-option ${sortOrder === 'name-asc' ? 'active' : ''}`}
                onClick={() => {
                  setSortOrder('name-asc');
                  setShowSortMenu(false);
                }}
              >
                Sort by Name (A-Z)
              </button>
              <button
                type="button"
                className={`sort-option ${sortOrder === 'name-desc' ? 'active' : ''}`}
                onClick={() => {
                  setSortOrder('name-desc');
                  setShowSortMenu(false);
                }}
              >
                Sort by Name (Z-A)
              </button>
            </div>
          )}
        </div>
      </div>

      {editingClass && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>Edit Class</h2>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ name: e.target.value })}
              placeholder="Class name"
              className="class-input-modal"
              disabled={loading}
            />
            <div className="modal-actions">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleCreateClass} className="class-form">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Enter class name (e.g., Class 10-A)"
          className="class-input"
          disabled={loading || !currentUser}
        />
        <button type="submit" className="btn-add" disabled={loading || !currentUser}>
          {loading ? 'Adding...' : 'Add Class'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="classes-grid">
        {classes.length === 0 ? (
          <p className="no-data">No classes yet. Create one to get started!</p>
        ) : (
          getSortedClasses().map((cls) => (
            <div key={cls.id} className="class-card">
              <div className="class-card-header">
                <h3>{cls.name}</h3>
                <div className="class-card-actions">
                  <button
                    onClick={() => handleEditClass(cls)}
                    className="btn-edit-class"
                    title="Edit class"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="btn-delete"
                    title="Delete class"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="class-card-footer">
                <button
                  className="btn-view"
                  onClick={() => navigate(`/students?classId=${cls.id}`)}
                  title="View this class in Students"
                >
                  View Students
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Classes;
