-- Tap-Track Database Setup Script
-- This SQL file can be run via pgAdmin or psql

-- Create the tap_track database
DO $$ 
BEGIN
  CREATE DATABASE tap_track;
  RAISE NOTICE 'Database tap_track created successfully';
EXCEPTION WHEN DUPLICATE_DATABASE THEN
  RAISE NOTICE 'Database tap_track already exists';
END
$$;

-- Connect to the tap_track database and run the schema
-- (Note: You may need to run this as a separate command after connecting to tap_track)
