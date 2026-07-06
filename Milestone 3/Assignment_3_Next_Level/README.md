# Query.sql README

## Overview

This workspace contains a single SQL script, `QUERY.sql`, for a football ticket booking system. The script is written in PostgreSQL style and combines three parts:

1. Table setup for `Users`, `Matches`, and `Bookings`.
2. Sample data inserts for each table.
3. Example SELECT queries that demonstrate filtering, joins, subqueries, aggregation, and sorting.

The file appears to be a learning or assignment template, so some comments in the DDL remind you to complete or adjust constraints as needed.

## Files

- `QUERY.sql` - schema, seed data, and example queries.
- `ERD.png` - diagram of the database structure.

## Database Model

### Users

Stores people who can use the system.

Important fields:

- `user_id` - primary key.
- `full_name` - user name.
- `email` - unique email address.
- `role` - restricted to `Ticket Manager` or `Football Fan`.
- `phone_number` - optional contact number.

### Matches

Stores football match listings.

Important fields:

- `match_id` - primary key.
- `fixture` - match pairing.
- `tournament_category` - competition name.
- `base_ticket_price` - must be non-negative.
- `match_status` - restricted to predefined status values.

### Bookings

Stores ticket bookings made by users.

Important fields:

- `booking_id` - primary key.
- `user_id` - foreign key referencing `Users`.
- `match_id` - foreign key referencing `Matches`.
- `seat_number` - optional seat label.
- `payment_status` - restricted to predefined payment states.
- `total_cost` - must be non-negative.

Both foreign keys use cascading deletes, so removing a user or match also removes dependent bookings.

## Sample Data

The script inserts example rows for:

- 4 users
- 5 matches
- 5 bookings

These rows are useful for testing joins and filters immediately after running the script.

## Example Queries Included

The bottom section of `QUERY.sql` contains seven sample queries:

1. Champions League matches that are currently available.
2. Users whose names start with Tanvir or contain Haque.
3. Bookings with missing payment status, showing Action Required instead.
4. Booking details joined with user and match information.
5. All users with any booking IDs, including users without bookings.
6. Bookings above the average booking cost.
7. The second and third most expensive matches by ticket price.

## Query Explanations

### Query 1

This query finds matches where the tournament category is `Champions League` and the match is marked `Available`. It uses a basic `WHERE` filter to narrow the result set to a specific competition and status.

Expected result: a list of available Champions League matches with their IDs, fixture names, and rounded ticket prices.

### Query 2

This query searches for users whose names either start with `Tanvir` or contain `Haque` anywhere in the name. It uses `ILIKE`, which performs a case-insensitive pattern match in PostgreSQL.

Expected result: matching users such as Tanvir Rahman and Asif Haque.

### Query 3

This query returns bookings where `payment_status` is `NULL`. It uses `COALESCE` to replace missing values with `Action Required`, which makes the output easier to read and highlights records that still need attention.

Expected result: bookings that have not yet been assigned a payment status.

### Query 4

This query joins `Bookings`, `Users`, and `Matches` so you can see who made each booking, which match was booked, and the total cost. It uses `INNER JOIN`, so only bookings with matching user and match records are returned.

Expected result: a combined booking report with booking ID, user name, fixture, and total cost.

### Query 5

This query lists all users and any booking IDs they have. It uses `LEFT JOIN` so users with no bookings still appear in the result with a `NULL` booking ID.

Expected result: a full user list, including fans who have not booked any ticket yet.

### Query 6

This query finds bookings whose `total_cost` is greater than the average booking cost. The subquery calculates the average, and the outer query compares each booking against that value.

Expected result: only the more expensive bookings, filtered above the overall average.

### Query 7

This query sorts matches by `base_ticket_price` in descending order, skips the highest-priced match using `OFFSET 1`, and then returns the next two rows using `LIMIT 2`.

Expected result: the second and third most expensive matches in the dataset.

## How To Run

Use a PostgreSQL database and execute the script in this order:

1. Open your SQL client or terminal connected to PostgreSQL.
2. Run `QUERY.sql` to create the tables.
3. Insert the sample data.
4. Run the example queries to verify the results.

If your database already contains tables with the same names, the script drops them first to avoid conflicts.

## Notes

- The script currently uses PostgreSQL-specific syntax such as `serial`, `ILIKE`, and `COALESCE`.
- Some comments in the DDL still reference placeholder work, so you may want to refine the constraint definitions if this is meant for submission.
- The sample inserts use explicit IDs, which is fine for a seeded demo but may need adjustment in a production setup.

## Expected Output

After running the script successfully, you should have:

- Three populated tables.
- Foreign key relationships between bookings, users, and matches.
- A set of ready-made queries you can run for testing or demonstration.
