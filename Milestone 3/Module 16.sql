--------------------------------------------------------------------------------
-- SECTION 1: SCHEMA CREATION (Tables & Relationships)
-- Purpose: Defines the structure of our HR database.
-- Questions answered: "What is the schema?" / "How are employees linked to departments?"
--------------------------------------------------------------------------------

CREATE TABLE departments (
  department_id serial PRIMARY KEY,
  department_name varchar(50)
);

CREATE TABLE employees (
  employee_id serial PRIMARY KEY,
  employee_name varchar(50),
  department_id int REFERENCES departments (department_id), -- Foreign key link
  salary decimal(10, 2),
  hire_date date
);


--------------------------------------------------------------------------------
-- SECTION 2: SEEDING DATA (Inserting sample records)
-- Purpose: Populates tables with realistic HR data for testing queries.
--------------------------------------------------------------------------------

INSERT INTO departments (department_name) VALUES
  ('Human Resources'), ('Finance'), ('Information Technology'), ('Marketing'),
  ('Sales'), ('Operations'), ('Customer Support'), ('Research & Development');

INSERT INTO employees (employee_name, department_id, salary, hire_date) VALUES
  ('John Smith', 1, 45000.00, '2022-01-15'),
  ('Emma Johnson', 2, 58000.00, '2021-03-22'),
  ('Michael Brown', 3, 72000.00, '2020-07-10'),
  ('Olivia Davis', 4, 51000.00, '2023-02-05'),
  ('William Miller', 5, 49000.00, '2021-11-18'),
  ('Sophia Wilson', 6, 61000.00, '2019-09-25'),
  ('James Moore', 7, 43000.00, '2022-05-30'),
  ('Isabella Taylor', 8, 80000.00, '2018-12-12'),
  ('Benjamin Anderson', 3, 76000.00, '2020-06-08'),
  ('Mia Thomas', 1, 47000.00, '2023-04-20'),
  ('Lucas Jackson', 2, 56000.00, '2021-08-15'),
  ('Charlotte White', 5, 53000.00, '2022-10-10'),
  ('Henry Harris', 4, 52000.00, '2020-01-17'),
  ('Amelia Martin', 6, 64000.00, '2019-05-14'),
  ('Alexander Thompson', 8, 91000.00, '2017-03-01'),
  ('Evelyn Garcia', 7, 42000.00, '2023-06-11'),
  ('Daniel Martinez', 3, 69000.00, '2020-11-19'),
  ('Harper Robinson', 5, 55000.00, '2022-07-09'),
  ('Matthew Clark', 2, 60000.00, '2021-02-28'),
  ('Abigail Rodriguez', 1, 46000.00, '2023-01-23'),
  ('Joseph Lewis', 6, 67000.00, '2019-10-06'),
  ('Ella Lee', 4, 50000.00, '2022-08-14'),
  ('David Walker', 3, 74000.00, '2018-04-18'),
  ('Scarlett Hall', 7, 41000.00, '2023-09-02'),
  ('Christopher Allen', 8, 95000.00, '2016-06-20'),
  ('Grace Young', 5, 54000.00, '2021-12-07'),
  ('Andrew King', 2, 59000.00, '2020-09-13'),
  ('Lily Wright', 6, 65000.00, '2019-01-29'),
  ('Joshua Scott', 3, 78000.00, '2018-08-24'),
  ('Chloe Green', 4, 52000.00, '2022-11-16');


--------------------------------------------------------------------------------
-- SECTION 3: BASIC JOIN & GROUP BY QUERIES (Reporting)
-- Purpose: Standard HR reporting queries combining both tables.
-- Questions answered: "Show all employee details with their department names."
-- NOTE: There is a TYPO here: 'department_id4' should be 'department_id'.
-- If you run this as-is, you will get an error (column "department_id4" does not exist).
--------------------------------------------------------------------------------

-- Query 1: Attempts to list every employee with their full department info.
-- FIX: Change 'department_id4' to 'department_id' on the ON clause.
-- Question answered: "Can I see a full list of employees with their department names?"
SELECT *
FROM employees AS e
INNER JOIN departments AS d ON d.department_id = e.department_id; -- <-- SYNTAX ERROR HERE (typo)

-- Query 2: Calculates the average salary per department (rounded to whole number).
-- Question answered: "What is the average salary for each department?"
SELECT
  d.department_name,
  round(avg(salary)) AS "Average Salary"
