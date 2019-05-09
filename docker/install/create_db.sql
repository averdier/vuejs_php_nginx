create table clients
(
	id int auto_increment,
	username varchar(32) not null,
	password_hash varchar(255) not null,
	constraint clients_pk
		primary key (id)
);

create unique index clients_username_uindex
	on clients (username);

INSERT INTO clients (username, password_hash) VALUES ('rastadev', '$2y$10$GXY0kkfnuw1vgehVdImZNuUF8CGC4oTovQ6um3f0svWRMSj.HXtpS');