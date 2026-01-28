create table Test_Table(x int, y int)
drop table Test_Table;

create view Test_View as  Select * from Test_Table where y > 10;

create table MAI_t111 (id int, text varchar2(30)) tablespace MAI_QDATA;
drop table MAI_t111;
Insert into MAI_t111 (id, text) values (1, 'a');
Insert into MAI_t111 (id, text) values (2, 'b');
Insert into MAI_t111 (id, text) values (3, 'c');