FROM employees AS e
JOIN departments AS d ON e.department_id = d.department_id
GROUP BY d.department_name;

-- Query 3: Counts the total number of employees in each department.
-- Question answered: "How many people work in each department? (Headcount)"
SELECT
  d.department_name,
  count(*)
FROM employees AS e
JOIN departments AS d ON d.department_id = e.department_id
GROUP BY d.department_name;

-- Query 4: Finds the department with the highest average salary.
-- Question answered: "Which department pays the best on average?"
SELECT
  d.department_name,
  round(avg(salary)) AS "Average Salary"
FROM employees AS e
JOIN departments AS d ON d.department_id = e.department_id
GROUP BY d.department_name
ORDER BY "Average Salary" DESC
LIMIT 1;

-- Query 5: Groups employees by the year they were hired.
-- Question answered: "What are the hiring trends year over year?"
SELECT
  extract(YEAR FROM hire_date) AS "Year",
  count(*) AS "Employee Count"
FROM employees AS e
JOIN departments AS d ON d.department_id = e.department_id
GROUP BY "Year"
ORDER BY "Year";


--------------------------------------------------------------------------------
-- SECTION 4: SUBQUERIES (Simplified `employee` table)
-- Purpose: Demonstrates how to use nested queries for dynamic filtering.
-- Questions answered: "Who is the top earner?" / "Who is above average?"
--------------------------------------------------------------------------------

-- Creating a simpler, flattened employee table for subquery practice.
CREATE TABLE employee (
  id serial PRIMARY KEY,
  name varchar(50),
  department varchar(50),
  salary int
);

INSERT INTO employee (name, department, salary) VALUES
  ('John Smith', 'Human Resources', 45000),
  ('Emma Johnson', 'Finance', 58000),
  ('Michael Brown', 'Information Technology', 72000),
  ('Olivia Davis', 'Marketing', 51000),
  ('William Miller', 'Sales', 49000),
  ('Sophia Wilson', 'Operations', 61000),
  ('James Moore', 'Customer Support', 43000),
  ('Isabella Taylor', 'Research & Development', 80000),
  ('Benjamin Anderson', 'Information Technology', 76000),
  ('Mia Thomas', 'Finance', 55000);

-- Query 6: Finds the highest salary overall.
-- Question answered: "What is the maximum salary in the entire company?"
SELECT max(salary) FROM employee;

-- Query 7: Finds the employee(s) who earn exactly the highest salary.
-- Question answered: "Which specific employee(s) are the top earners?"
SELECT *
FROM employee
WHERE salary = (SELECT max(salary) FROM employee);

-- Query 8: Finds employees who earn more than the company-wide average.
-- Question answered: "Who is earning above the company average?"
SELECT *
FROM employee
WHERE salary > (SELECT avg(salary) FROM employee);

-- Query 9: Finds the highest-paid employee specifically in Human Resources.
-- Question answered: "Who is the top earner exclusively within the HR department?"
SELECT *
FROM employee
WHERE salary = (SELECT max(salary) FROM employee WHERE department = 'Human Resources');


--------------------------------------------------------------------------------
-- SECTION 5: FUNCTIONS (Reusable logic returning a single value)
-- Purpose: Encapsulates repeated logic into a callable function.
-- Questions answered: "How many total employees are there?" (via function call).
--------------------------------------------------------------------------------

-- Query 10: Basic count.
SELECT count(*) FROM employee;

-- Function 1: Returns the total employee count when called.
-- Question answered: "What is the total headcount?" (Encapsulated in a function).
CREATE FUNCTION emp_count () returns int language sql AS $$
  select count(*) from employee;
$$;
SELECT emp_count (); -- Calling the function


--------------------------------------------------------------------------------
-- SECTION 6: FUNCTIONS WITH PARAMETERS (Deleting data)
-- Purpose: Creates a reusable function to delete an employee by their ID.
-- Questions answered: "Can I delete employee ID X using a custom function?"
--------------------------------------------------------------------------------

-- This delete will remove the employee with ID 1.
DELETE FROM employee WHERE id = 1;

-- Function 2: Deletes an employee based on the provided ID.
CREATE FUNCTION delete_emp_id (emp_id int) returns void language sql AS $$
  delete from employee where id = emp_id;
