--1 MAI
SELECT SUM(value) AS "SGA Total (bytes)"
FROM v$sga;
--2 MAI
SELECT pool, name, bytes AS "Размер (байт)"
FROM v$sgastat
WHERE pool IS NOT NULL
--3 MAI
SELECT component AS "Компонент",
    granule_size AS "Размер гранулы (байт)"
FROM v$sga_dynamic_components;
--4 MAI
SELECT name AS "Название",
       bytes AS "Свободная память (байт)"
FROM v$sgastat
WHERE name = 'free memory';
--5 MAI
SELECT name AS "Параметр",
       value AS "Значение (байт)"
FROM v$parameter
WHERE name IN ('sga_max_size', 'sga_target');
--6 MAI
SELECT name AS "Пул буферного кэша",
       block_size,
       current_size AS "Размер (байт)"
FROM v$buffer_pool;
-- Добавил KEEP RECYCLE
ALTER SYSTEM SET db_keep_cache_size = 100M SCOPE=SPFILE;
ALTER SYSTEM SET db_recycle_cache_size = 50M SCOPE=SPFILE;

--7 MAI
CREATE TABLE TableInKEEP (id NUMBER PRIMARY KEY, data VARCHAR2(100)) STORAGE (BUFFER_POOL KEEP);
drop table TableInKEEP;

--8 MAI
CREATE TABLE TableInDefault (id NUMBER PRIMARY KEY, data VARCHAR2(100)) STORAGE (BUFFER_POOL DEFAULT);
drop table TableInDefault;

--9 MAI
SELECT name AS "Параметр",
       round(bytes / 1024 / 1024, 2) as "Размер (байт)"
FROM v$sgainfo
WHERE name = 'Redo Buffers';

--10MAI
SELECT ROUND(bytes / 1024 / 1024, 2) AS "Свободная память (МБ)"
FROM v$sgastat
WHERE pool = 'large pool'
  AND name = 'free memory';

--11 MAI
select username, program, server, status from V$SESSION where type = 'USER';

--12 MAI
SELECT spid as "OS Process ID", pname as "Process Name", program as "Program Path"
from V$PROCESS
where pname is not null;

--13 MAI
select spid as "OS Process ID", username, program
from V$PROCESS
where pname is null;

--14 MAI
select count(*) as "Count DBW Processes"
from V$PROCESS
WHERE pname like 'DBW%';

--15 MAI
select name as "Service Name"
from V$ACTIVE_SERVICES;

--16 MAI
SELECT name AS "Parameter Name",
       display_value AS "Value",
       description AS "Description"
FROM v$parameter;

--17 MAI
-- lsnrctl status

--18 MAI
-- /opt/oracle/homes/OraDBHome21cXE/network/admin -> cat listener.ora

--19 MAI
-- lsnrctl -> help 

--20 MAI
-- lsnrctl -> services