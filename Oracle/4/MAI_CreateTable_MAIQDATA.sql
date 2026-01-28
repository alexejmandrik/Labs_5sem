create table Banany(x int primary  key, y int)
insert into Banany(x,y) values (1, 2);
insert into Banany(x,y) values (4, 5);
insert into Banany(x,y) values (6, 7);

select * from Banany;
drop table Banany

select * from USER_RECYCLEBIN

--5 MAI
Flashback table Banany to before drop

--7
BEGIN
    FOR i IN 7..10000 LOOP
        INSERT INTO Banany (x,y)
        VALUES (i, TRUNC(DBMS_RANDOM.VALUE(1, 1000)));
    END LOOP;
    COMMIT;
END;

--8 MAI
SELECT 
    COUNT(*) AS EXTENT_COUNT,
    SUM(BLOCKS) AS TOTAL_BLOCKS,
    SUM(BYTES) AS TOTAL_BYTES
FROM USER_EXTENTS
WHERE SEGMENT_NAME = 'BANANY';

