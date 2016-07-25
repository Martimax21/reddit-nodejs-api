-- This creates the users table. The username field is constrained to unique
-- values only, by using a UNIQUE KEY on that column
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(60) NOT NULL, -- why 60??? ask me :)
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- This creates the posts table. The userId column references the id column of
-- users. If a user is deleted, the corresponding posts' userIds will be set NULL.
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE posts ADD COLUMN subredditId INT;

CREATE TABLE subreddits (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE,
  description VARCHAR(200),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

INSERT into subreddits(name, description) VALUES ("Default","This is the value for the posts created early");

INSERT into posts(subredditId) VALUES (10) 
  WHERE subredditId IS NULL;
  
UPDATE posts
  SET subredditId=10
  WHERE subredditId IS NULL;
  
CREATE TABLE comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  text TEXT(10000), 
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME,
  userId INT,
  postId INT,
  parentId INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (postId) REFERENCES posts(id),
  FOREIGN KEY (parentId) REFERENCES comments(id)
);

//Ziad's version has foreign key on parentId (we didnt do that)

//ALTER TABLE comments DROP comment_ibfk_1; (to drop foreign key)

CREATE TABLE votes (
  postId INT,
  userId INT,
  vote TINYINT,
  PRIMARY KEY (userId, postId),
  FOREIGN Key (postId) REFERENCES posts(id),
  FOREIGN Key (userId) REFERENCES users(id)
);