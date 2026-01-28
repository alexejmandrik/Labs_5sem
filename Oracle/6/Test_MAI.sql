--1
-- cd ./opt/oracle/oradata/dbconfig/XE
-- cat /opt/oracle/oradata/dbconfig/XE/tnsnames.ora
-- cat /opt/oracle/oradata/dbconfig/XE/sqlnet.ora

--2
-- sqlplus system/MyStrongPassw0rd@XE
SELECT name, value FROM v$parameter;

--3
alter session set container = XEPDB1
select * from dba_tablespaces;
select * from dba_data_files;
select * from dba_roles;
select * from dba_users;

--4
--Пояснить про HKEY_LOCAL_MACHINE/SOFTWARE/ORACLE 

--5
bash-4.4$ cd ../
bash-4.4$ cd ./opt/oracle/oradata/dbconfig/XE
bash-4.4$ cat /opt/oracle/oradata/dbconfig/XE/tnsnames.ora

bash-4.4$sqlplus / as sysdba

SQL> Create pluggable database CPMAI
admin user admin_cp identified by 1234
file_name_convert=('/opt/oracle/oradata/XE/pdbseed/','/opt/oracle/oradata/XE/CPMAI/');

SQL> alter pluggable database CPMAI open;

SQL> alter session set container = CPMAI;

SQL> create user MAI identified by 1234;

SQL> grant create session to MAI;
SQL> grant create table to MAI;
SQL> grant create view to MAI;
SQL> ALTER USER MAI QUOTA UNLIMITED ON SYSTEM;


GRANT CREATE SEQUENCE TO MAI;
GRANT CREATE CLUSTER TO MAI;
GRANT CREATE SYNONYM TO MAI;
GRANT CREATE PUBLIC SYNONYM TO MAI;
GRANT CREATE MATERIALIZED VIEW TO MAI;
GRANT CREATE JOB TO MAI;
GRANT QUERY REWRITE TO MAI;
GRANT SELECT ANY DICTIONARY TO MAI;


SQL> exit

--6
sqlpus MAI/1234@CPMAI;

--8
set timing on;

--11
CREATE OR REPLACE VIEW Segments_Info AS
SELECT
  COUNT(*) AS segment_count,
  SUM(extents) AS total_extents,
  SUM(blocks) AS total_blocks,
  ROUND(SUM(bytes)/1024, 2) AS total_kbytes
FROM user_segments;
