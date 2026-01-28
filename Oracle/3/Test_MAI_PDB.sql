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
    
Select File_name, tablespace_name, status from DBA_DATA_FILES
union
Select File_name, tablespace_name, status from DBA_TEMP_FILES;

Create role RL_MAICORE;
Grant create session, 
      create table, 
      create view,
      create procedure to RL_MAICORE;
      
drop role RL_MAICORE 
      
Select * from DBA_ROLES where role like 'RL_MAICORE';
Select * from DBA_SYS_PRIVS where GRANTEE = 'RL_MAICORE';

Create profile PF_MAICORE limit
    password_life_time 180
    sessions_per_user 3
    failed_login_attempts 7
    password_lock_time 1
    password_grace_time default
    connect_time 180
    idle_time 30;
    
drop profile PF_MAICORE cascade
    
Select distinct profile from DBA_Profiles;
Select * from DBA_Profiles Where Profile = 'PF_MAICORE';
Select * from DBA_Profiles Where Profile = 'DEFAULT';

ALTER SESSION SET CONTAINER = CDB$ROOT;
ALTER SESSION SET CONTAINER = XEPDB1;
SHOW CON_NAME;

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
 
create table Banany(x int)
insert into Banany(x) values (1);
insert into Banany(x) values (4);

select * from banany;