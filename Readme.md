This is Backend on Prize Bond using Node.js
This project is a Prize Bond Management System built with Node.js and Express, providing a backend solution for managing prize bonds. The system supports different user roles such as Guest, Broker, and Admin. Users can add their prize bonds, request broker status, and admins can upload winning bond lists for verification. The system also integrates job processing, authentication, and encryption for security and scalability.

Features
User Roles:

Guest: Can register, add prize bonds, and submit a request to become a broker.
Broker: Can manage prize bonds after admin approval.
Admin: Manages users, approves broker requests, and uploads winning bond lists.
Bond Management:

Users (Guests and Brokers) can add their prize bonds.
Admin uploads a list of winning prize bonds for system-wide verification.
Automatic notification of winners using cron jobs.
Broker Request:

Users can request to be a broker.
Admin reviews and approves/rejects these requests.
Admin List Management:

Admin can upload prize bond result lists, which are processed in the background using Redis and Cron Jobs.
Technologies Used
Node.js: JavaScript runtime for backend development.
Express: Web framework for building REST APIs.
MongoDB & Mongoose: NoSQL database and ORM for data management.
JWT: For user authentication and session management.
Redis Cloud: For caching and job queue management.
Bcrypt: For securely hashing and storing user passwords.
Cron Jobs: To schedule and process prize bond result checks at set intervals.
System Workflow
User Authentication:

Users register and authenticate via JWT.
Passwords are encrypted using Bcrypt for security.
Bond Addition:

Users (Guest and Broker) can add their prize bond numbers to their profile.
Admins have oversight of all users and brokers.
Broker Request and Approval:

Guests can submit requests to become brokers.
Admin can review and approve broker requests, elevating the user's role to Broker.
Prize Bond List Processing:

Admin uploads prize bond result lists.
The system processes the lists using Cron Jobs, checks them against user-submitted bonds, and notifies winners.