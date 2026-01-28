--1 АБ
begin
    null;
end;

--2
begin
 dbms_output.put_line('Hello World');
end;
/

--3 Ошибки
declare num1 number;
begin
    num1 := 1/0;
exception
    when others then
     dbms_output.put_line('Err: ' || SQLERRM);
     dbms_output.put_line('Error: ' || SQLCODE);
end;

--4
declare num1 number;
begin
  declare
  begin
    num1 := 1/0;
  exception
    when others then
     dbms_output.put_line('Err: ' || SQLERRM);
     dbms_output.put_line('Error: ' || SQLCODE);
  end;
  dbms_output.put_line('Hello World');
end;

--5 предупреждения компилятора
select type, value from v$parameter where name = 'plsql_warnings';

--6 Спецсимволы
select keyword from V$RESERVED_WORDS where LENGTH = 1 and KEYWORD <> 'A';

--7 Ключевые слова
select keyword from V$RESERVED_WORDS where LENGTH > 1 and KEYWORD <> 'A' order by keyword;

--8 
select name, value from v$parameter 
    where name like 'plsql%';
  
show parameter plsql;

--9 10.	объявление и инициализацию целых number-переменных;
declare num3 number := 2;
        num4 number := 3;
begin
     dbms_output.put_line('num3:' || num3);
     dbms_output.put_line('num4:' || num4);
end;

--11 Арифметика
declare num3 number := 3;
        num4 number := 4;
begin
     dbms_output.put_line('3+4:' || (num3 + num4));
     dbms_output.put_line('3-4:' || (num3 - num4));
     dbms_output.put_line('3*4:' || (num3 * num4));
     dbms_output.put_line('3/4:' || (num3 / num4));
     dbms_output.put_line('4mod3:' || (num4 mod num3));
end;

--12 С фиксированной токой number
declare
  num5 NUMBER := 1.1;
  num6 NUMBER(3, 1) := 2.23;
begin
  dbms_output.put_line(num5);
  dbms_output.put_line(num6);
end;

--13 Округление
declare
  num5 NUMBER(4,-1) := 11.1;
  num6 NUMBER(3, -1) := 2.24;
begin
  dbms_output.put_line(num5);
  dbms_output.put_line(num6);
end;

--14 
declare
  num5 binary_float := 11.1;
begin
  dbms_output.put_line(num5);
end;

--15
declare
  num5 binary_double := 11.1;
begin
  dbms_output.put_line(num5);
end;

--16 Число Е
declare
  num5 NUMBER := 1.1E1;
  num6 NUMBER := 2.24E-1;
begin
  dbms_output.put_line(num5);
  dbms_output.put_line(num6);
end;

--17 Boolean
DECLARE
  v_bool BOOLEAN := TRUE;
BEGIN
  IF v_bool THEN
    DBMS_OUTPUT.PUT_LINE('TRUE');
  ELSE
    DBMS_OUTPUT.PUT_LINE('FALSE');
  END IF;
END;

--18
DECLARE
  VCHAR_CONST CONSTANT VARCHAR2(20) := 'VCHAR_CONST';
  CHAR_CONST CONSTANT CHAR(20) := 'CHAR_CONST';
  NUMBER_CONST CONSTANT NUMBER := 1;
BEGIN
  DBMS_OUTPUT.PUT_LINE(VCHAR_CONST);
  DBMS_OUTPUT.PUT_LINE(CHAR_CONST);
  DBMS_OUTPUT.PUT_LINE(NUMBER_CONST);
END;

--19 %TYPE.

DECLARE
  VCHAR_CONST CONSTANT VARCHAR2(20) := 'VCHAR_CONST';
  CHAR_CONST CONSTANT CHAR(20) := 'CHAR_CONST';
  NUMBER_CONST CONSTANT NUMBER := 1;
  VCHAR_CONST2 VCHAR_CONST%TYPE := 'VCHAR_CONST2';
  CHAR_CONST2 CHAR_CONST%TYPE := 'CHAR_CONST2';
  NUMBER_CONST2 NUMBER_CONST%TYPE := 2;
BEGIN
  DBMS_OUTPUT.PUT_LINE(VCHAR_CONST2);
  DBMS_OUTPUT.PUT_LINE(CHAR_CONST2);
  DBMS_OUTPUT.PUT_LINE(NUMBER_CONST2);
END;

-- 20 %ROWTYPE

DECLARE
  AUDITORIUM_TYPE_ROW AUDITORIUM_TYPE%ROWTYPE;
BEGIN
  AUDITORIUM_TYPE_ROW.AUDITORIUM_TYPENAME := 'Аудитория';
  AUDITORIUM_TYPE_ROW.AUDITORIUM_TYPE := 'Auditorium';

  DBMS_OUTPUT.PUT_LINE(AUDITORIUM_TYPE_ROW.AUDITORIUM_TYPE);
  DBMS_OUTPUT.PUT_LINE(AUDITORIUM_TYPE_ROW.AUDITORIUM_TYPENAME);
end;

-- 21. if

DECLARE
  v_num NUMBER := 1;
BEGIN
  IF v_num = 1 THEN
    DBMS_OUTPUT.PUT_LINE('v_num = 1');
  ELSIF v_num = 2 THEN
    DBMS_OUTPUT.PUT_LINE('v_num = 2');
  ELSIF v_num is null THEN
    DBMS_OUTPUT.PUT_LINE('v_num is null');
  ELSE
    DBMS_OUTPUT.PUT_LINE('v_num = 3');
  END IF;
END;

-- 23 case

DECLARE
  v_num NUMBER := 2;
BEGIN
  CASE v_num
    WHEN 1 THEN
      DBMS_OUTPUT.PUT_LINE('v_num = 1');
    WHEN 2 THEN
      DBMS_OUTPUT.PUT_LINE('v_num = 2');
    WHEN 3 THEN
      DBMS_OUTPUT.PUT_LINE('v_num = 3');
    ELSE
      DBMS_OUTPUT.PUT_LINE('v_num is null');
  END CASE;
END;

-- 24 LOOP.
DECLARE
  v_num NUMBER := 1;
BEGIN
  LOOP
      EXIT WHEN v_num > 10;
    DBMS_OUTPUT.PUT_LINE(v_num);
    v_num := v_num + 1;

  END LOOP;
END;

-- 25 WHILE.

DECLARE
  v_num NUMBER := 1;
BEGIN
  WHILE v_num <= 10 LOOP
    DBMS_OUTPUT.PUT_LINE(v_num);
    v_num := v_num + 1;
  END LOOP;
END;

-- 26 FOR.

DECLARE
  v_num NUMBER := 1;
BEGIN
  FOR i IN 4..10 BY 3 LOOP
    DBMS_OUTPUT.PUT_LINE(i);
  END LOOP;
END;

