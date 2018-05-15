create table markerList(
	id int auto_increment primary key not null,
	lng double,
	lat double,
	label varchar(20),
	description varchar(100)
)