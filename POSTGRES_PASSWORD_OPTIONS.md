# Instructions to Connect to PostgreSQL and Setup Tap-Track Database

## Option 1: Find Your PostgreSQL Password

When you installed PostgreSQL, you should have set a password for the `postgres` user. If you remember it:

```powershell
$env:PGPASSWORD = "YOUR_PASSWORD_HERE"
$pgPath = "C:\Program Files\PostgreSQL\18\bin"
$env:Path += ";$pgPath"

# Create database
psql -U postgres -h localhost -c "CREATE DATABASE IF NOT EXISTS tap_track;"

# Load schema
psql -U postgres -h localhost -d tap_track -f database/schema.sql

Write-Host "Database setup complete!" -ForegroundColor Green
```

Replace `YOUR_PASSWORD_HERE` with your actual postgres password.

---

## Option 2: Reset PostgreSQL Password (Windows Local)

If you don't remember the password, you can reset it:

1. Open Command Prompt (cmd) as **Administrator**
2. Stop PostgreSQL:
   ```cmd
   net stop postgresql-x64-18
   ```

3. Start PostgreSQL in recovery mode (with no-auth):
   ```cmd
   "C:\Program Files\PostgreSQL\18\bin\postgres.exe" --single -U postgres -d postgres
   ```

4. In psql terminal, run:
   ```sql
   ALTER USER postgres WITH PASSWORD 'password123';
   ```

5. Stop and restart normally:
   ```cmd
   net start postgresql-x64-18
   ```

6. Now use password `password123`:
   ```powershell
   $env:PGPASSWORD = "password123"
   ```

---

## Option 3: Use pgAdmin GUI

1. Open **pgAdmin 4** (search in Windows Start Menu)
2. Connect to your PostgreSQL server
3. Create new database: `tap_track`
4. Right-click on `tap_track` database → Query Tool
5. Copy-paste the contents of `database/schema.sql`
6. Execute the queries

---

## Option 4: Use PostgreSQL Default Trust Authentication

If you installed PostgreSQL with local socket authentication (no password):

```powershell
$pgPath = "C:\Program Files\PostgreSQL\18\bin"
$env:Path += ";$pgPath"

# Try without password
psql -U postgres -c "CREATE DATABASE IF NOT EXISTS tap_track;"
psql -U postgres -d tap_track -f database/schema.sql
```

---

**Once database is ready, run:**
```powershell
npm run install-all
npm run dev
```
