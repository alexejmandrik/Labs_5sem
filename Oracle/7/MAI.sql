SQL> Create pluggable database CPMAI
admin user admin_cp identified by 1234
file_name_convert=('/opt/oracle/oradata/XE/pdbseed/','/opt/oracle/oradata/XE/CPMAI/');

SQL> alter pluggable database CPMAI open;
SQL> alter session set container = CPMAI;
SQL> create user MAI identified by 1234;

grant create session to MAI;
grant create table to MAI;
grant create view to MAI;
ALTER USER MAI QUOTA UNLIMITED ON SYSTEM;
GRANT CREATE SEQUENCE TO MAI;
GRANT CREATE CLUSTER TO MAI;
GRANT CREATE SYNONYM TO MAI;
GRANT CREATE PUBLIC SYNONYM TO MAI;
GRANT CREATE MATERIALIZED VIEW TO MAI;
GRANT CREATE JOB TO MAI;
GRANT QUERY REWRITE TO MAI;
GRANT SELECT ANY DICTIONARY TO MAI;

select * from dual;

--2
CREATE SEQUENCE S1
    START WITH 1000
    INCREMENT BY 10
    NOMINVALUE
    NOMAXVALUE
    NOCYCLE
    NOCACHE
    NOORDER;
    
select S1.currval from dual;
select S1.nextval from dual;
select S1.nextval from dual;

--3
CREATE SEQUENCE S2
    START WITH 10
    INCREMENT BY 10
    MAXVALUE 100
    NOCYCLE;

select S2.nextval from dual;
select S2.currval from dual;

--4
CREATE SEQUENCE S3
    START WITH 10
    INCREMENT BY -10
    MAXVALUE 10
    MINVALUE -100
    NOCYCLE
    ORDER;

select S3.nextval from dual;
select S3.currval from dual;

--5
CREATE SEQUENCE S4
    START WITH 10
    INCREMENT BY 1
    MINVALUE 10
    MAXVALUE 16
    CYCLE
    CACHE 5
    NOORDER;

select S4.nextval from dual;
select S4.currval from dual;

--6
select * from user_sequences

drop sequence S1;
drop sequence S2;
drop sequence S3;
drop sequence S4;

--7
CREATE TABLE T1 (
    N1 NUMBER(20),
    N2 NUMBER(20),
    N3 NUMBER(20),
    N4 NUMBER(20)
)
STORAGE (BUFFER_POOL KEEP)
CACHE;

insert into T1(N1, N2, N3, N4) values (S1.nextval, S2.nextval, S3.nextval, S4.nextval);
select * from T1;

drop table T1;

--8
CREATE CLUSTER ABC (
    X NUMBER(10),
    V VARCHAR2(12)
)
HASHKEYS 200;

drop cluster ABC;

--9
CREATE TABLE A (
    XA NUMBER(10),
    VA VARCHAR2(12),
    OTHER_COL_A VARCHAR2(50)
)
CLUSTER ABC (XA, VA);

--10
CREATE TABLE B (
    XB NUMBER(10),
    VB VARCHAR2(12),
    OTHER_COL_B VARCHAR2(50)
)
CLUSTER ABC (XB, VB);

--11
CREATE TABLE C (
    XC NUMBER(10),
    VC VARCHAR2(12),
    OTHER_COL_C VARCHAR2(50)
)
CLUSTER ABC (XC, VC);

SELECT TABLE_NAME, CLUSTER_NAME
FROM USER_TABLES
WHERE CLUSTER_NAME = 'ABC';

drop table A;
drop table B;
drop table C;

--12
select * from user_tables
select * from user_clusters

--13
create synonym C_syn for MAI.C;
select * from C_syn;
INSERT INTO C_syn (XC, VC, OTHER_COL_C)
VALUES (1, 'Test', 'Доп. данные');
select * from C;

select * from ABC;

drop synonym C_syn

--14
create public synonym B_syn for MAI.B;
select * from B_syn;
INSERT INTO B_syn (XB, VB, OTHER_COL_B)
VALUES (11, 'Test2', 'Доп. данные22');
select * from B;

drop public synonym B_syn
--15
CREATE TABLE AA (
    ID_A NUMBER(10) PRIMARY KEY,
    NAME_A VARCHAR2(50)
);
CREATE TABLE BB (
    ID_B NUMBER(10) PRIMARY KEY,
    ID_A_REF NUMBER(10),
    VALUE_B VARCHAR2(50),
    CONSTRAINT FK_B_TO_A FOREIGN KEY (ID_A_REF) REFERENCES AA(ID_A)
);

drop table AA;
drop table BB;

INSERT INTO AA (ID_A, NAME_A) VALUES (1, 'ValA1');
INSERT INTO AA (ID_A, NAME_A) VALUES (2, 'ValA2');
INSERT INTO AA (ID_A, NAME_A) VALUES (3, 'ValA3');
INSERT INTO AA (ID_A, NAME_A) VALUES (4, 'ValA4');

INSERT INTO BB (ID_B, ID_A_REF, VALUE_B) VALUES (101, 1, 'ValB1');
INSERT INTO BB (ID_B, ID_A_REF, VALUE_B) VALUES (102, 2, 'ValB2');
INSERT INTO BB (ID_B, ID_A_REF, VALUE_B) VALUES (103, 1, 'ValB3');
INSERT INTO BB (ID_B, ID_A_REF, VALUE_B) VALUES (104, 1, 'ValB4');
INSERT INTO BB (ID_B, ID_A_REF, VALUE_B) VALUES (105, 1, 'testMatView');

select * from AA inner join BB on AA.ID_A = BB.ID_A_REF;

create view AABB as 
    select * from AA inner join BB on AA.ID_A = BB.ID_A_REF;
    
select * from AABB;
drop view AABB;

--16
create materialized view MV
refresh complete
start with sysdate
next sysdate + (1/11200) as 
select * from AA inner join BB on AA.ID_A = BB.ID_A_REF;

drop materialized view MV;


select * from MV
delete from BB where ID_B = 105;

EXEC DBMS_MVIEW.REFRESH('MV', 'C');
