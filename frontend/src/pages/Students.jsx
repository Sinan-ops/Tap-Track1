import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Students.css';
import { useAuth } from '../contexts/AuthContext';
import { SyncService } from '../services/sync';

function Students() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc'); // Default sort by name ascending
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', rollNumber: '' });
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Load classes
  useEffect(() => {
    const loadClasses = async () => {
      if (!currentUser) return;
      try {
        const data = await SyncService.getClasses(currentUser.id);
        setClasses(data);
        const paramClassId = parseInt(searchParams.get('classId'), 10);
        if (paramClassId && data.some((cls) => cls.id === paramClassId)) {
          setSelectedClass(paramClassId);
        } else if (data.length > 0) {
          setSelectedClass(data[0].id);
        }
      } catch (err) {
        setError('Failed to load classes');
        console.error(err);
      }
    };

    loadClasses();
  }, [currentUser, searchParams]);

  // Load students for selected class
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClass) return;

      try {
        const data = await SyncService.getStudents(selectedClass);
        setStudents(data);
      } catch (err) {
        setError('Failed to load students');
        console.error(err);
      }
    };

    loadStudents();
  }, [selectedClass]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.rollNumber.trim()) {
      setError('Name and roll number are required');
      return;
    }
    if (!selectedClass) {
      setError('Please select a class');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const student = await SyncService.createStudent(
        newStudent.name,
        newStudent.rollNumber,
        selectedClass,
        currentUser.id
      );

      setStudents([...students, student]);
      setNewStudent({ name: '', rollNumber: '' });
    } catch (err) {
      setError('Failed to add student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await SyncService.deleteStudent(studentId);
      setStudents(students.filter((s) => s.id !== studentId));
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
    }
  };

  const getSortedStudents = () => {
    const sorted = [...students];

    switch (sortOrder) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'roll-asc':
        sorted.sort((a, b) => {
          const aNum = parseInt(a.roll_number) || 0;
          const bNum = parseInt(b.roll_number) || 0;
          return aNum - bNum;
        });
        break;
      case 'roll-desc':
        sorted.sort((a, b) => {
          const aNum = parseInt(a.roll_number) || 0;
          const bNum = parseInt(b.roll_number) || 0;
          return bNum - aNum;
        });
        break;
      default:
        break;
    }

    return sorted;
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student.id);
    setEditForm({ name: student.name, rollNumber: student.roll_number });
    setShowSortMenu(false);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim() || !editForm.rollNumber.trim()) {
      setError('Name and roll number are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updated = await SyncService.updateStudent(
        editingStudent,
        editForm.name,
        editForm.rollNumber
      );

      setStudents(
        students.map((s) => (s.id === editingStudent ? { ...s, ...updated } : s))
      );
      setEditingStudent(null);
      setEditForm({ name: '', rollNumber: '' });
    } catch (err) {
      setError('Failed to update student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditForm({ name: '', rollNumber: '' });
  };

  return (
    <div className="students-container">
      <div className="students-header">
        <p className="students-subtitle">Manage students and their roll numbers by class</p>
      </div>

      {classes.length === 0 ? (
        <p className="no-data">Create a class first to add students.</p>
      ) : (
        <>
          <div className="class-selector">
            <label htmlFor="class-select">Select Class:</label>
            <select
              id="class-select"
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(parseInt(e.target.value))}
              className="class-select"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="students-actions">
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
                  <button
                    type="button"
                    className={`sort-option ${sortOrder === 'roll-asc' ? 'active' : ''}`}
                    onClick={() => {
                      setSortOrder('roll-asc');
                      setShowSortMenu(false);
                    }}
                  >
                    Sort by Roll (Ascending)
                  </button>
                  <button
                    type="button"
                    className={`sort-option ${sortOrder === 'roll-desc' ? 'active' : ''}`}
                    onClick={() => {
                      setSortOrder('roll-desc');
                      setShowSortMenu(false);
                    }}
                  >
                    Sort by Roll (Descending)
                  </button>
                </div>
              )}
            </div>
          </div>

          {editingStudent && (
            <div className="edit-modal-overlay">
              <div className="edit-modal">
                <h2>Edit Student</h2>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Student name"
                  className="student-input"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={editForm.rollNumber}
                  onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
                  placeholder="Roll number"
                  className="student-input"
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
          <form onSubmit={handleAddStudent} className="student-form">
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="Student name"
              className="student-input"
              disabled={loading}
            />
            <input
              type="text"
              value={newStudent.rollNumber}
              onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
              placeholder="Roll number"
              className="student-input"
              disabled={loading}
            />
            <button type="submit" className="btn-add" disabled={loading}>
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <div className="students-list">
            {students.length === 0 ? (
              <p className="no-data">No students in this class yet.</p>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedStudents().map((student) => (
                    <tr key={student.id}>
                      <td>{student.roll_number}</td>
                      <td>{student.name}</td>
                      <td>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="btn-edit-small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="btn-delete-small"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Students;
