CREATE USER IF NOT EXISTS 'exampleUser'@'%' IDENTIFIED BY '3x@mplePassword';
CREATE DATABASE whispernet;
GRANT ALL PRIVILEGES ON whispernet.* TO 'exampleUser'@'%' IDENTIFIED BY '3x@mplePassword';