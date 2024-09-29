# 🎉 Prize Bond Management System

This project is a **Prize Bond Management System** built with **Node.js** and **Express**, providing a comprehensive backend solution for managing prize bonds. The system supports different user roles (Guest, Broker, Admin) and includes features like prize bond addition, broker requests, winning bond verification, and automated notifications.

## 🚀 Features

### User Roles:
- **Guest**: 
  - Can register, add prize bonds, and submit a request to become a broker.
- **Broker**:
  - Can manage prize bonds after admin approval.
- **Admin**:
  - Manages users, approves broker requests, and uploads winning bond lists.

### Bond Management:
- Users (Guest and Broker) can add their prize bonds for potential winnings.
- Admin uploads a list of winning prize bonds for system-wide verification.
- **Automatic notification** of winners using scheduled cron jobs.

### Broker Request:
- Guests can request to become brokers.
- Admin reviews and approves or rejects these requests.

### Admin List Management:
- Admin uploads prize bond result lists.
- Lists are processed in the background using **Redis** and **Cron Jobs**.

## 🛠️ Technologies Used
- **Node.js**: JavaScript runtime for backend development.
- **Express**: Web framework for building REST APIs.
- **MongoDB** & **Mongoose**: NoSQL database and ORM for data management.
- **JWT**: For user authentication and session management.
- **Redis Cloud**: For caching and job queue management.
- **Bcrypt**: For securely hashing and storing user passwords.
- **Cron Jobs**: To schedule and process prize bond result checks at set intervals.

## 🔄 System Workflow

### User Authentication:
- Users register and authenticate via **JWT**.
- Passwords are encrypted using **Bcrypt** for security.

### Bond Addition:
- **Guests** and **Brokers** can add their prize bond numbers to their profile.
- Admins have oversight over all users and brokers.

### Broker Request and Approval:
- Guests can submit requests to become brokers.
- Admin reviews and approves/rejects broker requests, elevating the user's role to **Broker**.

### Prize Bond List Processing:
- Admin uploads prize bond result lists.
- The system processes the lists using **Cron Jobs**, checks them against user-submitted bonds, and notifies winners.

## ⚙️ How It Works

1. **Guest Registration**: Guests can sign up, add prize bonds, and request broker status.
2. **Admin Management**: Admins manage users, brokers, and upload winning bond lists.
3. **Background Job Processing**: Winning bond lists are processed in the background using **Redis** and **Cron Jobs**.
4. **Notification System**: Winners are automatically notified if their bonds are in the winning list.

## 🧰 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/prize-bond-system.git
