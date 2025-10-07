-- =================================================================================
-- 1) DROP & CREATE DATABASE
-- =================================================================================
DROP DATABASE IF EXISTS hrms;
CREATE DATABASE hrms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hrms;

-- =================================================================================
-- 2) ตาราง Roles
-- =================================================================================
CREATE TABLE roles (
  role_id   INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO roles(role_name) VALUES
('employee'),('HR');

-- =================================================================================
-- 3) ตาราง Users (Login + Role)
-- =================================================================================
CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id       INT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(role_id) REFERENCES roles(role_id)
);
-- เติม 40 user (noppanapa เป็น HR ที่เหลือเป็น employee)
INSERT INTO users(username,password_hash,role_id)
VALUES
('noppanapa',SHA2('password123',256),2),
('munin',    SHA2('password123',256),1),
('muta',     SHA2('password123',256),1),
('paweena',  SHA2('password123',256),1),
('praw',     SHA2('password123',256),1),
('anawin',   SHA2('password123',256),1),
('kanin',    SHA2('password123',256),1),
('kanda',    SHA2('password123',256),1),
('metinee',  SHA2('password123',256),1),
('tawan',    SHA2('password123',256),1),
('malinee',  SHA2('password123',256),1),
('pawin',    SHA2('password123',256),1),
('narong',   SHA2('password123',256),1),
('nirin',    SHA2('password123',256),1),
('tanin',    SHA2('password123',256),1),
('manee',    SHA2('password123',256),1),
('boonsri',  SHA2('password123',256),1),
('kawin',    SHA2('password123',256),1),
('chanika',  SHA2('password123',256),1),
('sirawit',  SHA2('password123',256),1),
('jalisa',   SHA2('password123',256),1),
('natee',    SHA2('password123',256),1),
('poranee',  SHA2('password123',256),1),
('tewin',    SHA2('password123',256),1),
('kamon',    SHA2('password123',256),1),
('patcha',   SHA2('password123',256),1),
('tinn',     SHA2('password123',256),1),
('sirinya',  SHA2('password123',256),1),
('peem',     SHA2('password123',256),1),
('anan',     SHA2('password123',256),1),
('pimpa',    SHA2('password123',256),1),
('arisa',    SHA2('password123',256),1),
('suriya',   SHA2('password123',256),1),
('namfon',   SHA2('password123',256),1),
('chatchai', SHA2('password123',256),1),
('jantra',   SHA2('password123',256),1),
('darika',   SHA2('password123',256),1),
('krit',     SHA2('password123',256),1),
('ploy',     SHA2('password123',256),1),
('natdanai', SHA2('password123',256),1);

-- =================================================================================
-- 4) ตาราง Employees (Profile + Work Info)
--    ใช้ employee_code เป็น PRIMARY KEY
-- =================================================================================
CREATE TABLE employees (
  employee_code VARCHAR(10) PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  national_id   VARCHAR(13) UNIQUE,
  birth_date    DATE,
  gender        ENUM('ชาย','หญิง','อื่นๆ'),
  phone         VARCHAR(20),
  email         VARCHAR(100),
  address       TEXT,
  department    VARCHAR(100),
  position      VARCHAR(100),
  hire_date     DATE,
  status        ENUM('ทำงานอยู่','ทดลองงาน','ลาออก','พักงาน') DEFAULT 'ทำงานอยู่',
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);
INSERT INTO employees
  (employee_code,user_id,first_name,last_name,national_id,
   birth_date,gender,phone,email,address,department,position,hire_date)
VALUES
('HR001', 1,'นพนภา','ข้างพี่ตา','110370000001','1985-07-14','หญิง',
 '0811110001','noppanapa@company.com','กรุงเทพฯ','HR','HR Manager','2015-01-15'),
('EMP001',2,'มุนิน','รักดี','110370000002','1995-02-03','หญิง',
 '0811110002','munin@company.com','กรุงเทพฯ','Marketing','Marketing Officer','2021-06-01'),
('EMP002',3,'มุตตา','ใจงาม','110370000003','1996-05-09','หญิง',
 '0811110003','muta@company.com','กรุงเทพฯ','Engineering','System Design Engineer','2021-07-15'),
('EMP003',4,'ภาวินี','ศรีสุข','110370000004','1994-03-10','หญิง',
 '0811110004','paweena@company.com','นนทบุรี','HR','HR Officer','2020-09-01'),
('EMP004',5,'แพรว','บุญมา','110370000005','1993-11-15','หญิง',
 '0811110005','praw@company.com','กรุงเทพฯ','Finance','Accountant','2022-03-10'),
