import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import '../styles/Reports.css';
import { SyncService } from '../services/sync';

function Reports() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reports, setReports] = useState({ daily: [], monthly: {}, student: [] });
  const [activeReport, setActiveReport] = useState('daily');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await SyncService.getClasses();
        setClasses(data);
        if (data.length > 0) setSelectedClass(data[0].id);
      } catch (err) {
        setError('Failed to load classes');
        console.error(err);
      }
    };
    loadClasses();
  }, []);

  const normalizeDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).split('T')[0];
    return date.toISOString().split('T')[0];
  };

  const getAttendanceForRange = async (classId, rangeStart, rangeEnd) => {
    if (!classId || !rangeStart || !rangeEnd) return [];
    const start = normalizeDate(rangeStart);
    const end = normalizeDate(rangeEnd);
    const records = await SyncService.getAttendanceClassRecords(classId);
    return records.filter((record) => {
      const recordDate = normalizeDate(record.date);
      return recordDate >= start && recordDate <= end;
    });
  };

  useEffect(() => {
    setReports({ daily: [], monthly: {}, student: [] });
    setActiveReport('daily');
    setReportGenerated(false);
  }, [selectedClass, startDate, endDate]);

  const validateDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Please select valid start and end dates');
      return false;
    }
    if (start > end) {
      setError('Start date cannot be after end date');
      return false;
    }
    return true;
  };

  const generateDailyReport = async () => {
    if (!selectedClass) {
      setError('Please select a class to generate a report');
      return;
    }
    if (!validateDateRange()) return;
    setReportLoading(true);
    setError('');
    setActiveReport('daily');
    try {
      const records = await SyncService.getAttendanceClassRecords(selectedClass);
      const dailyRecords = records.filter((record) => normalizeDate(record.date) === normalizeDate(startDate));
      setReports((prev) => ({ ...prev, daily: dailyRecords }));
      setReportGenerated(true);
    } catch (err) {
      setError('Failed to generate daily report');
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const generateMonthlyReport = async () => {
    if (!selectedClass) {
      setError('Please select a class to generate a report');
      return;
    }
    if (!validateDateRange()) return;
    setReportLoading(true);
    setError('');
    setActiveReport('monthly');
    try {
      const records = await getAttendanceForRange(selectedClass, startDate, endDate);
      const grouped = records.reduce((acc, record) => {
        const dateKey = normalizeDate(record.date);
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(record);
        return acc;
      }, {});
      setReports((prev) => ({ ...prev, monthly: grouped }));
      setReportGenerated(true);
    } catch (err) {
      setError('Failed to generate monthly report');
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const generateStudentReport = async () => {
    if (!selectedClass) {
      setError('Please select a class to generate a report');
      return;
    }
    if (!validateDateRange()) return;
    setReportLoading(true);
    setError('');
    setActiveReport('student');
    try {
      const records = await getAttendanceForRange(selectedClass, startDate, endDate);
      const studentMap = {};
      records.forEach((r) => {
        const id = r.student_id;
        if (!studentMap[id]) {
          studentMap[id] = {
            studentId: id,
            studentName: r.student_name || 'Unknown',
            present: 0,
            absent: 0,
            late: 0,
            total: 0,
          };
        }
        studentMap[id][r.status] += 1;
        studentMap[id].total += 1;
      });
      setReports((prev) => ({ ...prev, student: Object.values(studentMap) }));
      setReportGenerated(true);
    } catch (err) {
      setError('Failed to generate student report');
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const createCsv = (rows, headers) => {
    const csvLines = [headers.join(',')];
    rows.forEach((row) => {
      csvLines.push(headers.map((header) => {
        const value = row[header] ?? '';
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(','));
    });
    return csvLines.join('\n');
  };

  const downloadFile = (content, fileName, type) => {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const downloadXlsx = (rows, headers, fileName) => {
    const sheetData = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet['!cols'] = headers.map((header) => ({ wch: Math.max(header.length + 12, 16) }));

    headers.forEach((header, index) => {
      const cellRef = XLSX.utils.encode_cell({ c: index, r: 0 });
      if (!worksheet[cellRef]) return;
      worksheet[cellRef].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4F81BD' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    const workbookOutput = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true,
    });
    const blob = new Blob([workbookOutput], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    downloadFile(blob, `${fileName}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };

  const downloadPdf = (rows, headers, fileName) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = pageWidth - margin * 2;
    const colWidth = tableWidth / Math.max(headers.length, 1);
    let y = margin;

    doc.setFillColor(52, 93, 168);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFontSize(16);
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.text(fileName.replace(/-/g, ' '), margin, 18);

    doc.setFontSize(10);
    doc.setTextColor('#ffffff');
    doc.text(`Generated: ${new Date().toISOString().split('T')[0]}`, margin, 26);

    y = 38;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    headers.forEach((header, index) => {
      const x = margin + index * colWidth;
      doc.setFillColor(217, 225, 242);
      doc.rect(x - 2, y - 8, colWidth, 12, 'F');
      doc.setTextColor('#000000');
      doc.text(String(header), x + 2, y);
    });

    y += 16;
    doc.setFont('helvetica', 'normal');
    rows.forEach((row, rowIndex) => {
      if (y > 280) {
        doc.addPage();
        y = margin;
      }
      const isOdd = rowIndex % 2 === 1;
      if (isOdd) {
        doc.setFillColor(245, 248, 252);
        doc.rect(margin - 2, y - 8, tableWidth + 4, 12, 'F');
      }
      headers.forEach((header, index) => {
        const x = margin + index * colWidth;
        const cellValue = String(row[header] ?? '');
        doc.setDrawColor(200, 200, 200);
        doc.rect(x - 2, y - 8, colWidth, 12);
        doc.text(cellValue, x + 2, y);
      });
      y += 14;
    });

    doc.save(`${fileName}.pdf`);
  };

  const formatStatusLabel = (status) => {
    if (status === 'late') return 'Leave';
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : '';
  };

  const exportCurrentReport = () => {
    let rows = [];
    let headers = [];
    let fileName = 'attendance-report';

    if (activeReport === 'daily') {
      rows = reports.daily.map((r) => ({
        Date: r.date,
        Student: r.student_name || 'Unknown',
        Status: formatStatusLabel(r.status),
      }));
      headers = ['Date', 'Student', 'Status'];
      fileName = `daily-report-${startDate}`;
    } else if (activeReport === 'monthly') {
      const groupedRows = Object.entries(reports.monthly).flatMap(([date, records]) =>
        records.map((r) => ({ Date: date, Student: r.student_name || 'Unknown', Status: formatStatusLabel(r.status) }))
      );
      rows = groupedRows;
      headers = ['Date', 'Student', 'Status'];
      fileName = `monthly-report-${startDate}-to-${endDate}`;
    } else {
      rows = reports.student.map((student) => ({
        Student: student.studentName,
        Present: student.present,
        Leave: student.late,
        Absent: student.absent,
        Total: student.total,
      }));
      headers = ['Student', 'Present', 'Leave', 'Absent', 'Total'];
      fileName = `student-report-${startDate}-to-${endDate}`;
    }

    return { rows, headers, fileName };
  };

  const canExportReport = () => {
    if (!reportGenerated) return false;
    if (activeReport === 'daily') return reports.daily.length > 0;
    if (activeReport === 'monthly') return Object.keys(reports.monthly).length > 0;
    if (activeReport === 'student') return reports.student.length > 0;
    return false;
  };

  const handleExportXlsx = () => {
    const { rows, headers, fileName } = exportCurrentReport();
    if (rows.length === 0) {
      setError('No report data to export');
      return;
    }
    downloadXlsx(rows, headers, fileName);
  };

  const handleExportPdf = () => {
    const { rows, headers, fileName } = exportCurrentReport();
    if (rows.length === 0) {
      setError('No report data to export');
      return;
    }
    downloadPdf(rows, headers, fileName);
  };

  const renderDailyTable = () => {
    if (!reports.daily.length) return <p className="no-data">No records found for this date.</p>;
    return (
      <table className="report-data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.daily.map((record) => (
            <tr key={`${record.id}-${record.student_id}`}>
              <td>{record.date}</td>
              <td>{record.student_name || 'Unknown'}</td>
              <td>{formatStatusLabel(record.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderMonthlyTable = () => {
    const dates = Object.keys(reports.monthly);
    if (!dates.length) return <p className="no-data">No records found in this range.</p>;
    return (
      <div className="monthly-report-grid">
        {dates.map((date) => (
          <div key={date} className="monthly-report-day">
            <h4>{date}</h4>
            <ul>
              {reports.monthly[date].map((record) => (
                <li key={`${record.id}-${record.student_id}`}>
                  {record.student_name || 'Unknown'} - {formatStatusLabel(record.status)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderStudentTable = () => {
    if (!reports.student.length) return <p className="no-data">No student data for this range.</p>;
    return (
      <table className="report-data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Present</th>
            <th>Leave</th>
            <th>Absent</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {reports.student.map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentName}</td>
              <td>{student.present}</td>
              <td>{student.late}</td>
              <td>{student.absent}</td>
              <td>{student.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <p className="reports-subtitle">Reporting dashboard for attendance by student</p>
      </div>

      <div className="report-filters">
        <select
          value={selectedClass || ''}
          onChange={(e) => setSelectedClass(parseInt(e.target.value, 10))}
          className="class-select"
        >
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="date-input"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-input"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="report-options">
        <button className="btn report-btn" onClick={generateDailyReport} disabled={reportLoading}>
          Generate Daily Report
        </button>
        <button className="btn report-btn" onClick={generateMonthlyReport} disabled={reportLoading}>
          Generate Monthly Report
        </button>
        <button className="btn report-btn" onClick={generateStudentReport} disabled={reportLoading}>
          Generate Student Report
        </button>
      </div>

      {canExportReport() && (
        <div className="report-export-options">
          <button className="btn export-btn" onClick={handleExportPdf} disabled={reportLoading}>
            Export PDF
          </button>
          <button className="btn export-btn" onClick={handleExportXlsx} disabled={reportLoading}>
            Export XLSX
          </button>
        </div>
      )}

      <div className="report-summary-cards">
        <div className="report-card">
          <h3>Daily Report</h3>
          <p>{reports.daily.length} records</p>
        </div>
        <div className="report-card">
          <h3>Monthly Report</h3>
          <p>{Object.keys(reports.monthly).length} days</p>
        </div>
        <div className="report-card">
          <h3>Student Report</h3>
          <p>{reports.student.length} students</p>
        </div>
      </div>

      <div className="report-data-section">
        {activeReport === 'daily' && renderDailyTable()}
        {activeReport === 'monthly' && renderMonthlyTable()}
        {activeReport === 'student' && renderStudentTable()}
      </div>
    </div>
  );
}

export default Reports;
