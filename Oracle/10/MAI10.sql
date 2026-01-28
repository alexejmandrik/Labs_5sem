ALTER TABLE TEACHER
ADD (BIRTHDAY DATE, SALARY NUMBER);

UPDATE TEACHER
SET BIRTHDAY = TRUNC(SYSDATE) - FLOOR(DBMS_RANDOM.VALUE(365*23, 365*3)),
    SALARY = FLOOR(DBMS_RANDOM.VALUE(30000, 80000));


ALTER TABLE TEACHER DROP COLUMN BIRTHDAY;
ALTER TABLE TEACHER DROP COLUMN SALARY;
  
select * from TEACHER;

-- 2. Получите список преподавателей в виде Фамилия И.О.
CREATE OR REPLACE FUNCTION GET_FIO(TEACHER_NAME VARCHAR2)
    RETURN VARCHAR2
IS
    FIO VARCHAR2(200);
BEGIN
    FIO := SUBSTR(TEACHER_NAME, 1, INSTR(TEACHER_NAME, ' ') - 1) || ' ' ||
                 SUBSTR(TEACHER_NAME, INSTR(TEACHER_NAME, ' ') + 1, 1) || '.' ||
                 SUBSTR(TEACHER_NAME, INSTR(TEACHER_NAME, ' ', 1, 2) + 1, 1) || '.';

    RETURN FIO;
END;

select GET_FIO(TEACHER_NAME) from TEACHER;

-- 3. Получите список преподавателей, родившихся в понедельник.
select * from TEACHER;

SELECT TEACHER_NAME, BIRTHDAY FROM TEACHER
WHERE TO_CHAR(BIRTHDAY, 'D') = '1';

-- 4. Создайте представление, в котором поместите список преподавателей, 
-- которые родились в следующем месяце.
CREATE OR REPLACE VIEW TEACHERS_NEXT_MONTH AS
SELECT GET_FIO(TEACHER_NAME) AS FIO,
       BIRTHDAY
FROM TEACHER
WHERE TO_CHAR(BIRTHDAY, 'MM') =
      TO_CHAR(ADD_MONTHS(SYSDATE, 1), 'MM');

select * from TEACHERS_NEXT_MONTH;

-- 5. Создайте представление, в котором поместите количество преподавателей, 
-- которые родились в каждом месяце.
create table MONTHS
(
  month_name   varchar(20),
  month_number varchar(2)
);

drop table MONTHS;

insert into MONTHS (month_name, month_number)
values ('Январь', '01');
insert into MONTHS (month_name, month_number)
values ('Февраль', '02');
insert into MONTHS (month_name, month_number)
values ('Март', '03');
insert into MONTHS (month_name, month_number)
values ('Апрель', '04');
insert into MONTHS (month_name, month_number)
values ('Май', '05');
insert into MONTHS (month_name, month_number)
values ('Июнь', '06');
insert into MONTHS (month_name, month_number)
values ('Июль', '07');
insert into MONTHS (month_name, month_number)
values ('Август', '08');
insert into MONTHS (month_name, month_number)
values ('Сентябрь', '09');
insert into MONTHS (month_name, month_number)
values ('Октябрь', '10');
insert into MONTHS (month_name, month_number)
values ('Ноябрь', '11');
insert into MONTHS (month_name, month_number)
values ('Декабрь', '12');

create or replace view TEACHER_COUNT_BY_MONTH as
select month_name,
       (select count(*) from TEACHER where to_char(birthday, 'MM') = month_number) as count
from MONTHS;


select * from TEACHER_COUNT_BY_MONTH;

select SUM(COUNT) from TEACHER_COUNT_BY_MONTH;
select COUNT(*) from TEACHER;

-- 6. Создать курсор и вывести список преподавателей, у которых в следующем году юбилей.
DECLARE
  CURSOR c_jub IS
    SELECT GET_FIO(TEACHER_NAME) AS FIO, BIRTHDAY
    FROM TEACHER
    WHERE MOD(
            (EXTRACT(YEAR FROM ADD_MONTHS(SYSDATE, 12))) -
            EXTRACT(YEAR FROM BIRTHDAY),
            5
          ) = 0;
