show con_name;


select * from TEACHER;

create or replace procedure GET_TEACHERS(PCODE TEACHER.PULPIT%TYPE) is
begin
  for i in (select * from TEACHER where PULPIT = PCODE)
    loop
      dbms_output.put_line(i.TEACHER_NAME);
    end loop;
end;

begin
  GET_TEACHERS('ИСиТ');
end;

--------------------------------------------

create or replace function GET_NUM_TEACHERS(PCODE TEACHER.PULPIT%TYPE) return number
  is
  num number;
begin
  select count(*) into num from TEACHER where PULPIT = PCODE;
  return num;
end;

begin
  dbms_output.put_line(GET_NUM_TEACHERS('ИСиТ'));
end;

-- 3. Разработайте процедуры:
-- GET_TEACHERS (FCODE FACULTY.FACULTY%TYPE)
-- Процедура должна выводить список преподавателей из таблицы TEACHER (в стандартный серверный вывод), 
-- работающих на факультете, заданным кодом в параметре.

-- GET_SUBJECTS (PCODE SUBJECT.PULPIT%TYPE)
-- Процедура должна выводить список дисциплин из таблицы SUBJECT, закрепленных за кафедрой,
-- заданной кодом кафедры в параметре. 
-- Разработайте анонимный блок и продемонстрируйте выполнение процедуры.

create or replace procedure GET_TEACHERS(FCODE FACULTY.FACULTY%TYPE) is
begin
  for i in (select * from TEACHER where PULPIT in (select PULPIT from PULPIT where FACULTY = FCODE))
    loop
      dbms_output.put_line(i.TEACHER_NAME);
    end loop;
end;

begin
  GET_TEACHERS('ХТиТ');
end;

create or replace procedure GET_SUBJECTS(PCODE SUBJECT.PULPIT%TYPE) is
begin
  for i in (select * from SUBJECT where PULPIT = PCODE)
    loop
      dbms_output.put_line(i.SUBJECT_NAME);
    end loop;
end;

begin
  GET_SUBJECTS('ИСиТ');
end;

-- 4. Разработайте локальную функцию
-- GET_NUM_TEACHERS (FCODE FACULTY.FACULTY%TYPE)RETURN NUMBER
-- Функция должна выводить количество преподавателей из таблицы TEACHER, работающих
-- на факультете, заданным кодом в параметре. 
-- Разработайте анонимный блок и продемонстрируйте выполнение процедуры.



create or replace function GET_NUM_TEACHERS(FCODE FACULTY.FACULTY%TYPE) return number
is
  num number;
begin
  select count(*) into num from TEACHER where PULPIT in (select PULPIT from PULPIT where FACULTY = FCODE);
  return num;
end;

begin
  dbms_output.put_line(GET_NUM_TEACHERS('ТОВ'));
end;


-- GET_NUM_SUBJECTS (PCODE SUBJECT.PULPIT%TYPE) RETURN NUMBER 
-- Функция должна выводить количество дисциплин из таблицы SUBJECT, закрепленных за кафедрой, 
-- заданной кодом кафедры параметре. 
-- Разработайте анонимный блок и продемонстрируйте выполнение процедуры.

select * from SUBJECT;

create or replace function GET_NUM_SUBJECTS(PCODE SUBJECT.PULPIT%TYPE) return number
is
  num number;
begin
  select count(*) into num from SUBJECT where PULPIT = PCODE;
  return num;
end;

begin
  dbms_output.put_line(GET_NUM_SUBJECTS('ИСиТ'));
end;

-- 5. Разработайте пакет TEACHERS, содержащий процедуры и функции:
-- GET_TEACHERS (FCODE FACULTY.FACULTY%TYPE)
-- GET_SUBJECTS (PCODE SUBJECT.PULPIT%TYPE)
-- GET_NUM_TEACHERS (FCODE FACULTY.FACULTY%TYPE) RETURN NUMBER 
-- GET_NUM_SUBJECTS (PCODE SUBJECT.PULPIT%TYPE) RETURN NUMBER

create or replace package TEACHERS is
  procedure GET_TEACHERS(FCODE FACULTY.FACULTY%TYPE);
  procedure GET_SUBJECTS(PCODE SUBJECT.PULPIT%TYPE);
  function GET_NUM_TEACHERS(FCODE FACULTY.FACULTY%TYPE) return number;
  function GET_NUM_SUBJECTS(PCODE SUBJECT.PULPIT%TYPE) return number;
end TEACHERS;

-- 6. Разработайте анонимный блок и продемонстрируйте выполнение процедур и функций пакета TEACHERS.
create or replace package body TEACHERS is
  procedure GET_TEACHERS(FCODE FACULTY.FACULTY%TYPE) is
  begin
    for i in (select * from TEACHER where PULPIT in (select PULPIT from PULPIT where FACULTY = FCODE))
      loop
        dbms_output.put_line(i.TEACHER_NAME);
      end loop;
  end;

  procedure GET_SUBJECTS(PCODE SUBJECT.PULPIT%TYPE) is
  begin
    for i in (select * from SUBJECT where PULPIT = PCODE)
      loop
        dbms_output.put_line(i.SUBJECT_NAME);
      end loop;
  end;

  function GET_NUM_TEACHERS(FCODE FACULTY.FACULTY%TYPE) return number
    is
    num number;
  begin
    select count(*) into num from TEACHER where PULPIT in (select PULPIT from PULPIT where FACULTY = FCODE);
    return num;
  end;

  function GET_NUM_SUBJECTS(PCODE SUBJECT.PULPIT%TYPE) return number
    is
    num number;
  begin
    select count(*) into num from SUBJECT where PULPIT = PCODE;
    return num;
  end;
end TEACHERS;

begin
dbms_output.put_line('Пакет (Task6)');
  TEACHERS.GET_TEACHERS('ИДиП');
  dbms_output.put_line('========');
  TEACHERS.GET_SUBJECTS('ИСиТ');
  dbms_output.put_line('========');
  dbms_output.put_line(TEACHERS.GET_NUM_TEACHERS('ТОВ'));
  dbms_output.put_line('========');
  dbms_output.put_line(TEACHERS.GET_NUM_SUBJECTS('ИСиТ'));
end;