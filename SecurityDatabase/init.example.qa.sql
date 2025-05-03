CREATE USER IF NOT EXISTS 'whispernet'@'%' IDENTIFIED BY 'userPassword';
CREATE DATABASE whispernet;
GRANT ALL PRIVILEGES ON whispernet.* TO 'userName'@'%' IDENTIFIED BY 'userPassword';