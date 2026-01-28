create table MAI_t(x number(3), s varchar2(50));

insert into MAI_t(x, s) values ( 100, 'Первый insert');
insert into MAI_t(x, s) values ( 101, 'Второй insert');
insert into MAI_t(x, s) values ( 102, 'Третий insert');
insert into MAI_t(x, s) values ( 103, 'Четвертый insert');
insert into MAI_t(x, s) values ( 104, 'Пятый insert');

Select * From MAI_t
commit

Update MAI_t Set s='Первый insert после update' where x = 100;
Update MAI_t Set s='Второй insert после update' where x = 101;
commit

select count(*) from MAI_t;
select min(x) from MAI_t;
select max(x) from MAI_t;

delete from MAI_t Where x=100;
select * from MAI_t;
commit

Alter table MAI_t add constraint add_pk primary key(x);
create table MAI_t1(x1 number(3) primary key, s1 number(3), y1 varchar2(50), foreign key (s1) references MAI_t(x));
insert into MAI_t1(x1, s1, y1) values ( 120, 100, 'Вторая таблица');
insert into MAI_t1(x1, s1, y1) values ( 121, 101, 'Вторая таблица');
insert into MAI_t1(x1, s1, y1) values ( 122, 102, 'Вторая таблица');

select * from MAI_t1
select * from MAI_t

select t.x, t.s, t1.x1, t1.s1, t1.y1 from MAI_t t inner join MAI_t1 t1 on t.x = t1.s1;
select t.x, t.s, t1.x1, t1.s1, t1.y1 from MAI_t t left join MAI_t1 t1 on t.x = t1.s1;
select t.x, t.s, t1.x1, t1.s1, t1.y1 from MAI_t t right join MAI_t1 t1 on t.x = t1.s1;


drop table MAI_t

