CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	email VARCHAR PRIMARY KEY,
    -- don't need this rn
	-- name VARCHAR,
    api_key UUID UNIQUE DEFAULT uuid_generate_v4 (),
	permissions JSONB
);

    -- email - string, 
    -- name - string, 
    -- permissions - object / json, (is_admin or isAdmin, isFriend, isPaid, etc)
    -- api-key: string