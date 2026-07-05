-- =====================================================
-- ONLINE COURSE ENROLLMENT DATABASE
-- =====================================================

-- =====================================================
-- CREATE TABLES
-- =====================================================

CREATE TABLE students (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    country VARCHAR(50),
    enrollment_date DATE
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_title VARCHAR(150),
    category VARCHAR(50),
    price DECIMAL(10,2),
    instructor VARCHAR(100),
    published_year INT
);

CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    progress_percentage INT,
    paid_amount DECIMAL(10,2),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- =====================================================
-- INSERT STUDENTS DATA
-- =====================================================

INSERT INTO students
(student_id, first_name, last_name, email, phone, country, enrollment_date)
VALUES
(1,'Rahim','Uddin','rahim@email.com','01711111111','Bangladesh','2023-01-10'),
(2,'Karim','Ahmed','karim@email.com',NULL,'Bangladesh','2023-01-15'),
(3,'Sara','Khan','sara@email.com','01822222222','Pakistan','2023-02-01'),
(4,'John','Smith','john@email.com',NULL,'USA','2023-02-10'),
(5,'Emma','Brown','emma@email.com','01933333333','UK','2023-02-20'),
(6,'Ayaan','Ali','ayaan@email.com',NULL,'India','2023-03-05'),
(7,'Lina','Rahman','lina@email.com','01644444444','Bangladesh','2023-03-12'),
(8,'Mark','Taylor','mark@email.com',NULL,'Australia','2023-03-25'),
(9,'Sophia','Lee','sophia@email.com','01555555555','USA','2023-04-01'),
(10,'Daniel','Martinez','daniel@email.com',NULL,'Spain','2023-04-10');

-- =====================================================
-- INSERT COURSES DATA
-- =====================================================

INSERT INTO courses
(course_id, course_title, category, price, instructor, published_year)
VALUES
(1,'Complete SQL Bootcamp','Database',49.99,'John Carter',2021),
(2,'Advanced JavaScript','Programming',59.99,'Sarah Miller',2020),
(3,'Python for Data Science','Data Science',69.99,'David Kim',2022),
(4,'Web Development with React','Programming',54.99,'Emily Stone',2021),
(5,'Machine Learning Basics','AI',79.99,'Andrew Ng',2019),
(6,'Cloud Computing Fundamentals','Cloud',64.99,'James Allen',2020),
(7,'UI/UX Design Essentials','Design',39.99,'Laura Scott',2022),
(8,'DevOps for Beginners','DevOps',74.99,'Michael Brown',2023);

-- =====================================================
-- INSERT ENROLLMENTS DATA
-- =====================================================

INSERT INTO enrollments
(enrollment_id, student_id, course_id, enrollment_date, progress_percentage, paid_amount)
VALUES
(1,1,1,'2023-05-01',80,49.99),
(2,2,2,'2023-05-03',NULL,59.99),
(3,3,3,'2023-05-05',60,69.99),
(4,4,1,'2023-05-07',100,49.99),
(5,5,4,'2023-05-10',40,54.99),
(6,6,5,'2023-05-12',NULL,79.99),
(7,7,2,'2023-06-01',90,59.99),
(8,8,6,'2023-06-02',30,64.99),
(9,9,3,'2023-06-03',70,69.99),
(10,10,7,'2023-06-04',NULL,39.99),
(11,1,8,'2023-06-05',20,74.99),
(12,2,1,'2023-06-06',50,49.99),
(13,3,6,'2023-06-07',NULL,64.99),
(14,4,4,'2023-06-08',85,54.99),
(15,5,5,'2023-06-09',60,79.99);

-- =====================================================
-- QUESTION 1
-- Display all students and their phone numbers.
-- Show 'Not Provided' if phone is NULL.
-- =====================================================

SELECT
    first_name,
    last_name,
    COALESCE(phone, 'Not Provided') AS phone
FROM students;

-- =====================================================
-- QUESTION 2
-- Show all courses ordered by price
-- (highest to lowest)
-- Limit to 5 courses
-- =====================================================

