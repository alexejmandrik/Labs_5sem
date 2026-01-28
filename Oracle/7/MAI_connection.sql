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
