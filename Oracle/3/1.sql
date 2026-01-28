show con_name;
--1
SELECT PDB_NAME, STATUS FROM CDB_PDBS;
SELECT NAME, OPEN_MODE, RESTRICTED FROM V$PDBS;

--2
SELECT * FROM v$instance; 

--3
SELECT comp_name, version, status FROM dba_registry

--4
Create pluggable database MAI_PDB 
admin user pdb_admin identified by 123
file_name_convert=('/opt/oracle/oradata/XE/pdbseed/','/opt/oracle/oradata/XE/MAI_PDB/');

alter pluggable database MAI_PDB open;

--5
SELECT NAME, OPEN_MODE, RESTRICTED FROM V$PDBS;

--6
alter session set container = MAI_PDB;
show con_name;

Create tablespace TS_MAI
    DATAFILE 'D:\Labs5\Oracle\3\tablespaces\TS_MAI.dbf'
    size 7m
    autoextend on next 5m
    maxsize 20m
    extent management local;
    
DROP TABLESPACE TS_MAI INCLUDING CONTENTS AND DATAFILES;

Create temporary tablespace TS_MAI_TEMP
    tempfile 'D:\Labs5\Oracle\3\tablespaces\TS_MAI_TEMP.dbf'
    size 5m
    autoextend on next 3m
    maxsize 30m
    extent management local;
    
DROP TABLESPACE TS_MAI_TEMP INCLUDING CONTENTS AND DATAFILES;

Create role RL_MAICORE;
Grant create session, 
      create table, 
      create view,
      create procedure to RL_MAICORE;
      
drop role RL_MAICORE 

Create profile PF_MAICORE limit
    password_life_time 180
    sessions_per_user 3
    failed_login_attempts 7
    password_lock_time 1
    password_grace_time default
    connect_time 180
    idle_time 30;
    
drop profile PF_MAICORE cascade

Create user MAICORE identified by 12345
default tablespace TS_MAI quota unlimited on TS_MAI
temporary tablespace TS_MAI_TEMP
profile PF_MAICORE
account unlock;

Drop user MAICORE cascade;

Grant create session, 
      create table, 
      create view,
      create procedure to MAICORE;
      

--7
create table Banany(x int)
drop table Banany
insert into Banany(x) values (1);
insert into Banany(x) values (4);

select * from banany;

--8
select * from dba_tablespaces;
select * from dba_data_files;
select * from dba_roles where ROLE like 'MAI%';
select * from dba_sys_privs where GRANTEE like 'MAI%';
select * from dba_profiles where PROFILE like '%MAI%';
select * from dba_users where USERNAME like 'MAI%';

--9
alter session set container = cdb$root;
show con_name;

create user C##MAI identified by 123;

Drop user C##MAI cascade;

grant connect, 
    create session, 
    alter session, 
    create any table,
    drop any table,
    SYSDBA
to C##MAI container = all;

ALTER PLUGGABLE DATABASE MAI_PDB CLOSE IMMEDIATE;
drop pluggable database MAI_PDB including datafiles;
    