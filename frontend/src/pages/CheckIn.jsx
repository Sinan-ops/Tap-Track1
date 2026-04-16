import React, { useState } from 'react';
import '../styles/CheckIn.css';
import { recordCheckIn, recordCheckOut } from '../services/api';

function CheckIn() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [message, setMessage] = useState('');

  const handleCheckIn = async () => {
    try {
      const response = await recordCheckIn();
      setCheckInTime(new Date().toLocaleTimeString());
      setMessage('✓ Check-in recorded successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Error recording check-in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await recordCheckOut();
      setCheckOutTime(new Date().toLocaleTimeString());
      setMessage('✓ Check-out recorded successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Error recording check-out');
    }
  };

  return (
    <div className="checkin-container">
      <h1>Check In / Check Out</h1>
      
      <div className="checkin-cards">
        <div className="card">
          <h2>Check In</h2>
          <div className="time-display">
            {checkInTime ? (
              <>
                <p className="checked-in">✓ Checked In</p>
                <p className="time">{checkInTime}</p>
              </>
            ) : (
              <p className="not-checked">Not checked in</p>
            )}
          </div>
          <button onClick={handleCheckIn} className="btn btn-checkin">
            Check In Now
          </button>
        </div>

        <div className="card">
          <h2>Check Out</h2>
          <div className="time-display">
            {checkOutTime ? (
              <>
                <p className="checked-out">✓ Checked Out</p>
                <p className="time">{checkOutTime}</p>
              </>
            ) : (
              <p className="not-checked">Not checked out</p>
            )}
          </div>
          <button onClick={handleCheckOut} className="btn btn-checkout">
            Check Out Now
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default CheckIn;
