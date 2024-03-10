-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pfp INT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    Rating INT DEFAULT 0,
    phone_number VARCHAR(10) NOT NULL
);
CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uploader_id INT,
    pathOriginal VARCHAR(255),
    pathThumbnail VARCHAR(255),
    pathMedium VARCHAR(255),
    file_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);


-- Create the listings table
CREATE TABLE listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    images JSON NULL,
    location VARCHAR(255) NULL,
    suggested_minimum_bid FLOAT NOT NULL,
    description TEXT NOT NULL,
    ext_link VARCHAR(255) NULL,
    creator_id INT NOT NULL,
    availability VARCHAR(50) DEFAULT 'available',
    highest_bid FLOAT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- Create the listing_category table
CREATE TABLE listing_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NULL,
    category VARCHAR(255) NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);

-- Create the offers table
CREATE TABLE offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount FLOAT NOT NULL,
    validity_duration INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    listing_id INT NULL,
    bidder_id INT NULL,
    accepted TINYINT(1) NULL,
    is_valid TINYINT(1) DEFAULT 1,
    owner_id INT NULL,
    transaction_id INT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (bidder_id) REFERENCES users(id)
);

-- Create the transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    offer_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_transaction_complete TINYINT(1) DEFAULT 0,
    buyer_transaction_complete TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    listing_id INT NOT NULL,
    FOREIGN KEY (offer_id) REFERENCES offers(id),
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);