('EMP005',6,'อนาวิน','เจริญสุข','110370000006','1997-07-20','ชาย',
 '0811110006','anawin@company.com','สมุทรปราการ','IT','Web Developer','2022-05-02'),
('EMP006',7,'คณิน','พัฒนกิจ','110370000007','1998-12-08','ชาย',
 '0811110007','kanin@company.com','กรุงเทพฯ','Engineering','Service Engineer','2023-01-10'),
('EMP007',8,'กานดา','รุ่งเรือง','110370000008','1999-04-22','หญิง',
 '0811110008','kanda@company.com','ปทุมธานี','Sales','Sales Engineer','2022-12-15'),
('EMP008',9,'เมทินี','สิริวัฒนา','110370000009','1992-10-02','หญิง',
 '0811110009','metinee@company.com','กรุงเทพฯ','PR','PR Officer','2021-02-20'),
('EMP009',10,'ตะวัน','แสงอรุณ','110370000010','1990-09-17','ชาย',
 '0811110010','tawan@company.com','กรุงเทพฯ','IT','IT Support','2020-11-11'),
('EMP010',11,'มาลินี','โชคชัย','110370000011','1991-01-08','หญิง',
 '0811110011','malinee@company.com','ชลบุรี','IT','IT Support','2021-08-19'),
('EMP011',12,'ภาวิน','อุดมทรัพย์','110370000012','1993-02-14','ชาย',
 '0811110012','pawin@company.com','กรุงเทพฯ','Maintenance','Technician','2020-03-05'),
('EMP012',13,'ณรงค์','มีชัย','110370000013','1998-06-09','ชาย',
 '0811110013','narong@company.com','กรุงเทพฯ','Maintenance','Technician','2022-10-01'),
('EMP013',14,'นิริน','จิตต์แจ้ง','110370000014','1994-04-23','หญิง',
 '0811110014','nirin@company.com','กรุงเทพฯ','Marketing','Content Creator','2023-04-01'),
('EMP014',15,'ธนิน','กิตติคุณ','110370000015','1999-08-28','ชาย',
 '0811110015','tanin@company.com','สมุทรปราการ','IT','App Developer','2021-09-15'),
('EMP015',16,'มณี','แก้วใส','110370000016','1992-07-11','หญิง',
 '0811110016','manee@company.com','กรุงเทพฯ','Procurement','Purchasing Officer','2019-07-01'),
('EMP016',17,'บุญศรี','งามตา','110370000017','1993-03-03','หญิง',
 '0811110017','boonsri@company.com','นนทบุรี','Admin','Admin Officer','2018-02-01'),
('EMP017',18,'กวิน','โพธิ์งาม','110370000018','1994-10-29','ชาย',
 '0811110018','kawin@company.com','กรุงเทพฯ','IT','IT Support','2021-11-11'),
('EMP018',19,'ชนิกา','ทรัพย์อนันต์','110370000019','1990-06-05','หญิง',
 '0811110019','chanika@company.com','กรุงเทพฯ','Finance','Finance Officer','2020-01-01'),
('EMP019',20,'ศิรวิชญ์','คงมั่น','110370000020','1998-12-30','ชาย',
 '0811110020','sirawit@company.com','กรุงเทพฯ','Engineering','Sales Engineer','2023-06-01'),
('EMP020',21,'จลิษา','รุ่งโรจน์','110370000021','1991-05-22','หญิง',
 '0811110021','jalisa@company.com','กรุงเทพฯ','HR','HR Officer','2019-09-10'),
('EMP021',22,'นที','ทองดี','110370000022','1995-02-17','ชาย',
 '0811110022','natee@company.com','สมุทรสาคร','Logistics','Logistics Officer','2022-08-05'),
('EMP022',23,'ภรณี','สุขใจ','110370000023','1996-11-01','หญิง',
 '0811110023','poranee@company.com','กรุงเทพฯ','Admin','Secretary','2021-04-14'),
('EMP023',24,'เตวิน','มงคลชัย','110370000024','1997-09-13','ชาย',
 '0811110024','tewin@company.com','นนทบุรี','Logistics','Logistics Officer','2022-03-19'),
('EMP024',25,'กมล','สมบัติ','110370000025','1998-03-11','ชาย',
 '0811110025','kamon@company.com','กรุงเทพฯ','Engineering','System Design Engineer','2023-01-03'),
('EMP025',26,'พัชชา','จินดา','110370000026','1995-06-08','หญิง',
 '0811110026','patcha@company.com','กรุงเทพฯ','Marketing','Marketing Officer','2022-02-12'),