BEGIN
  FOR r IN c_jub LOOP
    DBMS_OUTPUT.PUT_LINE(r.FIO || ' — ' || TO_CHAR(r.BIRTHDAY, 'DD.MM.YYYY'));
  END LOOP;
END;

-- 7. Создать курсор и вывести среднюю заработную плату по кафедрам с округлением вниз до целых,
-- вывести средние итоговые значения для каждого факультета и для всех факультетов в целом.
select * from TEACHER;
select * from FACULTY;

DECLARE
  CURSOR c_average_salary IS
    SELECT P.FACULTY, AVG(T.SALARY) AS AVERAGE_SALARY
    FROM TEACHER T
    INNER JOIN PULPIT P ON T.PULPIT = P.PULPIT
    GROUP BY P.FACULTY;

  v_faculty CHAR(20);
  v_average_salary NUMBER; -- среднее по одному факультету
  v_count_faculty NUMBER; -- кол-во факультетов
  v_total_average_salary NUMBER := 0;
  v_average_salary_all_faculty NUMBER; -- среднее по всем факультетам
BEGIN
  OPEN c_average_salary;
  
  DBMS_OUTPUT.PUT_LINE('Average Salary by Faculty:');
  DBMS_OUTPUT.PUT_LINE('-------------------------');
  
  LOOP
    FETCH c_average_salary INTO v_faculty, v_average_salary;
    EXIT WHEN c_average_salary%NOTFOUND;
    
    SELECT COUNT(*) INTO v_count_faculty FROM FACULTY;
    v_total_average_salary := v_total_average_salary + v_average_salary;
    v_average_salary_all_faculty := v_total_average_salary / v_count_faculty;
    
    DBMS_OUTPUT.PUT_LINE('Faculty: ' || v_faculty || ', Average Salary: ' || FLOOR(v_average_salary));
  END LOOP;
  
  DBMS_OUTPUT.PUT_LINE('-------------------------');
  DBMS_OUTPUT.PUT_LINE('Total: ' || FLOOR(v_total_average_salary));
  DBMS_OUTPUT.PUT_LINE('Total Average Salary: ' || FLOOR(v_average_salary_all_faculty));
  
  CLOSE c_average_salary;
END;

-- 8. Создайте собственный тип PL/SQL-записи (record) и продемонстрируйте работу с ним.
select * from TEACHER;

CREATE OR REPLACE PROCEDURE demonstrate_record AS
  TYPE pulpit_record IS RECORD (
    pulpit_code CHAR(20),
    faculty     CHAR(20)
  );

  TYPE teacher_record IS RECORD (
    teacher       VARCHAR2(20),
    teacher_name  VARCHAR2(200),
    pulpit_info   pulpit_record
  );

  t1 teacher_record;
  t2 teacher_record;
BEGIN
  t1.teacher := 'СМЛВ';
  t1.teacher_name := 'Смелов Владимир Владиславович';
  t1.pulpit_info.pulpit_code := 'ИСиТ';
  t1.pulpit_info.faculty := 'ФИТ';

  t2 := t1;

  DBMS_OUTPUT.PUT_LINE('--- RECORD #1 ---');
  DBMS_OUTPUT.PUT_LINE('Teacher: ' || t1.teacher);
  DBMS_OUTPUT.PUT_LINE('Teacher Name: ' || t1.teacher_name);
  DBMS_OUTPUT.PUT_LINE('Pulpit: ' || t1.pulpit_info.pulpit_code);
  DBMS_OUTPUT.PUT_LINE('Faculty: ' || t1.pulpit_info.faculty);

  DBMS_OUTPUT.PUT_LINE('--- RECORD #2 (копия #1) ---');
  DBMS_OUTPUT.PUT_LINE('Teacher: ' || t2.teacher);
  DBMS_OUTPUT.PUT_LINE('Teacher Name: ' || t2.teacher_name);
  DBMS_OUTPUT.PUT_LINE('Pulpit: ' || t2.pulpit_info.pulpit_code);
  DBMS_OUTPUT.PUT_LINE('Faculty: ' || t2.pulpit_info.faculty);
END;


BEGIN
  demonstrate_record;
END;
