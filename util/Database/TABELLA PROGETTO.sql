CREATE TABLE utente (
  email 	varchar(45) primary key,
  name 		varchar(45),
  surname	varchar(45),
  password      varchar(60)
);

CREATE TABLE luoghi (
  città varchar(45),
  email varchar(45)
);


CREATE TABLE chat (
  id varchar(80) primary key,
  stato varchar(45),
  utente1 varchar(45),
  utente2 varchar(45)
);