('EMP026',27,'ติณณ์','ดีเสมอ','110370000027','1992-08-04','ชาย',
 '0811110027','tinn@company.com','กรุงเทพฯ','Maintenance','Technician','2019-10-01'),
('EMP027',28,'สิรินยา','มั่นคง','110370000028','1997-10-10','หญิง',
 '0811110028','sirinya@company.com','กรุงเทพฯ','HR','HR Officer','2021-01-09'),
('EMP028',29,'ภีม','ปรีดา','110370000029','1998-12-01','ชาย',
 '0811110029','peem@company.com','กรุงเทพฯ','Marketing','Content Creator','2023-04-14'),
('EMP029',30,'อนันต์','ทวีสุข','110370000030','1994-01-15','ชาย',
 '0811110030','anan@company.com','กรุงเทพฯ','Finance','Finance Officer','2021-09-23'),
('EMP030',31,'พิมพา','เจริญลาภ','110370000031','1993-09-09','หญิง',
 '0811110031','pimpa@company.com','นนทบุรี','HR','HR Officer','2018-07-17'),
('EMP031',32,'อริสา','เรืองนาม','110370000032','1995-10-18','หญิง',
 '0811110032','arisa@company.com','กรุงเทพฯ','Engineering','Service Engineer','2022-10-01'),
('EMP032',33,'สุริยะ','แสงตะวัน','110370000033','1992-02-02','ชาย',
 '0811110033','suriya@company.com','กรุงเทพฯ','IT','IT Manager','2018-11-01'),
('EMP033',34,'น้ำฝน','ชื่นใจ','110370000034','1999-03-07','หญิง',
 '0811110034','namfon@company.com','กรุงเทพฯ','Marketing','Marketing Officer','2023-05-01'),
('EMP034',35,'ฉัตรชัย','โพธิ์ศรี','110370000035','1991-12-25','ชาย',
 '0811110035','chatchai@company.com','กรุงเทพฯ','Engineering','Sales Engineer','2019-01-10'),
('EMP035',36,'จันทรา','ส่องแสง','110370000036','1990-05-05','หญิง',
 '0811110036','jantra@company.com','กรุงเทพฯ','PR','PR Officer','2020-06-06'),
('EMP036',37,'ดาริกา','งามวิไล','110370000037','1998-01-28','หญิง',
 '0811110037','darika@company.com','กรุงเทพฯ','Sales','Sales Engineer','2022-08-18'),
('EMP037',38,'กฤษณ์','มีมานะ','110370000038','1996-04-30','ชาย',
 '0811110038','krit@company.com','กรุงเทพฯ','Maintenance','Technician','2021-03-30'),
('EMP038',39,'พลอย','ไพลิน','110370000039','1997-07-07','หญิง',
 '0811110039','ploy@company.com','กรุงเทพฯ','Design','Product Designer','2022-11-11'),
('EMP039',40,'ณัฐดนัย','วิริยะ','110370000040','1995-08-12','ชาย',
 '0811110040','natdanai@company.com','กรุงเทพฯ','IT','Web Developer','2021-12-01');

