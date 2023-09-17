CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    email VARCHAR(255),
    password VARCHAR(20),
    status VARCHAR(20),
    role VARCHAR(20),
    UNIQUE (email)
);
user (email, password, status, role) VALUES ('admin@gmail.com', 'xyz333', 'true', 'admin');

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    email VARCHAR(255),
    password VARCHAR(20),
    status VARCHAR(20),
    role VARCHAR(20),
    UNIQUE (email)
)

CREATE TABLE category (
  categoryId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  Pname VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  PlastName VARCHAR(255) NOT NULL,
  fatherFulName VARCHAR(255) NOT NULL,
  grandFatherName VARCHAR(255) NOT NULL,
  familyName VARCHAR(255) NOT NULL,
  cnic VARCHAR(255) NOT NULL,
  dob VARCHAR(255) NOT NULL,
  Pdob VARCHAR(255) NOT NULL,
  placeOfBirth VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  village VARCHAR(255) NOT NULL,
  countryofResidence VARCHAR(255) NOT NULL,
  otherNationalities VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,  
  children VARCHAR(255) NOT NULL,
  hieght VARCHAR(255) NOT NULL,
  materialStatus VARCHAR(255) NOT NULL,
  hairColurs VARCHAR(255) NOT NULL,
  eyeColor VARCHAR(255) NOT NULL,
  currentAddress VARCHAR(255) NOT NULL,
  previousAddress VARCHAR(255) NOT NULL,
  emailAddress VARCHAR(255) NOT NULL,
  mobileAddress INT NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (categoryId),
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);


CREATE TABLE files (
  filesId INT NOT NULL AUTO_INCREMENT,
  path VARCHAR(255) NOT NULL,
  docxFullUrl VARCHAR(255),
  occupation VARCHAR(255) NOT NULL,
  employeer VARCHAR(255) NOT NULL,
  employeerAddrees VARCHAR(255) NOT NULL,
  previousEmplyeer VARCHAR(255),
  previousEmplyeerAddress VARCHAR(255),
  passportType VARCHAR(255) NOT NULL,
  jobTitle VARCHAR(255),
  havePassport VARCHAR(255),
  previousPassport VARCHAR(255),
  issueDate VARCHAR(255),
  expiryDate VARCHAR(255),
  haveCriminal VARCHAR(255) NOT NULL,
  passportDetails VARCHAR(255),
  userId INT NOT NULL,
  categoryId INT NOT NULL,
  PRIMARY KEY (filesId),
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES category(categoryId) ON DELETE CASCADE
);




          
          
          
          
          
          
          
          
          
          
          




