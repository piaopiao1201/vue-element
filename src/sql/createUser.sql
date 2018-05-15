create table users (
	id int auto_increment primary key not null,
	user varchar(20) comment '用户名',
	password varchar(50) comment '密码'
);

create table userInfo (
	id int auto_increment primary key not null,
	user varchar(20) comment '用户名',
	province varchar(20) comment '省份',
	city varchar(20) comment '城市',
	lng double comment '纬度',
	lat double comment '经度',
	academy varchar(20) comment '学院'
);

create table lostInfo (
	id int auto_increment primary key not null,
	name varchar(20) comment '物品名称',
	description varchar(50) comment '描述',
	lng double comment '纬度',
	lat double comment '经度',
	imgUrl varchar(80) comment '图片绝对地址',
	time bigint comment '时间戳'
);