-- =================================================================================
-- 5) ตาราง Emergency Contacts
-- =================================================================================
CREATE TABLE emergency_contacts (
  contact_id   INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  name         VARCHAR(100),
  relationship VARCHAR(50),
  phone        VARCHAR(20),
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO emergency_contacts(employee_code,name,relationship,phone)
SELECT
  employee_code,
  CONCAT('Contact_of_',employee_code),
  'relative',
  CONCAT('09', LPAD(FLOOR(RAND()*10000000),7,'0'))
FROM employees;

-- =================================================================================
-- 6) ตาราง Work Info
-- =================================================================================
CREATE TABLE work_info (
  work_id       INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  position      VARCHAR(100),
  department    VARCHAR(100),
  start_date    DATE,
  experience_years INT,
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO work_info(employee_code,position,department,start_date,experience_years)
SELECT
  employee_code,
  position,
  department,
  hire_date,
  TIMESTAMPDIFF(YEAR,hire_date,'2025-10-01')
FROM employees;

-- =================================================================================
-- 7) ตาราง Payroll (เดือน Oct 2025)
-- =================================================================================
CREATE TABLE payroll (
  payroll_id    INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  pay_month     VARCHAR(20),
  pay_year      INT,
  base_salary   DECIMAL(10,2),
  allowance     DECIMAL(10,2),
  bonus         DECIMAL(10,2),
  total_salary  DECIMAL(10,2),
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO payroll(employee_code,pay_month,pay_year,base_salary,allowance,bonus,total_salary)
SELECT
  employee_code,
  'October',2025,
  20000 + FLOOR(RAND()*30000),
  1000  + FLOOR(RAND()*4000),
  500   + FLOOR(RAND()*10000),
  ((20000 + FLOOR(RAND()*30000))
   + (1000  + FLOOR(RAND()*4000))
   + (500   + FLOOR(RAND()*10000)))
FROM employees;

-- =================================================================================
-- 8) ตาราง Leave Records
-- =================================================================================
CREATE TABLE leave_records (
  leave_id      INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  leave_type    ENUM('ลาป่วย','ลากิจ','ลาพักร้อน','อื่นๆ'),
  start_date    DATE,
  end_date      DATE,
  reason        TEXT,
  status        ENUM('รอดำเนินการ','อนุมัติ','ไม่อนุมัติ') DEFAULT 'รอดำเนินการ',
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO leave_records(employee_code,leave_type,start_date,end_date,reason,status)
SELECT
  employee_code,
  ELT(FLOOR(RAND()*4)+1,'ลาป่วย','ลากิจ','ลาพักร้อน','อื่นๆ'),
  DATE_ADD(hire_date,INTERVAL 30 DAY),
  DATE_ADD(hire_date,INTERVAL 32 DAY),
  CONCAT('เหตุผลสำหรับ ',employee_code),
  'อนุมัติ'
FROM employees;

-- =================================================================================
-- 9) ตาราง Benefit Types
-- =================================================================================
CREATE TABLE benefit_types (
  benefit_type_id INT AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20) UNIQUE,
  name            VARCHAR(100),
  description     TEXT,
  max_limit       DECIMAL(12,2)
);
INSERT INTO benefit_types(code,name,description,max_limit) VALUES
('B001','Medical','ค่ารักษาพยาบาล',20000),
('B002','Transport','ค่าเดินทาง',5000),
('B003','Food','ค่าอาหาร',3000),
('B004','Education','ทุนการศึกษา',10000),
('B005','Gym','ค่าสมาชิกฟิตเนส',2000);

-- =================================================================================
-- 10) ตาราง Benefit Entitlements (40 x 5 = 200 แถว)
-- =================================================================================
CREATE TABLE benefit_entitlements (
  entitlement_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_code  VARCHAR(10) NOT NULL,
  benefit_type_id INT NOT NULL,
  period_start   DATE NOT NULL,
  period_end     DATE NOT NULL,
  allocation     DECIMAL(12,2) DEFAULT 0,
  UNIQUE(employee_code,benefit_type_id,period_start,period_end),
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code),
  FOREIGN KEY(benefit_type_id) REFERENCES benefit_types(benefit_type_id)
);
INSERT INTO benefit_entitlements(employee_code,benefit_type_id,period_start,period_end,allocation)
SELECT
  e.employee_code,
  bt.benefit_type_id,
  '2025-01-01','2025-12-31',
  bt.max_limit
FROM employees AS e
CROSS JOIN benefit_types AS bt;

-- =================================================================================
-- 11) ตาราง Benefit Claims (40 แถว: claim ประเภทแรกให้ทุกคน)
-- =================================================================================
CREATE TABLE benefit_claims (
  claim_id        INT AUTO_INCREMENT PRIMARY KEY,
  entitlement_id  INT NOT NULL,
  employee_code   VARCHAR(10) NOT NULL,
  benefit_type_id INT NOT NULL,
  claim_date      DATETIME DEFAULT CURRENT_TIMESTAMP,
  amount          DECIMAL(12,2) CHECK(amount>=0),
  status          VARCHAR(20) DEFAULT 'pending',
  note            TEXT,
  FOREIGN KEY(entitlement_id)  REFERENCES benefit_entitlements(entitlement_id) ON DELETE CASCADE,
  FOREIGN KEY(employee_code)   REFERENCES employees(employee_code),
  FOREIGN KEY(benefit_type_id) REFERENCES benefit_types(benefit_type_id)
);
INSERT INTO benefit_claims(entitlement_id,employee_code,benefit_type_id,claim_date,amount,status,note)
SELECT
  be.entitlement_id,
  be.employee_code,
  be.benefit_type_id,
  DATE_ADD(be.period_start, INTERVAL 30 DAY),
  be.allocation * 0.5,
  'approved',
  'Auto claim'
FROM benefit_entitlements AS be
WHERE be.benefit_type_id = 1;

