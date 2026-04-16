import React, { useState, useEffect } from 'react';
import '../styles/Attendance.css';
import { useAuth } from '../contexts/AuthContext';
import { SyncService } from '../services/sync';

function Attendance() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({}); // object instead of Map for React compatibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // object instead of Map
  const [attendanceNote, setAttendanceNote] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Load classes
  useEffect(() => {
    const loadClasses = async () => {
      if (!currentUser) return;
      try {
        const data = await SyncService.getClasses(currentUser.id);
        setClasses(data);
        if (data.length > 0) {
          setSelectedClass(data[0].id);
        }
      } catch (err) {
        setError('Failed to load classes');
        console.error(err);
      }
    };

    loadClasses();
  }, [currentUser]);

  const loadAttendance = async (classId, dateValue) => {
    if (!classId || !dateValue) return;
    console.log(`Loading attendance for class ${classId}, date ${dateValue}`);
    setLoading(true);
    try {
      const studentData = await SyncService.getStudents(classId);
      setStudents(studentData);

      const records = await SyncService.getAttendanceRecords(classId, dateValue);
      console.log(`Loaded ${records.length} attendance records for ${dateValue}`);

      const statusObj = {};
      const recordObj = {};
      records.forEach((record) => {
        statusObj[record.student_id] = record.status;
        recordObj[record.student_id] = record.id;
      });
      setStatuses(statusObj);
      setAttendanceRecords(recordObj);
      setSubmitted(false);
      setError('');
    } catch (err) {
      setError('Failed to load attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedClass || !selectedDate) return;
    loadAttendance(selectedClass, selectedDate);
  }, [selectedClass, selectedDate]);

  useEffect(() => {
    if (!selectedClass || !selectedDate) {
      setAttendanceNote('');
      return;
    }
    const key = `attendanceNote:${selectedClass}:${selectedDate}`;
    setAttendanceNote(localStorage.getItem(key) || '');
  }, [selectedClass, selectedDate]);

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    setSubmitted(false);
    setCurrentMonth(new Date(date));

    // force reload attendance for the selected date even if it is already selected
    if (selectedClass) {
      await loadAttendance(selectedClass, date);
    }
  };

  const handleAttendanceNoteChange = (value) => {
    setAttendanceNote(value);
    if (selectedClass && selectedDate) {
      const key = `attendanceNote:${selectedClass}:${selectedDate}`;
      localStorage.setItem(key, value);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const day = currentDate.getDate();
      const isCurrentMonth = currentDate.getMonth() === month;
      const dateString = formatDate(currentDate);
      const isSelected = dateString === selectedDate;
      const isToday = dateString === formatDate(new Date());

      days.push({
        date: new Date(currentDate),
        day,
        isCurrentMonth,
        isSelected,
        isToday,
        dateString
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleStatusChange = async (studentId, status, currentRecords = null) => {
    console.log(`Marking student ${studentId} as ${status}`);
    
    // Use provided records if available (for bulk operations), otherwise use state
    const records = currentRecords !== null ? currentRecords : attendanceRecords;
    
    const newStatuses = { ...statuses };
    newStatuses[studentId] = status;
    setStatuses(newStatuses);

    try {
      const existingRecordId = records[studentId];
      if (existingRecordId) {
        console.log(`Updating existing record ${existingRecordId}`);
        await SyncService.updateAttendanceRecord(existingRecordId, status);
        console.log(`Record ${existingRecordId} updated successfully`);
      } else {
        console.log(`Creating new record for student ${studentId}, class ${selectedClass}, date ${selectedDate}`);
        const newRecord = await SyncService.createAttendanceRecord(
          selectedClass,
          studentId,
          selectedDate,
          status
        );
        const newRecordObj = { ...records };
        newRecordObj[studentId] = newRecord.id;
        setAttendanceRecords(newRecordObj);
        console.log(`Record created with ID: ${newRecord.id}`);
        return newRecordObj; // Return updated records for next iteration
      }
      return records;
    } catch (err) {
      console.error('Error updating attendance for student', studentId, ':', err.response?.data || err.message);
      setError(`Failed to mark student ${studentId}: ${err.response?.data?.error || err.message}`);
      const revertedStatuses = { ...statuses };
      delete revertedStatuses[studentId];
      setStatuses(revertedStatuses);
      throw err; // Throw so handleMarkAll knows there was an error
    }
  };

  // Wrapper for single radio button clicks (no params means use current state)
  const handleSingleStatusChange = (studentId, status) => {
    handleStatusChange(studentId, status).catch((err) => {
      console.error('Error in single status change:', err);
    });
  };

  const handleMarkAll = async (status) => {
    if (!students.length) {
      setError('No students loaded for marking.');
      return;
    }

    console.log(`Starting Mark All ${status} for ${students.length} students`);
    setLoading(true);
    setError('');

    try {
      let currentRecords = { ...attendanceRecords };
      let successCount = 0;
      let failCount = 0;
      let errors = [];

      for (const student of students) {
        try {
          console.log(`Processing student ${student.id}/${students.length}`);
          const updatedRecords = await handleStatusChange(student.id, status, currentRecords);
          if (updatedRecords) {
            currentRecords = updatedRecords;
          }
          successCount++;
        } catch (err) {
          console.error(`Failed to mark student ${student.id}:`, err);
          failCount++;
          errors.push(student.name);
        }
      }

      console.log(`Mark All complete: ${successCount} succeeded, ${failCount} failed`);

      // Update the record map with the final state
      if (Object.keys(currentRecords).length > successCount) {
        setAttendanceRecords(currentRecords);
      }

      // After all updates, reload to ensure data persists
      console.log('Reloading attendance data from database...');
      await loadAttendance(selectedClass, selectedDate);

      if (failCount > 0) {
        setError(`Marked ${successCount} students. ${failCount} failed: ${errors.join(', ')}`);
      } else {
        setError('');
      }
    } catch (err) {
      setError('Failed to mark students. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAttendance = async () => {
    setLoading(true);
    setError('');

    if (!selectedClass || !selectedDate) {
      setError('Select class and date before submitting attendance.');
      setLoading(false);
      return;
    }

    if (Object.keys(statuses).length === 0) {
      setError('Please mark at least one student as present or absent before submitting.');
      setLoading(false);
      return;
    }

    try {
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError('Failed to submit attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAttendance = () => {
    setSubmitted(false);
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

  const stats = getStats();

  function getStats() {
    const total = students.length;
    let present = 0;
    let absent = 0;
    let leave = 0;

    Object.values(statuses).forEach((status) => {
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') leave++;
    });

    return { total, present, absent, leave };
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <p className="attendance-subtitle">Manage daily attendance by class and date</p>
      </div>

      {classes.length === 0 ? (
        <p className="no-data">Create a class first to mark attendance.</p>
      ) : (
        <>
          <div className="attendance-controls">
            <div className="control-group">
              <label htmlFor="class-select">Class:</label>
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

            <div className="control-group">
              <label htmlFor="date-select">Date:</label>
              <div className="date-picker-container">
                <input
                  type="text"
                  id="date-select"
                  value={new Date(selectedDate).toLocaleDateString()}
                  onClick={handleDateClick}
                  readOnly
                  className="date-select"
                />
                <button
                  type="button"
                  onClick={handleDateClick}
                  className="calendar-btn"
                  title="Select date"
                >
                  📅
                </button>
                {showCalendar && (
                  <div className="calendar-popup">
                    <div className="calendar-header">
                      <button onClick={handlePrevMonth} className="calendar-nav-btn" aria-label="Previous month">‹</button>
                      <h3 className="calendar-month">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button onClick={handleNextMonth} className="calendar-nav-btn" aria-label="Next month">›</button>
                    </div>
                    <div className="calendar-subheader">
                      <button type="button" onClick={() => {
                        const today = new Date();
                        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                        setSelectedDate(formatDate(today));
                        setShowCalendar(false);
                        setSubmitted(false);
                      }} className="calendar-today-btn">Today</button>
                    </div>
                    <div className="calendar-grid">
                      <div className="calendar-day-header">Sun</div>
                      <div className="calendar-day-header">Mon</div>
                      <div className="calendar-day-header">Tue</div>
                      <div className="calendar-day-header">Wed</div>
                      <div className="calendar-day-header">Thu</div>
                      <div className="calendar-day-header">Fri</div>
                      <div className="calendar-day-header">Sat</div>
                      {calendarDays.map((day, index) => (
                        <div
                          key={index}
                          className={`calendar-day ${
                            day.isCurrentMonth ? 'current-month' : 'other-month'
                          } ${day.isSelected ? 'selected' : ''} ${day.isToday ? 'today' : ''}`}
                          onClick={() => day.isCurrentMonth && handleDateSelect(day.dateString)}
                        >
                          {day.day}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="control-group date-overview">
              <div className="date-overview-item">
                <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
              </div>
              <div className="date-overview-item">
                <strong>Attendance Status:</strong> {Object.keys(attendanceRecords).length > 0 ? 'Existing data loaded' : 'No records yet'}
              </div>
              <div className="date-overview-item">
                <strong>Note:</strong> {attendanceNote ? 'Saved' : 'Empty'}
              </div>
            </div>

            <div className="control-group">
              <div className="attendance-actions">
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
            </div>

            <div className="control-group">
              <div className="bulk-actions">
                <button
                  type="button"
                  onClick={() => loadAttendance(selectedClass, selectedDate)}
                  className="btn-refresh"
                  disabled={loading || !selectedClass}
                  title="Reload attendance data from database"
                >
                  Refresh Date
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="btn-bulk"
                  disabled={loading || students.length === 0}
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="btn-bulk"
                  disabled={loading || students.length === 0}
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            <div className="control-group">
              {!submitted ? (
                <button
                  onClick={handleSubmitAttendance}
                  disabled={loading || Object.keys(statuses).length === 0}
                  className="btn-submit"
                >
                  {loading ? 'Saving...' : (Object.keys(attendanceRecords).length > 0 ? 'Update Attendance' : 'Submit Attendance')}
                </button>
              ) : (
                <button
                  onClick={handleEditAttendance}
                  className="btn-edit"
                >
                  Edit Attendance
                </button>
              )}
            </div>
          </div>

          <div className="attendance-note">
            <label htmlFor="attendance-note-text">Attendance Note (saved locally per date):</label>
            <textarea
              id="attendance-note-text"
              value={attendanceNote}
              onChange={(e) => handleAttendanceNoteChange(e.target.value)}
              placeholder="Add context, weather, or reminder for this day's attendance"
              rows={3}
              className="attendance-note-textarea"
            />
          </div>

          <div className="attendance-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Students</div>
            </div>
            <div className="stat-card present">
              <div className="stat-value">{stats.present}</div>
              <div className="stat-label">Present</div>
            </div>
            <div className="stat-card absent">
              <div className="stat-value">{stats.absent}</div>
              <div className="stat-label">Absent</div>
            </div>
            <div className="stat-card late">
              <div className="stat-value">{stats.leave}</div>
              <div className="stat-label">Leave</div>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="attendance-table-container">
            {students.length === 0 ? (
              <p className="no-data">Add students to the class first.</p>
            ) : (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Roll No.</th>
                    <th>Student Name</th>
                    <th className="status-column">Present</th>
                    <th className="status-column">Absent</th>
                    <th className="status-column">Leave</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedStudents().map((student) => (
                    <tr key={student.id}>
                      <td>{student.roll_number}</td>
                      <td>{student.name}</td>
                      <td className="status-column">
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          value="present"
                          checked={statuses[student.id] === 'present'}
                          onChange={() => handleSingleStatusChange(student.id, 'present')}
                          disabled={loading}
                        />
                      </td>
                      <td className="status-column">
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          value="absent"
                          checked={statuses[student.id] === 'absent'}
                          onChange={() => handleSingleStatusChange(student.id, 'absent')}
                          disabled={loading}
                        />
                      </td>
                      <td className="status-column">
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          value="late"
                          checked={statuses[student.id] === 'late'}
                          onChange={() => handleSingleStatusChange(student.id, 'late')}
                          disabled={loading}
                        />
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

export default Attendance;