SELECT *
FROM courses
ORDER BY price DESC
LIMIT 5;

-- =====================================================
-- QUESTION 3
-- Display page 2
-- (3 courses per page)
-- =====================================================

SELECT *
FROM courses
LIMIT 3 OFFSET 3;

-- =====================================================
-- QUESTION 4
-- Increase Programming course prices by 10%
-- =====================================================

UPDATE courses
SET price = price * 1.10
WHERE category = 'Programming';

-- Verify

SELECT *
FROM courses
WHERE category = 'Programming';

-- =====================================================
-- QUESTION 5
-- Delete enrollments where progress is NULL
-- =====================================================

DELETE FROM enrollments
WHERE progress_percentage IS NULL;

-- Verify

SELECT *
FROM enrollments;

-- =====================================================
-- QUESTION 6
-- Total paid amount per course category
-- =====================================================

SELECT
    c.category,
    SUM(e.paid_amount) AS total_paid
FROM enrollments e
JOIN courses c
ON e.course_id = c.course_id
GROUP BY c.category;

-- =====================================================
-- QUESTION 7
-- Categories whose average course price
-- is greater than 60
-- =====================================================

SELECT
    category,
    AVG(price) AS average_price
FROM courses
GROUP BY category
HAVING AVG(price) > 60;

-- =====================================================
-- QUESTION 8
-- Count students enrolled in each course
-- =====================================================

SELECT
    c.course_title,
    COUNT(e.student_id) AS total_students
FROM courses c
LEFT JOIN enrollments e
ON c.course_id = e.course_id
GROUP BY c.course_title;

-- =====================================================
-- QUESTION 9
-- What happens if student_id doesn't exist?
-- =====================================================

-- Example

INSERT INTO enrollments
VALUES
(16,99,1,'2023-06-15',50,49.99);

-- Result:
-- ERROR: Foreign key constraint violation.
-- student_id 99 does not exist in students table.

-- =====================================================
-- QUESTION 10
-- Student full name, course title,
-- and paid amount using INNER JOIN
-- =====================================================

SELECT
    CONCAT(s.first_name,' ',s.last_name) AS full_name,
    c.course_title,
    e.paid_amount
FROM enrollments e
INNER JOIN students s
ON e.student_id = s.student_id
INNER JOIN courses c
ON e.course_id = c.course_id;

-- =====================================================
-- QUESTION 11
-- Display all students and enrolled courses
-- Include students without enrollments
-- =====================================================

SELECT
    CONCAT(s.first_name,' ',s.last_name) AS full_name,
    c.course_title
FROM students s
LEFT JOIN enrollments e
ON s.student_id = e.student_id
LEFT JOIN courses c
ON e.course_id = c.course_id;

-- =====================================================
-- QUESTION 12
-- Display all courses and enrolled students
-- Include courses without enrollments
-- =====================================================

SELECT
    c.course_title,
    CONCAT(s.first_name,' ',s.last_name) AS full_name
FROM enrollments e
RIGHT JOIN courses c
ON e.course_id = c.course_id
LEFT JOIN students s
ON e.student_id = s.student_id;

-- =====================================================
-- QUESTION 13
-- Display all students and all courses
-- Include unmatched records
-- =====================================================

SELECT
    CONCAT(s.first_name,' ',s.last_name) AS full_name,
    c.course_title
FROM students s
FULL JOIN enrollments e
ON s.student_id = e.student_id
FULL JOIN courses c
ON e.course_id = c.course_id;

-- =====================================================
-- QUESTION 14
-- Number of enrollments per year
-- =====================================================

SELECT
    EXTRACT(YEAR FROM enrollment_date) AS year,
    COUNT(*) AS total_enrollments
FROM enrollments
GROUP BY EXTRACT(YEAR FROM enrollment_date);

-- =====================================================
-- QUESTION 15
-- Average progress percentage per course
-- Ignore NULL values
-- =====================================================

SELECT
    c.course_title,
    AVG(e.progress_percentage) AS average_progress
FROM courses c
JOIN enrollments e
ON c.course_id = e.course_id
GROUP BY c.course_title;