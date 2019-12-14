DROP TABLE IF EXISTS titanic_data;
DROP TABLE IF EXISTS age_data;

CREATE TABLE titanic_data (
    pclass INT,
    survived INT,
    name VARCHAR(200),
    sex	VARCHAR(1),
    age INT,
    sibsp INT,
    parch INT,	
    ticket VARCHAR(20),
    fare INT,	
    cabin VARCHAR(20),
    embarked VARCHAR(1),
	boat INT,
    body INT,
    home.dest VARCHAR(200)
);

CREATE TABLE age_data (
    id	INT PRIMARY KEY,
    age	INT,
    total_onboard INT,
    survivors INT,
    deceased INT,
    percent_s INT,
    percent_d INT
);

CREATE TABLE age_data_binned (
    id	INT PRIMARY KEY,
    age	VARCHAR(10),
    total_onboard INT,
    survivors INT,
    deceased INT,
    percent_s INT,
    percent_d INT
);

COPY titanic_data(pclass,survived,name,sex,age,sibsp,parch,ticket,fare,cabin,embarked,boat,body,home.dest) 
FROM 'FILE PATH\titanic.csv' csv delimiter ',' header
;

COPY age_data(id,age,total_onboard,survivors,deceased,percent_s,percent_d) 
FROM 'FILE PATH\ages.csv' csv delimiter ',' header
;

COPY age_data_binned(id,age,total_onboard,survivors,deceased,percent_s,percent_d) 
FROM 'FILE PATH\binned_ages.csv' csv delimiter ',' header
;