-- =================================================================================
-- 12) ตาราง Tax Deductions (40 แถว)
-- =================================================================================
CREATE TABLE tax_deductions (
  deduction_id  INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  period_month  DATE NOT NULL,
  social_security DECIMAL(12,2) DEFAULT 0,
  provident_fund   DECIMAL(12,2) DEFAULT 0,
  income_tax       DECIMAL(12,2) DEFAULT 0,
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO tax_deductions(employee_code,period_month,social_security,provident_fund,income_tax)
SELECT
  employee_code,
  '2025-10-01',
  ROUND(100+RAND()*700,2),
  ROUND(1000+RAND()*4000,2),
  ROUND(500+RAND()*8000,2)
FROM employees;

-- =================================================================================
-- 13) ตาราง Performance Reviews (40 แถว)
-- =================================================================================
CREATE TABLE performance_reviews (
  review_id     INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  review_period VARCHAR(50),
  score         DECIMAL(5,2),
  remarks       TEXT,
  reviewer      VARCHAR(100),
  review_date   DATE,
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO performance_reviews(employee_code,review_period,score,remarks,reviewer,review_date)
SELECT
  employee_code,
  '2025 Q1',
  ROUND(2+RAND()*3,2),
  'Auto review',
  'Manager',
  '2025-03-31'
FROM employees;

-- =================================================================================
-- 14) ตาราง Training Records (40 แถว)
-- =================================================================================
CREATE TABLE training (
  training_id   INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  course_name   VARCHAR(200),
  start_date    DATE,
  end_date      DATE,
  score         INT,
  result        ENUM('ผ่าน','ไม่ผ่าน','รอดำเนินการ'),
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO training(employee_code,course_name,start_date,end_date,score,result)
SELECT
  employee_code,
  CONCAT('Course_',employee_code),
  DATE_ADD(hire_date,INTERVAL 10 DAY),
  DATE_ADD(hire_date,INTERVAL 15 DAY),
  FLOOR(60+RAND()*40),
  'ผ่าน'
FROM employees;

-- =================================================================================
-- 15) ตาราง Documents (40 แถว)
-- =================================================================================
CREATE TABLE documents (
  doc_id        INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(10) NOT NULL,
  doc_name      VARCHAR(200),
  file_path     VARCHAR(255),
  upload_date   DATE,
  FOREIGN KEY(employee_code) REFERENCES employees(employee_code)
);
INSERT INTO documents(employee_code,doc_name,file_path,upload_date)
SELECT
  employee_code,
  CONCAT('IDCopy_',employee_code),
  CONCAT('/docs/',employee_code,'.pdf'),
  DATE_ADD(hire_date,INTERVAL 5 DAY)
FROM employees;

-- =================================================================================
-- 16) ตาราง Contact Departments (static)
-- =================================================================================
CREATE TABLE contact_departments (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  department_name     VARCHAR(100) NOT NULL,
  contact_person_name VARCHAR(100) NOT NULL,
  phone               VARCHAR(20),
  email               VARCHAR(100)
);
INSERT INTO contact_departments(department_name,contact_person_name,phone,email) VALUES
('HR','นพนภา ใจดี','081-111-0001','noppanapa@company.com'),
('Marketing','มุนิน รักดี','081-111-0002','munin@company.com'),
('Engineering','มุตตา ใจงาม','081-111-0003','muta@company.com'),
('Finance','แพรว บุญมา','081-111-0005','praw@company.com'),
('IT','อนาวิน เจริญสุข','081-111-0006','anawin@company.com'),
('Sales','กานดา รุ่งเรือง','081-111-0008','kanda@company.com'),
('PR','เมทินี สิริวัฒนา','081-111-0009','metinee@company.com'),
('Maintenance','ภาวิน อุดมทรัพย์','081-111-0012','pawin@company.com'),
('Logistics','นที ทองดี','081-111-0022','natee@company.com'),
('Admin','ภรณี สุขใจ','081-111-0023','poranee@company.com'),
('Procurement','มณี แก้วใส','081-111-0016','manee@company.com'),
('Design','พลอย ไพลิน','081-111-0039','ploy@company.com');

SELECT * FROM roles;
SELECT * FROM users;
SELECT * FROM employees;
SELECT * FROM emergency_contacts;
SELECT * FROM work_info;
SELECT * FROM payroll;
SELECT * FROM leave_records;
SELECT * FROM benefit_types;
SELECT * FROM benefit_entitlements;
SELECT * FROM benefit_claims;
SELECT * FROM tax_deductions;
SELECT * FROM performance_reviews;
SELECT * FROM training;
SELECT * FROM documents;
SELECT * FROM contact_departments;