CREATE USER IF NOT EXISTS 'exampleUser'@'%' IDENTIFIED BY 'STRONG PASSWORD';
CREATE DATABASE whispernet;
GRANT ALL PRIVILEGES ON whispernet.* TO 'exampleUser'@'%' IDENTIFIED BY 'STRONG PASSWORD';