$$;
SELECT delete_emp_id (2); -- Calling the function to delete employee ID 2.


--------------------------------------------------------------------------------
-- SECTION 7: STORED PROCEDURES (Business logic with transactions)
-- Purpose: Procedures perform more complex operations, often without returning a value.
-- Questions answered: "How to mass-delete an ID?" / "How to give raises to underpaid staff?"
--------------------------------------------------------------------------------

-- Procedure 1: Deletes an employee by ID (similar to function above, but uses PL/pgSQL).
CREATE PROCEDURE delete_emp_by_id (emp_id int) language plpgsql AS $$
  begin
    delete from employee where id = emp_id;
  end;
$$;
CALL delete_emp_by_id (6); -- Calling the procedure.

-- Procedure 2: Gives a 10% raise to employees in a specific department
-- who are earning BELOW the average salary for THAT department.
-- Business logic: Brings low earners closer to their team's average.
-- Question answered: "How do I automatically raise the salaries of underperforming/underpaid staff in a specific department?"
CREATE PROCEDURE increase_low_salary (department_name varchar(50)) language plpgsql AS $$
  declare 
    avg_salary int;
  begin
    -- Step 1: Calculate the average salary for the given department.
    select avg(salary) into avg_salary from employee
    where department = department_name;

    -- Step 2: Increase salary by 10% for those below that department average.
    update employee set salary = salary * 1.1
    where department = department_name and salary < avg_salary; 
  end;
$$;
CALL increase_low_salary('Information Technology'); -- Executing the raise logic.


--------------------------------------------------------------------------------
-- SECTION 8: TRIGGERS & AUDIT LOGGING (Automatic tracking)
-- Purpose: Automatically records a log entry whenever an employee is deleted.
-- Questions answered: "Who deleted what and when?" (Audit trail).
--------------------------------------------------------------------------------

-- Note: Re-defining the delete function so we can call it later to test the trigger.
CREATE FUNCTION delete_emp_id (emp_id int) returns void language sql AS $$
  delete from employee where id = emp_id;
$$;

-- Create an audit log table to store deletion history.
CREATE TABLE employee_logs (
  id serial primary key,
  emp_name varchar(100),
  action varchar(25),
  action_time timestamp default now()
);

-- Function 3: This is called BY the trigger. It inserts the old row's name into the log.
CREATE FUNCTION log_employee_deletion()
returns trigger
language plpgsql
as $$
begin
  insert into employee_logs (emp_name, action) values (old.name, 'delete');
  return old;
end;
$$;

-- Trigger: Fires automatically AFTER a row is deleted from the 'employee' table.
CREATE TRIGGER save_emp_delete_logs
after delete 
on employee
for each row 
execute function log_employee_deletion();

-- Test the trigger: Deleting employee ID 1 will automatically populate 'employee_logs'.
SELECT delete_emp_id(1);


--------------------------------------------------------------------------------
-- SECTION 9: INDEXING & PERFORMANCE TUNING (Optimization)
-- Purpose: Demonstrates how indexes drastically speed up search queries on large tables.
-- Questions answered: "How to make email lookups blazing fast?" / "What is the performance difference?"
--------------------------------------------------------------------------------

-- Creating a large test table with 5,000 random users.
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  age INT,
  city VARCHAR(50),
  registration_date DATE
);

INSERT INTO users (full_name, email, age, city, registration_date)
SELECT
  'User ' || gs,
  'user' || gs || '@example.com',
  (18 + floor(random() * 43))::INT,
  (ARRAY['Dhaka','Chattogram','Khulna','Rajshahi','Sylhet','Barishal','Rangpur','Mymensingh'])[floor(random() * 8 + 1)],
  CURRENT_DATE - (floor(random() * 1825))::INT
FROM generate_series(1, 5000) AS gs;

-- Creates an index specifically on the 'email' column.
-- Question answered: "Should I create an index to speed up user lookups by email?"
create index idx_users_email on users(email);

-- Query 11: Searches for a specific email WITH the index enabled.
-- Question answered: "How fast is this email lookup (with index)?"
-- (Run this to see the `Execution Time` and `Planning Time` in the output).
explain analyze
select * from users where email = 'user93@example.com';

-- Removes the index.
-- Question answered: "What happens to performance if we remove the index?"
drop index idx_users_email;

-- (Optional: run the same 'explain analyze select ...' again to see how much slower it gets without the index).