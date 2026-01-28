--1 MAI
Select File_name, tablespace_name, status from DBA_DATA_FILES
union
Select File_name, tablespace_name, status from DBA_TEMP_FILES;

--2 MAI
show con_name
ALTER SESSION SET CONTAINER = XEPDB1;
ALTER SESSION SET CONTAINER = CDB$ROOT;
Create tablespace MAI_QDATA
    DATAFILE 'D:\Labs5\Oracle\4\tablespaces\MAI_QDATA.dbf'
    size 10m
    offline;
alter tablespace MAI_QDATA ONLINE

Create user MAI 
identified by 12345
default tablespace MAI_QDATA 
quota 2m on MAI_QDATA
account unlock;

Grant create session, 
      create table, 
      create view,
      create procedure to MAI;


--3 MAI
select * from dba_segments where tablespace_name like '%MAI_QDATA%';

--4 MAI
select * from dba_segments where tablespace_name like '%MAI_QDATA%';
select * from USER_RECYCLEBIN

--5 MAI
FLASHBACK TABLE BANANA TO BEFORE DROP

--8 MAI
Drop user MAI cascade;
Drop TABLESPACE MAI_QDATA INCLUDING CONTENTS AND DATAFILES;

--9 MAI
SELECT *
FROM V$LOG
ORDER BY GROUP#;

--10
SELECT GROUP#, STATUS, MEMBER
FROM V$LOGFILE
ORDER BY GROUP#;

--11
SELECT GROUP#, STATUS, SEQUENCE#, FIRST_CHANGE#, FIRST_TIME
FROM V$LOG
ORDER BY GROUP#;

ALTER SYSTEM SWITCH LOGFILE;

SELECT SYSDATE AS SWITCH_TIME FROM DUAL;

--12
ALTER DATABASE ADD LOGFILE GROUP 4
(
  '/u01/app/oracle/oradata/ORCL/redo04a.log',
  '/u02/app/oracle/oradata/ORCL/redo04b.log',
  '/u03/app/oracle/oradata/ORCL/redo04c.log'
) SIZE 50M;


