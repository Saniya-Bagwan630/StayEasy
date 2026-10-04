# StayEasy — Hotel Booking Application

StayEasy is a lightweight, clean, full-stack Hotel Booking web application built for a college DevOps / Kubernetes CIE exam demonstration. It illustrates containerization with Docker and container orchestration using Kubernetes on Minikube.

---

## 1. Project Description

StayEasy allows users to browse curated hotels across popular Indian tourist destinations, search by city or hotel name, view detailed room information, book stays, and manage existing reservations without requiring complex logins or payment gateways.

The application is decoupled into two clean tiers:
- **Frontend**: A React Single Page Application (SPA) bundled with Vite and served via an Nginx reverse-proxy container.
- **Backend**: A Node.js & Express REST API using in-memory data structures.

---

## 2. Features

- **Home / Explore Page**:
  - Search bar to filter hotels by name or city in real-time.
  - Cards displaying hotel name, city badge, star rating, price per night, and thumbnail.
  - "View Details" navigation.
- **Hotel Details & Booking Page**:
  - Full hotel description and available room types.
  - Interactive booking form with date pickers (check-in, check-out) and guest count.
  - Automatic live calculation of nights and total price.
  - Instant booking confirmation alert with summary.
- **My Bookings Page**:
  - Overview of all reserved bookings.
  - Status badges (`Confirmed` / `Cancelled`).
  - Ability to cancel any booking with status immediately updating to `Cancelled`.
- **DevOps & Cloud-Native Ready**:
  - Multi-stage Docker build for frontend (Node.js build -> Alpine Nginx).
  - Production-ready Dockerfile for Express backend.
  - Kubernetes Deployment and Service YAML manifests for local Minikube deployment.
  - Frontend Nginx proxy communicates seamlessly with Kubernetes backend Service (`backend-service:5000`).

---

## 3. Technology Stack

- **Frontend**: React 18, React Router v6, Vite, Plain CSS (Responsive design, modern typography).
- **Backend**: Node.js, Express, CORS.
- **Database**: In-memory static array (no external database required).
- **Web Server / Reverse Proxy**: Nginx (Alpine) inside frontend container.
- **Containerization**: Docker.
- **Orchestration**: Kubernetes (Minikube).

---

## 4. Folder Structure

```text
hotel-booking/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingCard.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── HotelCard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── HotelDetails.jsx
│   │   │   └── MyBookings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
│
├── .gitignore
└── README.md
```

---

## 5. How to Run Locally (Without Docker)

You will need **Node.js** (v18+) installed.

### Step 1: Start the Backend

Open a terminal:
```bash
cd backend
npm install
npm run dev
# Backend will start on http://localhost:5000
```

### Step 2: Start the Frontend

Open a second terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend will start on http://localhost:3000
```

Open your browser and navigate to `http://localhost:3000`.

---

## 6. How to Build Docker Images

### Option A: If Deploying to Minikube (Recommended)

To allow Minikube to see your local Docker images directly without pushing to Docker Hub, point your local terminal to Minikube's internal Docker daemon:

```bash
# In PowerShell:
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Or in Git Bash / Linux:
eval $(minikube docker-env)
```

Then build images:
```bash
# 1. Build Backend Image
docker build -t stayeasy-backend:latest ./backend

# 2. Build Frontend Image
docker build -t stayeasy-frontend:latest ./frontend

# 3. Verify images are present
docker images
```

### Option B: Standalone Docker Run

If you want to run both containers with Docker directly:

```bash
# Create a user-defined bridge network
docker network create stayeasy-net

# Run backend container
docker run -d --name stayeasy-backend --network stayeasy-net -p 5000:5000 stayeasy-backend:latest

# Run frontend container
docker run -d --name stayeasy-frontend --network stayeasy-net -p 80:80 stayeasy-frontend:latest
```

---

## 7. How to Start Minikube

Ensure Docker Desktop is running, then run:

```bash
minikube start --driver=docker
```

Check cluster status:
```bash
minikube status
```

---

## 8. How to Deploy to Kubernetes

From the root `hotel-booking/` directory:

```bash
# 1. Apply all Kubernetes manifests
kubectl apply -f k8s/

# 2. Verify deployments
kubectl get deployments

# 3. Verify running pods
kubectl get pods

# 4. Verify services
kubectl get services
```

Expected output:
```text
NAME                                  READY   STATUS    RESTARTS   AGE
pod/backend-deployment-xxxxx-xxxxx    1/1     Running   0          30s
pod/frontend-deployment-xxxxx-xxxxx   1/1     Running   0          30s

NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
backend-service    ClusterIP   10.100.12.34     <none>        5000/TCP       30s
frontend-service   NodePort    10.100.56.78     <none>        80:30080/TCP   30s
```

---

## 9. Useful Kubernetes Commands

| Action | Command |
| :--- | :--- |
| View all resources | `kubectl get all` |
| View pods | `kubectl get pods` |
| View services | `kubectl get services` |
| Check backend logs | `kubectl logs -l app=stayeasy-backend` |
| Check frontend logs | `kubectl logs -l app=stayeasy-frontend` |
| Describe a pod (for debugging) | `kubectl describe pod <pod-name>` |
| Restart a deployment | `kubectl rollout restart deployment frontend-deployment` |
| Delete all resources | `kubectl delete -f k8s/` |

---

## 10. How to Access the Application

Because `frontend-service` is exposed as a `NodePort`, Minikube provides a convenient command to launch or output the accessible URL:

```bash
minikube service frontend-service
```

This will automatically open the application in your default browser at a URL like `http://127.0.0.1:<random-port>` or `http://<minikube-ip>:30080`.

Alternatively, get the URL directly:
```bash
minikube service frontend-service --url
```

---

## Architecture: How Frontend ➔ Backend ➔ Kubernetes Works

1. **User Request**: The user opens the frontend URL in their web browser.
2. **Serving Assets**: Minikube routes traffic to the `frontend-service` (NodePort: 30080), which directs requests to the Nginx container inside the `frontend-deployment` pod. Nginx returns the React HTML, JS, and CSS files.
3. **API Routing**: When the user searches for hotels or books a room, the React application makes an HTTP request to `/api/hotels` or `/api/bookings`.
4. **Reverse Proxy (Nginx)**: The Nginx web server inside the frontend pod catches all `/api/*` traffic and forwards it internally to `http://backend-service:5000/api/*`.
5. **Cluster DNS Resolution**: Kubernetes internal DNS resolves `backend-service` to the `ClusterIP` of the backend Service, which balances traffic to the Express container running inside the `backend-deployment` pod.
6. **Response**: The Express server processes the booking in-memory and sends back JSON, which traverses back to the React UI for rendering.
