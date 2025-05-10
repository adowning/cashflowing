-- Sequence for the event_log table


-- Create the event_log table if it doesn't exist
-- This table logs the details of each triggered event, including the full payload
DROP TABLE IF EXISTS event_log; -- Keep existing data if you don't drop
DROP SEQUENCE IF EXISTS event_log_seq;
CREATE SEQUENCE IF NOT EXISTS event_log_seq;
CREATE TABLE IF NOT EXISTS event_log (
    id BIGINT PRIMARY KEY DEFAULT nextval('event_log_seq'), -- Unique sequence number for the log entry
    table_name VARCHAR(255) NOT NULL, -- Name of the table where the change occurred
    row_id VARCHAR(255), -- ID of the row that was changed (nullable in case ID extraction fails or isn't applicable)
    operation VARCHAR(10) NOT NULL, -- Type of operation ('INSERT', 'UPDATE', 'DELETE')
    payload JSONB, -- Full JSONB representation of the changed row (NEW for INSERT/UPDATE, OLD for DELETE)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Timestamp of the event
);

-- Function to be executed by triggers after INSERT, UPDATE, or DELETE operations
-- This function logs the event and sends a notification with the changed data
CREATE OR REPLACE FUNCTION notify_your_channel_event()
RETURNS TRIGGER AS $$
DECLARE
    row_data JSONB; -- Variable to hold the JSONB representation of the row data
    notification_payload TEXT; -- Variable to hold the JSON string payload for NOTIFY
    event_id BIGINT; -- Variable to hold the ID of the newly created event_log entry
    -- Variable to hold the row ID as text, handling potential nulls or non-text IDs
    v_row_id TEXT;
BEGIN
    -- Determine the operation type and get the corresponding row data
    -- Since triggers are now only AFTER UPDATE, row_data will always be NEW
    -- but keeping the IF for clarity or if you re-add other operations later
    IF (TG_OP = 'DELETE') THEN
        row_data = to_jsonb(OLD); -- For DELETE, use the old row data
    ELSE
        row_data = to_jsonb(NEW); -- For INSERT/UPDATE, use the new row data
    END IF;

    -- Attempt to extract the 'id' from the row_data JSONB.
    -- Use a default or handle cases where 'id' might not be present or is not a simple scalar.
    -- Assuming 'id' is a common primary key name and can be represented as text.
    -- Adjust 'id' extraction logic if your primary keys have different names or types.
    BEGIN
        v_row_id = row_data->>'id'; -- Extract 'id' as text
        -- If 'id' is null or not found, you might want to log a warning or use a placeholder
        IF v_row_id IS NULL THEN
            -- Attempt to use a different common ID field if 'id' is not present, e.g., 'uuid'
            v_row_id = row_data->>'uuid'; -- Example: try 'uuid' if 'id' is null
             IF v_row_id IS NULL THEN
                 -- Fallback if no common ID field is found
                 v_row_id = 'N/A'; -- Or log a warning
             END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Handle potential errors during ID extraction (e.g., if 'id' is not a scalar type)
        v_row_id = 'Extraction Error: ' || SQLSTATE;
        -- Consider logging the full error details in a separate log
    END;


    -- Log the event in the event_log table
    INSERT INTO event_log (table_name, row_id, operation, payload)
    VALUES (TG_TABLE_NAME, v_row_id, TG_OP, row_data)
    RETURNING id INTO event_id; -- Get the generated event log ID

    -- Construct the notification payload as a JSON string
    -- Include the event_id, table name, operation, row ID, AND the full row data (payload)
    notification_payload = json_build_object(
        'event_id', event_id, -- The ID of the log entry for this event
        'table', TG_TABLE_NAME, -- The name of the table that was changed
        'operation', TG_OP, -- The type of operation ('INSERT', 'UPDATE', 'DELETE')
        'row_id', v_row_id, -- The ID of the row that was changed
        'data', row_data -- ** Include the full row data here **
    )::TEXT; -- Cast the JSONB object to TEXT for the NOTIFY payload

    -- Send the notification to the specified channel
    -- 'stats_updates' is the channel the listener should be subscribed to.
    PERFORM pg_notify('stats_updates', notification_payload);

    -- Return the appropriate row based on the operation
    -- Since triggers are now only AFTER UPDATE, we always return NEW
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD; -- For DELETE, return the old row (this branch won't be hit by the triggers below)
    ELSE
        RETURN NEW; -- For INSERT/UPDATE, return the new row
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers on specific tables to fire the notify_your_channel_event function
-- These triggers will now only fire AFTER UPDATE operations on their respective tables

-- Trigger for the "user" table - Only fires AFTER UPDATE
CREATE OR REPLACE TRIGGER user_notify_trigger
AFTER UPDATE ON "user"
FOR EACH ROW EXECUTE FUNCTION notify_your_channel_event();

-- Trigger for the "Profile" table - Only fires AFTER UPDATE
CREATE OR REPLACE TRIGGER profile_notify_trigger
AFTER UPDATE ON "Profile"
FOR EACH ROW EXECUTE FUNCTION notify_your_channel_event();

-- Add triggers for other tables you want to monitor for UPDATE events, e.g.:
/*
CREATE OR REPLACE TRIGGER transaction_notify_trigger
AFTER UPDATE ON "transaction"
FOR EACH ROW EXECUTE FUNCTION notify_your_channel_event();

CREATE OR REPLACE TRIGGER gamesession_notify_trigger
AFTER UPDATE ON "gamesession"
FOR EACH ROW EXECUTE FUNCTION notify_your_channel_event();
*/
