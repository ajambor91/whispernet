CREATE USER IF NOT EXISTS 'exampleUser'@'%' IDENTIFIED BY '3x@mplePassword';
CREATE DATABASE cms;
GRANT ALL PRIVILEGES ON cms TO 'exampleUser'@'cms';