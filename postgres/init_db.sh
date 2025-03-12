#!/bin/bash
set -e

DATA_DIR=$1
if [ -z "$DATA_DIR" ]; then
    echo "Usage: $0 <data_directory>"
    exit 1
fi

PORT=3005
TEMP_SQL_FILE="/tmp/init_commands.sql"

# Initialize PostgreSQL cluster if not exists
if [ ! -d "$DATA_DIR" ]; then
    initdb --username=abc -D "$DATA_DIR"
    # Ensure the PostgreSQL configuration and hba file are used
    cp "$(dirname "$0")/postgresql.conf" "$DATA_DIR/postgresql.conf"
    cp "$(dirname "$0")/pg_hba.conf" "$DATA_DIR/pg_hba.conf"
fi

# Start PostgreSQL if not already running
if ! pg_ctl -D "$DATA_DIR" status > /dev/null 2>&1; then
    pg_ctl -D "$DATA_DIR" -o "-p $PORT" -l "$DATA_DIR/postgres.log" start
else
    echo "PostgreSQL is already running."
fi

# Create SQL commands file
cat > "$TEMP_SQL_FILE" <<EOF
DO \$$
BEGIN
    CREATE USER abc WITH PASSWORD '12345';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'User already exists';
END
\$$;

SELECT 'CREATE DATABASE twogenders WITH OWNER abc'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'twogenders')\gexec

\c twogenders

BEGIN;
CREATE TABLE IF NOT EXISTS profile (
    key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS user_event (
    id SERIAL PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS user_event_visitor_id_idx ON user_event(visitor_id);
COMMIT;

-- Test record operations
DO \$$
DECLARE 
    test_key UUID;
    test_event_id INTEGER;
BEGIN
    INSERT INTO profile (data) VALUES ('{"test": "initial_data"}') RETURNING key INTO test_key;
    
    RAISE NOTICE 'Inserted profile record: %', (SELECT row_to_json(profile) FROM profile WHERE key = test_key);
    
    INSERT INTO user_event (visitor_id, data) 
    VALUES ('test_visitor_123', '{"action": "test_action", "details": {"test": true}}') 
    RETURNING id INTO test_event_id;
    
    RAISE NOTICE 'Inserted user_event record: %', (SELECT row_to_json(user_event) FROM user_event WHERE id = test_event_id);
    
    DELETE FROM profile WHERE key = test_key;
    DELETE FROM user_event WHERE id = test_event_id;
    
    RAISE NOTICE 'Deleted test records';
END
\$$;
EOF

# Execute SQL commands
psql -h localhost -p $PORT -U $USER postgres -f "$TEMP_SQL_FILE"

# Stop PostgreSQL
# pg_ctl -D "$DATA_DIR" stop

echo "Database initialized successfully in $DATA_DIR"
