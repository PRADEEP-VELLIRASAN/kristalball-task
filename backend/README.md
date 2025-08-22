# Military Asset Management System

A full-stack web application for managing military assets, assignments, purchases, requests, and transfers. The system provides a secure login, user authentication, and a modern dashboard for tracking and managing assets efficiently.

---

## Features

- **User Authentication:** Secure login and JWT-based authentication.
- **Asset Dashboard:** Visualize and manage military assets with charts and metrics.
- **Assignments Management:** Assign assets to personnel and track assignments.
- **Purchases & Expenditures:** Record and manage asset purchases and expenditures.
- **Requests & Transfers:** Submit, approve, and track asset requests and transfers.
- **Recent Activity Feed:** View the latest actions and changes in the system.
- **Responsive UI:** Modern, mobile-friendly interface built with Next.js and Tailwind CSS.

---

## Tech Stack

**Frontend:**
- Next.js (React)
- TypeScript
- Tailwind CSS

**Backend:**
- Node.js
- Express.js
- TypeScript
- JWT for authentication

---

## How to Run the Project

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- (Optional) MongoDB or another database if you extend backend data storage

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/military-asset-management.git
cd military-asset-management
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
pnpm install
```

#### Backend

```bash
cd ../backend
pnpm install
```

### 3. Run the Development Servers

#### Backend

```bash
pnpm run dev
```

#### Frontend

Open a new terminal:

```bash
cd client
pnpm dev
```

### 4. Access the App

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000) (default)

---

## Customization

- Update backend `.env` for JWT secrets and database connection.
- Extend models and routes as needed for more asset types or features.

---

## License

MIT

---

**Contributions