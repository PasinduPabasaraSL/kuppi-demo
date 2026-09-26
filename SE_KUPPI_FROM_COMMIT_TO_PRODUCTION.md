# SE Kuppi: From Commit to Production

> **This document is designed to be followed live during the SE Kuppi. When a command is marked LOCAL, EC2, or MINIKUBE, run it in that environment only. Replace all placeholders before execution.**

| Placeholder | Meaning | Example |
| --- | --- | --- |
| `YOUR_USERNAME` | Your GitHub username | `rootcypher` |
| `ACCOUNT_ID` | Your 12-digit AWS account ID | never invent this |
| `YOUR_EC2_PUBLIC_IP` | Public IPv4 of the EC2 instance | `13.229.x.x` |
| `YOUR_KEY.pem` | Path to your EC2 SSH key file | `~/Downloads/se-kuppi.pem` |
| `YOUR_AWS_REGION` | AWS region you choose | `ap-southeast-1` |

**Default region in this runbook:** `ap-southeast-1` (Singapore).  
You may replace it with another region if needed. Keep **one region** consistent across ECR, EC2, CLI, and CI/CD.

**Environment markers used below:**

| Marker | Where to run the command |
| --- | --- |
| `LOCAL MACHINE` | Your laptop / teaching machine |
| `GITHUB` | GitHub UI or Actions |
| `MINIKUBE` | After Minikube is started (local Kubernetes) |
| `ECR` | Against Amazon ECR (usually from LOCAL or CI) |
| `EC2` | SSH session on the Ubuntu EC2 instance |

**Dangerous / destructive commands** are marked with `DANGER`.

---

# 1. Cover / Session Overview

## Session title

**SE Kuppi: From Commit to Production**

## Topics

1. Git & GitHub  
2. Docker & Docker Compose  
3. CI/CD with GitHub Actions  
4. Kubernetes with Minikube (local only)  
5. AWS: Amazon ECR → Amazon EC2 → Docker / Docker Compose  

## Duration

**3 hours**

## Project description

One continuous project throughout the session:

- **React + Vite** frontend  
- **Node.js + Express.js** backend  
- Simple **Todo** application  
- Frontend also contains a **"Today's Kuppi Notes"** section  
- Backend uses an **in-memory Todo array**  
- **No database** is required  

The app is intentionally small so students can focus on the deployment pipeline, not application complexity.

## Final architecture (AWS path)

```text
                 ┌─────────────────┐
                 │    Developer    │
                 └────────┬────────┘
                          │
                       git push
                          ↓
                 ┌─────────────────┐
                 │     GitHub      │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │ GitHub Actions  │
                 │     CI/CD       │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │   Docker Build  │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │  Amazon ECR     │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │    AWS EC2      │
                 │ Docker Compose  │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │   Production    │
                 └─────────────────┘
```

## Separate local Kubernetes path (NOT on AWS)

```text
Docker Image
     ↓
   Minikube
     ↓
Kubernetes
     ↓
Deployment
     ↓
Pods
     ↓
Service
```

> **Architecture decision:** Do **not** run Kubernetes on AWS in this Kuppi.  
> Kubernetes is demonstrated **locally with Minikube**.  
> AWS deployment uses **ECR → EC2 → Docker / Docker Compose**.

## Overall story in one line

```text
Developer → Git → GitHub → GitHub Actions → CI/CD → Docker Images → Amazon ECR → AWS EC2 → Docker Compose → Production
```

## Learning objectives

By the end of this Kuppi, students should be able to:

1. Explain and use the Git working-directory → staging → commit → push workflow  
2. Build and run Docker images for frontend and backend  
3. Explain why `localhost` inside containers causes networking mistakes  
4. Run both services with Docker Compose  
5. Describe CI vs CD and inspect a GitHub Actions workflow  
6. Deploy the app to Minikube and demonstrate self-healing + scaling  
7. Push images to Amazon ECR and run them on EC2 with Docker Compose  
8. Explain why this Kuppi uses Minikube locally and EC2 (not EKS) on AWS  

---

# 2. 3-Hour Session Timeline

| Time | Topic | Activity |
| --- | --- | --- |
| 00:00–00:10 | Opening | Production story, architecture, learning goals |
| 00:10–00:45 | Git + GitHub | Live Git workflow, branch, PR, conflict |
| 00:45–01:20 | Docker | Dockerize application, networking, Compose |
| 01:20–01:55 | CI/CD | GitHub Actions CI, ECR story |
| 01:55–02:35 | Kubernetes | Minikube + Deployments + Pods + Services |
| 02:35–02:55 | AWS | ECR + EC2 + Compose |
| 02:55–03:00 | Final | Rapid-fire exam questions |

## Teaching method

Use this loop for every major topic:

```text
Explain
   ↓
Demonstrate
   ↓
Challenge students
   ↓
Break something
   ↓
Diagnose
   ↓
Fix
   ↓
Ask exam question
```

**Teaching note:** Prefer breaking one real thing (stop a container, delete a Pod, wrong port) over long slides. Diagnosis is the lesson.

---

# 3. Prerequisites

## Verify tools — `LOCAL MACHINE`

```bash
git --version
node --version
npm --version
docker --version
docker compose version
kubectl version --client
minikube version
aws --version
```

| Tool | Used for |
| --- | --- |
| `git` | Version control on your machine |
| `node` / `npm` | Run React and Express locally |
| `docker` | Build and run containers |
| `docker compose` | Multi-container local / EC2 orchestration |
| `kubectl` | Talk to Kubernetes clusters |
| `minikube` | Local single-node Kubernetes cluster |
| `aws` | AWS CLI for ECR, identity checks, and EC2-related tasks |

### Expected style of output

```text
git version 2.x.x
v22.x.x
10.x.x
Docker version 27.x.x
Docker Compose version v2.x.x
Client Version: v1.x.x
minikube version: v1.x.x
aws-cli/2.x.x
```

Exact versions may differ. If a command is missing, install that tool before the Kuppi.

**Teaching note:** Ask one student to read each `--version` output out loud. It confirms the teaching machine is ready and introduces the tool names early.

---

# 4. Project Structure

Expected project layout for this Kuppi:

```text
se-kuppi/
├── frontend/
│   ├── package.json
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── backend/
│   ├── package.json
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── compose.yaml
└── .gitignore
```

| Path | Purpose |
| --- | --- |
| `frontend/` | React + Vite UI, Todo demo, Kuppi notes, quiz |
| `backend/` | Express API, in-memory todos, `/api/health` |
| `k8s/` | Kubernetes manifests for Minikube demos |
| `.github/workflows/` | GitHub Actions CI/CD pipelines |
| `compose.yaml` | Multi-service Docker Compose definition |
| `.gitignore` | Prevents secrets and build junk from being committed |

**Teaching note:** Point at folders physically (or on screen) and say: “Code lives here. Pipeline lives here. Kubernetes lives here. Production images live in ECR, not in the repo.”

---

# 5. Run Application Locally

## Start backend — `LOCAL MACHINE`

```bash
cd backend
npm install
npm start
```

Expected:

```text
se-kuppi-backend listening on http://localhost:5000
```

Verify health:

```bash
curl http://localhost:5000/api/health
```

Expected JSON:

```json
{"status":"ok","service":"se-kuppi-backend"}
```

List todos:

```bash
curl http://localhost:5000/api/todos
```

## Start frontend — `LOCAL MACHINE` (second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open the browser:

```text
http://localhost:5173
```

## What each piece does

| Piece | Role |
| --- | --- |
| Frontend | Browser UI (Vite on port `5173`) |
| Backend | REST API (Express on port `5000`) |
| API | JSON over HTTP |
| `/api/todos` | CRUD for the in-memory Todo list |
| `/api/health` | Simple readiness / status check |

## Frontend ↔ backend communication

```text
Browser (localhost:5173)
        │
        │  fetch()
        ▼
Express API (localhost:5000)
        │
        ▼
In-memory todos array
```

The frontend calls the backend using `VITE_API_URL` (defaulting to `http://localhost:5000` when unset).

Relevant idea from the app:

```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## Local troubleshooting

| Symptom | Check | Fix |
| --- | --- | --- |
| Frontend loads, todos fail | Is backend running? | `curl http://localhost:5000/api/health` |
| `EADDRINUSE` | Port already taken | Stop the other process or change port |
| CORS errors | Backend CORS middleware | Ensure backend has `cors()` enabled |
| Blank / wrong API | Wrong `VITE_API_URL` | Restart Vite after changing env values |
| `npm` install fails | Node version / network | Confirm `node --version`, retry install |

**Teaching note:** Before Docker, prove the app works locally. Students must see green “backend ok” before containers exist.

---

# 6. Git Fundamentals

## Simple definitions

| Term | Meaning |
| --- | --- |
| Git | Local version control tool |
| GitHub | Hosted collaboration platform for Git repositories |
| Repository | Project history + files tracked by Git |
| Working directory | Files you currently edit |
| Staging area | Snapshot you prepare for the next commit |
| Commit | Saved checkpoint in local history |
| Branch | Parallel line of development |
| Remote | Copy of the repo elsewhere (usually GitHub) |
| Push | Send local commits to remote |
| Pull | Fetch + integrate remote commits into local branch |
| Pull Request | Request to merge one branch into another on GitHub |
| Merge | Combine histories |

## Mental model

```text
Working Directory
       ↓ git add
Staging Area
       ↓ git commit
Local Repository
       ↓ git push
GitHub
```

## Initial setup — `LOCAL MACHINE`

```bash
git init
git status
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/se-kuppi.git
git remote -v
git push -u origin main
```

### Proper `.gitignore`

Create or verify `.gitignore`:

```gitignore
node_modules/
.env
dist/
build/
*.log
.DS_Store
```

Never commit secrets, dependency folders, or build output.

## Normal Git workflow — `LOCAL MACHINE`

```bash
git status
git add .
git commit -m "Describe why this change exists"
git push
```

## Branch workflow — `LOCAL MACHINE`

```bash
git switch -c feature/add-todo-filter
# make changes
git status
git add .
git commit -m "Add todo filter on frontend"
git push -u origin feature/add-todo-filter
```

## Pull Request workflow — `GITHUB`

1. Open GitHub repository  
2. Compare & pull request  
3. Review the diff  
4. Merge into `main`  
5. Locally update:

```bash
git switch main
git pull
```

## Merge conflict demonstration — `LOCAL MACHINE`

Create a conflict intentionally:

```bash
git switch -c conflict-demo
# edit the same line in a file
git add .
git commit -m "Change A"

git switch main
# edit the same line differently
git add .
git commit -m "Change B"

git merge conflict-demo
```

Conflict markers look like:

```text
<<<<<<< HEAD
your main change
=======
branch change
>>>>>>> conflict-demo
```

Resolve by editing the file, then:

```bash
git add <resolved-file>
git commit -m "Resolve merge conflict"
```

## Undo / change commands — `LOCAL MACHINE`

```bash
# Unstage a file (keep edits)
git restore --staged <file>

# Discard unstaged edits in a tracked file (DANGER: loses uncommitted work)
git restore <file>

# Amend only if commit is local, not pushed, and you intend to rewrite it
git commit --amend -m "Better message"

# Soft undo last commit, keep changes staged
git reset --soft HEAD~1
```

## Useful inspection commands

```bash
git status
git log --oneline
git branch
git switch main
git diff
git remote -v
git fetch
git pull
git push
```

## Git stash (park unfinished work)

```bash
git stash push -m "New tax rules"
git stash list
git stash show stash@{0}
git stash apply stash@{0}
git stash pop
```

**Explain stash simply:**  
Stash temporarily shelves unfinished work so you can switch branches cleanly.  
`apply` keeps the stash entry; `pop` applies and removes it.

**Teaching note:** Live-demo one conflict. Students remember conflict resolution more than theory.

---

# 7. Docker Fundamentals

## Why Docker?

Students often say:

> “It works on my machine.”

Docker packages the app + runtime so it runs the same way on:

- your laptop  
- CI runners  
- Minikube  
- EC2  

## Core terms

| Term | Meaning |
| --- | --- |
| Image | Immutable package / template |
| Container | Running instance of an image |
| Dockerfile | Recipe to build an image |
| Registry | Place to store images (Docker Hub, ECR) |
| Port mapping | Expose container ports on the host |
| Networking | How containers talk to each other / host |
| Environment variables | Runtime config passed into containers |

```text
Dockerfile
    ↓
Docker Image
    ↓
Docker Container
```

## Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## Frontend Dockerfile (Vite development-style demo)

Create `frontend/Dockerfile` for this Kuppi demo style:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

> **Important distinction:**  
> This frontend Dockerfile runs the **Vite development server** inside a container for teaching.  
> A real production frontend usually builds static files and serves them with **Nginx** (multi-stage build).  
> Section 35 compares Kuppi demo vs production.

`--host 0.0.0.0` is required so the container accepts traffic from outside itself.

## Build images — `LOCAL MACHINE`

```bash
docker build -t se-kuppi-backend ./backend
docker build -t se-kuppi-frontend ./frontend
```

List images:

```bash
docker images
```

## Run containers — `LOCAL MACHINE`

```bash
docker run -d \
  --name se-kuppi-backend \
  -p 5000:5000 \
  se-kuppi-backend
```

```bash
docker run -d \
  --name se-kuppi-frontend \
  -p 5173:5173 \
  se-kuppi-frontend
```

### Port mapping explained

```text
-p HOST_PORT:CONTAINER_PORT
```

Example:

```text
-p 5000:5000
```

means:

- host machine port `5000`  
- forwards to container port `5000`

## Important Docker commands — `LOCAL MACHINE`

```bash
docker ps
docker ps -a
docker images
docker logs se-kuppi-backend
docker logs se-kuppi-frontend
docker exec -it se-kuppi-backend sh
docker inspect se-kuppi-backend
docker stop se-kuppi-backend
docker start se-kuppi-backend
docker restart se-kuppi-backend
docker rm se-kuppi-backend
docker rmi se-kuppi-backend
docker system df
```

Cleanup example:

```bash
docker stop se-kuppi-backend se-kuppi-frontend
docker rm se-kuppi-backend se-kuppi-frontend
```

**Teaching note:** After `docker run`, open browser + `curl`. Students must connect “container is running” with “service responds.”

---

# 8. Docker Networking

## Critical idea

```text
localhost inside a container
        ≠
host machine localhost
        ≠
another container's localhost
```

And:

```text
Container A localhost
        ≠
Container B localhost
```

Each container has its own network namespace. `localhost` means “this container only.”

## Three communication paths

| Path | Example | Correct target |
| --- | --- | --- |
| Browser → backend | Student opens UI in Chrome | Use host-mapped URL like `http://YOUR_EC2_PUBLIC_IP:5000` or `http://localhost:5000` on laptop |
| Host → container | `curl` from your laptop | Host port mapping (`-p`) |
| Container → container | Frontend container calling backend container by service name | Compose/K8s DNS name, **not** `localhost` |

## Why React `http://localhost:5000` fails after deployment

If the React code (or baked env) contains:

```text
http://localhost:5000
```

then:

- On your laptop during local demo, the **browser** may still reach the backend on your laptop.  
- On EC2 / another machine, the **user’s browser** tries `localhost` on the **user’s machine**, not the server.  
- That is a very common Kuppi failure.

## Vite and `VITE_API_URL`

Vite frontend env vars are normally **baked into the frontend build** at build time.

```text
VITE_API_URL=http://localhost:5000
```

If you later change an env var only at container start, a **static production build** will ignore it unless rebuilt.

For this Kuppi’s Vite **dev-server** Dockerfile, env handling is more flexible, but teach the production rule clearly:

> Frontend API URLs that use `VITE_*` are usually fixed at build time. Choose the correct public backend URL before building for a target environment.

**Teaching note:** Draw three boxes: Browser, Frontend container, Backend container. Ask: “Whose localhost?”

---

# 9. Docker Compose

## Complete `compose.yaml`

Create at project root:

```yaml
services:
  backend:
    build: ./backend
    container_name: se-kuppi-backend
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    container_name: se-kuppi-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

## Commands — `LOCAL MACHINE`

```bash
docker compose up --build
```

Builds images and starts both services.

```bash
docker compose ps
```

Shows running Compose services.

```bash
docker compose logs
```

Streams combined logs.

```bash
docker compose logs backend
docker compose logs frontend
```

Stop and remove Compose resources:

```bash
docker compose down
```

| Command | Meaning |
| --- | --- |
| `up --build` | Rebuild if needed, create/start containers |
| `ps` | Status of Compose services |
| `logs` | Inspect stdout/stderr |
| `down` | Stop and remove containers/network created by Compose |

## Challenge (break / diagnose)

> Stop the backend and ask students to diagnose why the Todo application stopped working.

```bash
docker stop se-kuppi-backend
```

Ask:

1. What symptoms do you see in the UI?  
2. Which command proves the backend is down?  
3. How do you restart it?

Possible checks:

```bash
docker ps
docker ps -a
curl http://localhost:5000/api/health
docker start se-kuppi-backend
```

---

# 10. CI/CD Fundamentals

## Definitions

| Term | Meaning |
| --- | --- |
| CI | Continuous Integration — automatically validate every change |
| Continuous Integration | Build/test on every push/PR |
| CD | Continuous Delivery / Deployment |
| Continuous Delivery | Always keep software releasable |
| Continuous Deployment | Automatically release approved builds |
| Pipeline | Ordered automation stages |
| Runner | Machine that executes the workflow |
| Workflow | YAML-defined automation in GitHub Actions |
| Job | Unit of work in a workflow |
| Step | Single command or action inside a job |
| Action | Reusable GitHub Actions component |

## Simple flow

```text
git push
   ↓
GitHub
   ↓
GitHub Actions Runner
   ↓
Checkout
   ↓
Install
   ↓
Test
   ↓
Build
   ↓
Docker Build
   ↓
Docker Push
```

> **GitHub is not CI/CD.**  
> GitHub stores the code.  
> **GitHub Actions** is the automation system that runs pipelines.

**Teaching note:** Open Actions UI live after the first push. Students need to see a green/red run, not just YAML.

---

# 11. GitHub Actions CI Pipeline

## Create `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install backend dependencies
        run: |
          cd backend
          npm install

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm install

      - name: Build frontend
        run: |
          cd frontend
          npm run build

      - name: Build backend Docker image
        run: docker build -t se-kuppi-backend ./backend

      - name: Build frontend Docker image
        run: docker build -t se-kuppi-frontend ./frontend
```

## Commit and push — `LOCAL MACHINE`

```bash
git add .github/workflows/ci.yml
git commit -m "Add CI pipeline"
git push
```

## Inspect the run — `GITHUB`

```text
GitHub → Actions → Workflow → Job → Step → Logs
```

Verification checklist:

- [ ] Workflow appears under Actions  
- [ ] Trigger matches push/PR to `main`  
- [ ] Checkout step succeeds  
- [ ] Frontend build succeeds  
- [ ] Docker build steps succeed  

If it fails, open the failed step logs first. Do not guess.

---

# 12. CI/CD → Amazon ECR

## Final pipeline story

```text
Developer
 ↓
git push
 ↓
GitHub
 ↓
GitHub Actions
 ↓
Tests
 ↓
Docker Build
 ↓
Docker Tag
 ↓
Amazon ECR
 ↓
EC2
```

## Image tags

Examples:

```text
se-kuppi-backend:a31f82c
```

```text
se-kuppi-backend:latest
```

| Tag style | Pros | Cons |
| --- | --- | --- |
| `latest` | Simple for demos | Ambiguous; hard to roll back precisely |
| Commit SHA | Traceable to exact commit | Slightly more typing |

> Prefer **commit-SHA tags** for traceability in real systems.  
> Kuppi may use `latest` for speed, but explain the trade-off.

## Credentials rule

AWS credentials must **NEVER** be committed into GitHub.

Secure options:

- **GitHub OIDC** + **AWS IAM role** (preferred modern approach)  
- GitHub Secrets for carefully scoped temporary credentials where appropriate  

Do **not** put real access keys in YAML examples.

### Example shape of a deploy workflow (conceptual)

`.github/workflows/deploy.yml` can later:

1. Authenticate to AWS securely  
2. Build images  
3. Tag with commit SHA  
4. Push to ECR  
5. Optionally notify / trigger EC2 update  

Exact OIDC/IAM setup depends on your AWS account and should be prepared before the Kuppi if you demo full automation.

**Teaching note:** Say out loud: “If your AWS key is in Git history, rotate it immediately.”

---

# 13. Kubernetes Fundamentals

## Definitions

| Term | Meaning |
| --- | --- |
| Kubernetes | Container orchestration platform |
| Cluster | Set of nodes managed as one system |
| Node | Worker machine in the cluster |
| Pod | Smallest deployable unit; wraps one or more containers |
| Container | Process packaged by Docker/OCI image |
| Deployment | Declares desired Pod replicas and update strategy |
| Replica | One identical copy of a Pod |
| Service | Stable network endpoint in front of Pods |
| Namespace | Logical cluster partition |
| `kubectl` | CLI to control Kubernetes |

## Simple cluster diagram

```text
Kubernetes Cluster
       |
       └── Node
             |
             ├── Pod
             │    └── Container
             |
             └── Pod
                  └── Container
```

## Control hierarchy

```text
Deployment
     ↓
ReplicaSet
     ↓
Pods
     ↓
Containers
```

> Kubernetes in this Kuppi is **local via Minikube only**.  
> Do **not** assume EKS / Kubernetes on AWS.

---

# 14. Install / Start Minikube

## Start cluster — `LOCAL MACHINE` / `MINIKUBE`

```bash
minikube version
kubectl version --client
minikube start
minikube status
kubectl get nodes
```

| Command | Meaning |
| --- | --- |
| `minikube version` | Confirm Minikube installed |
| `kubectl version --client` | Confirm kubectl client installed |
| `minikube start` | Create/start local cluster |
| `minikube status` | Check control-plane / kubelet readiness |
| `kubectl get nodes` | List cluster nodes |

Expected: one node in `Ready` state.

**Teaching note:** If `minikube start` is slow on the teaching machine, start it during the Docker section break.

---

# 15. Build Docker Images for Minikube

Minikube uses its own Docker daemon unless configured otherwise. Build images into Minikube’s Docker:

## Point your shell at Minikube Docker — `MINIKUBE`

```bash
eval $(minikube docker-env)
```

Then build:

```bash
docker build -t se-kuppi-backend:local ./backend
docker build -t se-kuppi-frontend:local ./frontend
docker images | grep se-kuppi
```

### Why this matters

If images exist only on your host Docker daemon, Minikube Pods may fail with `ImagePullBackOff` / image not found, because the cluster cannot see those host images.

`imagePullPolicy: IfNotPresent` plus `:local` tags is the Kuppi-friendly pattern.

To undo the shell redirect later:

```bash
eval $(minikube docker-env -u)
```

---

# 16. Kubernetes YAML Files

Create the `k8s/` directory and these files.

## `k8s/backend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: se-kuppi-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: se-kuppi-backend
  template:
    metadata:
      labels:
        app: se-kuppi-backend
    spec:
      containers:
        - name: backend
          image: se-kuppi-backend:local
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5000
```

## `k8s/backend-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: se-kuppi-backend
spec:
  selector:
    app: se-kuppi-backend
  ports:
    - port: 5000
      targetPort: 5000
  type: ClusterIP
```

## `k8s/frontend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: se-kuppi-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: se-kuppi-frontend
  template:
    metadata:
      labels:
        app: se-kuppi-frontend
    spec:
      containers:
        - name: frontend
          image: se-kuppi-frontend:local
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5173
```

## `k8s/frontend-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: se-kuppi-frontend
spec:
  selector:
    app: se-kuppi-frontend
  ports:
    - port: 5173
      targetPort: 5173
  type: NodePort
```

**Teaching note:** Emphasize labels/selectors. Wrong selector = Service with no endpoints.

---

# 17. Deploy to Kubernetes

## Apply manifests — `MINIKUBE`

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Or apply the folder:

```bash
kubectl apply -f k8s/
```

## Verify

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get all
```

## Access frontend URL

```bash
minikube service se-kuppi-frontend --url
```

Open the printed URL in the browser.

Expected: Minikube prints a URL/port that maps to the NodePort Service.

If frontend cannot reach backend through the browser, revisit Section 8 (`localhost` / public API URL). For Kuppi demos, often the browser must call a reachable backend URL, not an in-cluster-only ClusterIP.

---

# 18. Kubernetes Self-Healing Demo

## Watch current Pods — `MINIKUBE`

```bash
kubectl get pods
```

Copy a backend Pod name, then delete it:

```bash
kubectl delete pod <backend-pod-name>
```

Watch recreation:

```bash
kubectl get pods -w
```

Press `Ctrl+C` to stop watching.

### Why a replacement Pod appears

A Deployment declares desired replicas (for example `2`).  
Kubernetes continuously reconciles actual state to desired state.  
Deleting one Pod makes actual < desired, so the ReplicaSet creates a new Pod.

**This is one of the main interactive moments of the Kuppi.**

Ask the room:

> Did we manually restart the app, or did Kubernetes heal itself?

---

# 19. Kubernetes Scaling Demo

## Scale backend — `MINIKUBE`

```bash
kubectl scale deployment se-kuppi-backend --replicas=3
```

Then:

```bash
kubectl get pods
```

### Explain replicas

Replicas = how many identical Pods Kubernetes should keep running.

Scale down:

```bash
kubectl scale deployment se-kuppi-backend --replicas=2
```

---

# 20. Kubernetes Troubleshooting

## Commands — `MINIKUBE`

```bash
kubectl get pods
kubectl get pods -o wide
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl get svc
kubectl get deployments
kubectl get all
kubectl rollout status deployment/se-kuppi-backend
```

## Common errors

| Error | Typical cause |
| --- | --- |
| `ImagePullBackOff` | Image missing / wrong name / wrong pull policy / not in Minikube Docker |
| `CrashLoopBackOff` | Container starts then crashes (bad CMD, missing file, app error) |
| `Pending` | Scheduling problem / resource pressure / not ready node |
| Service not reachable | Wrong type/port, no endpoints, wrong selector |
| Wrong port | `containerPort` / Service `port` / `targetPort` mismatch |
| Wrong selector | Service labels do not match Pod labels |
| Image not found | Forgot `eval $(minikube docker-env)` before build |

---

# 21. Kubernetes Cleanup

## Remove app resources — `MINIKUBE`

```bash
kubectl delete -f k8s/
```

## Stop Minikube — `LOCAL MACHINE`

```bash
minikube stop
```

## Optional full delete — `DANGER`

```bash
minikube delete
```

This destroys the local cluster. Use only if you intentionally want a clean rebuild.

---

# 22. AWS Fundamentals

## Simple definitions

| Term | Meaning |
| --- | --- |
| Region | Geographic AWS area (example: `ap-southeast-1`) |
| Availability Zone | Isolated datacenter inside a region |
| EC2 | Virtual servers (compute) |
| ECR | Managed Docker image registry |
| IAM | Identity and access management |
| VPC | Virtual private network in AWS |
| Security Group | Virtual firewall rules for instances |
| S3 | Object storage |
| CloudWatch | Monitoring / logs / metrics |

## Architecture for this Kuppi

```text
GitHub
   ↓
GitHub Actions
   ↓
Amazon ECR
   ↓
Amazon EC2
   ↓
Docker / Compose
   ↓
Application
```

> **ECR stores Docker images.**  
> **EC2 runs the containers.**

Kubernetes is **not** part of the AWS path in this Kuppi.

---

# 23. AWS CLI Setup

## Configure — `LOCAL MACHINE`

```bash
aws --version
aws configure
aws sts get-caller-identity
```

`aws configure` asks for:

- Access Key ID  
- Secret Access Key  
- Default region (use `ap-southeast-1` unless you chose another)  
- Default output format (`json` is fine)

**Do not paste real keys into slides, chat, or Git.**

`aws sts get-caller-identity` should return your account identity JSON including `Account`.

That `Account` value is your `ACCOUNT_ID`.

---

# 24. Create ECR Repositories

## Create repos — `LOCAL MACHINE` / `ECR`

```bash
aws ecr create-repository \
  --repository-name se-kuppi-frontend \
  --region ap-southeast-1
```

```bash
aws ecr create-repository \
  --repository-name se-kuppi-backend \
  --region ap-southeast-1
```

### Repository names

These names become part of the image URL:

```text
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-backend
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-frontend
```

If a repository already exists, the create command returns an error. That is fine; continue.

---

# 25. Push Docker Images to ECR

## Confirm identity — `LOCAL MACHINE`

```bash
aws sts get-caller-identity
```

Copy the `Account` field → replace `ACCOUNT_ID` everywhere.

## Login to ECR — `LOCAL MACHINE` / `ECR`

```bash
aws ecr get-login-password --region ap-southeast-1 | \
docker login \
  --username AWS \
  --password-stdin ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com
```

Expected:

```text
Login Succeeded
```

## Build — `LOCAL MACHINE`

```bash
docker build -t se-kuppi-backend ./backend
docker build -t se-kuppi-frontend ./frontend
```

## Tag — `LOCAL MACHINE`

```bash
docker tag se-kuppi-backend:latest \
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-backend:latest
```

```bash
docker tag se-kuppi-frontend:latest \
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-frontend:latest
```

## Push — `LOCAL MACHINE` / `ECR`

```bash
docker push \
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-backend:latest
```

```bash
docker push \
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-frontend:latest
```

## Verify — `ECR`

```bash
aws ecr list-images \
  --repository-name se-kuppi-backend \
  --region ap-southeast-1

aws ecr list-images \
  --repository-name se-kuppi-frontend \
  --region ap-southeast-1
```

---

# 26. AWS EC2 Setup

## Launch steps (Console)

1. EC2 → **Launch Instance**  
2. Name: `se-kuppi`  
3. AMI: **Ubuntu LTS**  
4. Instance type: small suitable demo size (for example `t3.micro` / `t3.small` depending on account limits)  
5. Create/select key pair → download `YOUR_KEY.pem`  
6. Network: default VPC is fine for learning  
7. Configure **Security Group**

## Security Group (learning demo)

```text
SSH 22 → My IP
```

For a temporary learning demo you may also open application ports such as:

```text
Custom TCP 5173 → My IP   (frontend)
Custom TCP 5000 → My IP   (backend)
```

### Production recommendation

Prefer:

- public HTTP/HTTPS (80/443) only  
- reverse proxy (Nginx/Caddy)  
- backend kept private where possible  

Do not treat open app ports as a production design.

---

# 27. SSH Into EC2

## From your laptop — `LOCAL MACHINE`

```bash
chmod 400 YOUR_KEY.pem
ssh -i YOUR_KEY.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

| Part | Meaning |
| --- | --- |
| `chmod 400` | Restrict key permissions (SSH requirement) |
| `-i YOUR_KEY.pem` | Identity file for authentication |
| `ubuntu@...` | Default username for Ubuntu AMI |

If SSH hangs, check Security Group inbound rule for port 22 from your IP.

---

# 28. Install Docker on EC2

## Install Docker Engine — `EC2`

Do **not** invent outdated install steps.  
Use the **current official Docker Engine installation method for Ubuntu**:

1. Open Docker’s official docs: “Install Docker Engine on Ubuntu”  
2. Follow the APT repository method shown there  
3. Install Docker Engine and the Compose plugin  

Also install AWS CLI v2 on the instance if it is not already available (needed for ECR login).

## Verify — `EC2`

```bash
docker --version
sudo docker run hello-world
```

## Optional Docker group configuration — `EC2`

To run Docker without `sudo` (after carefully understanding the security implications):

```bash
sudo usermod -aG docker ubuntu
```

Then log out and SSH back in.

Until then, prefix Docker commands with `sudo` if needed.

---

# 29. EC2 IAM Role for ECR

> Do **not** store permanent AWS access keys on the EC2 server.

## Preferred approach

1. Create an IAM role for EC2  
2. Attach a policy that allows ECR pull actions  
3. Attach the role to the EC2 instance  

The role needs permission to:

- obtain an ECR authorization token  
- download ECR layers/images  

Follow **least privilege**: grant only required ECR read/pull permissions for the Kuppi repositories.

## Verify role works — `EC2`

```bash
aws sts get-caller-identity
```

If this works without access keys on disk, the instance profile/role is functioning.

---

# 30. Login to ECR from EC2

## Login — `EC2` / `ECR`

```bash
aws ecr get-login-password --region ap-southeast-1 | \
docker login \
  --username AWS \
  --password-stdin ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com
```

Expected:

```text
Login Succeeded
```

---

# 31. Pull ECR Images on EC2

## Pull — `EC2` / `ECR`

```bash
docker pull \
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-backend:latest
```

```bash
docker pull \
ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-frontend:latest
```

Then:

```bash
docker images
```

You should see both ECR-tagged images.

---

# 32. Run Containers on EC2

## Backend — `EC2`

```bash
docker run -d \
  --name se-kuppi-backend \
  -p 5000:5000 \
  ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-backend:latest
```

## Frontend — `EC2`

```bash
docker run -d \
  --name se-kuppi-frontend \
  -p 5173:5173 \
  ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-frontend:latest
```

## Verify — `EC2`

```bash
docker ps
docker logs se-kuppi-backend
docker logs se-kuppi-frontend
curl http://localhost:5000/api/health
```

## Browser access

From your laptop browser:

```text
http://YOUR_EC2_PUBLIC_IP:5173
```

Backend health from laptop (if SG allows):

```text
http://YOUR_EC2_PUBLIC_IP:5000/api/health
```

If the UI loads but API calls fail, check whether the frontend is still calling `localhost` instead of `YOUR_EC2_PUBLIC_IP`.

---

# 33. EC2 Docker Compose

## Create `compose.yaml` on EC2 — `EC2`

```yaml
services:
  backend:
    image: ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-backend:latest
    container_name: se-kuppi-backend
    restart: unless-stopped
    ports:
      - "5000:5000"

  frontend:
    image: ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/se-kuppi-frontend:latest
    container_name: se-kuppi-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

## Commands — `EC2`

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs
```

## Update to newer images — `EC2`

```bash
docker compose pull
docker compose up -d
docker image prune
```

`image prune` removes dangling unused images. Review carefully before aggressive cleanup.

If old containers already exist from Section 32, stop/remove them first:

```bash
docker stop se-kuppi-backend se-kuppi-frontend
docker rm se-kuppi-backend se-kuppi-frontend
```

---

# 34. Final Production Workflow

```text
                 DEVELOPER
                     |
                 git push
                     |
                     v
                 GITHUB
                     |
                     v
             GITHUB ACTIONS
                     |
          +----------+----------+
          |          |          |
        TEST       BUILD     DOCKER
          |          |        BUILD
          +----------+----------+
                     |
                     v
                 AMAZON ECR
                     |
                     v
                 AWS EC2
                     |
              Docker Compose
                     |
          +----------+----------+
          |                     |
       FRONTEND              BACKEND
          |                     |
          +----------+----------+
                     |
                    USERS
```

### Explain every arrow

| Arrow | Meaning |
| --- | --- |
| Developer → GitHub | Code is pushed as the source of truth |
| GitHub → Actions | Push/PR triggers automation |
| Actions → Test/Build/Docker | Pipeline validates and packages |
| Actions → ECR | Built images are stored in the registry |
| ECR → EC2 | EC2 pulls known-good images |
| EC2 → Compose | Compose runs frontend + backend together |
| Compose → Users | Users hit the public instance/ports |

---

# 35. Production vs Kuppi Architecture

| Kuppi Demo | Production Improvement |
| --- | --- |
| Vite dev server | Static build + Nginx |
| HTTP | HTTPS |
| Public backend port | Private backend |
| `latest` | Commit SHA / immutable tags |
| Manual EC2 deployment | Automated deployment |
| In-memory data | Database |
| Basic Compose | Reverse proxy + monitoring |
| Simple IAM | Least privilege |

The Kuppi architecture is **intentionally simplified for learning**.  
Students should leave knowing both:

1. how the demo works, and  
2. what they would harden before a real production system.

---

# 36. Interactive Challenges

## Challenge 1 — Git

> Create a feature branch, change something, commit it and push it.

Do not reveal the answer immediately.

<details>
<summary>Solution</summary>

```bash
git switch -c feature/kuppi-note
# edit a file
git add .
git commit -m "Add a short Kuppi note"
git push -u origin feature/kuppi-note
```

Then optionally open a Pull Request on GitHub.

</details>

## Challenge 2 — Docker

Stop the backend:

```bash
docker stop se-kuppi-backend
```

Ask students how to diagnose it.

<details>
<summary>Solution</summary>

```bash
docker ps
docker ps -a
curl http://localhost:5000/api/health
docker logs se-kuppi-backend
docker start se-kuppi-backend
```

Symptom: Todo UI fails / health check fails.  
Cause: backend container stopped.  
Fix: start it again or bring Compose back up.

</details>

## Challenge 3 — CI/CD

> What happens after `git push`?

<details>
<summary>Solution</summary>

If a workflow is configured for that branch:

1. GitHub receives the push  
2. GitHub Actions starts a runner  
3. Workflow jobs/steps run (checkout, install, build, docker build, etc.)  
4. Success/failure status appears in the Actions tab / PR checks  

GitHub hosting alone does not equal CI/CD. Actions provides the automation.

</details>

## Challenge 4 — Kubernetes

Delete a Pod:

```bash
kubectl delete pod <pod-name>
```

Ask:

> Why did another Pod appear?

<details>
<summary>Solution</summary>

The Deployment/ReplicaSet wants a fixed number of replicas.  
Deleting one Pod creates a gap.  
Kubernetes reconciles desired state by creating a replacement Pod.  
That is self-healing.

</details>

## Challenge 5 — AWS

Ask:

> What is the difference between ECR and EC2?

<details>
<summary>Solution</summary>

- **ECR** = registry that **stores** Docker images  
- **EC2** = virtual server that **runs** containers  

Images do not run inside ECR. EC2 (with Docker/Compose) pulls images from ECR and runs them.

</details>

---

# 37. Common Errors and Fixes

For every issue: **Symptom → Cause → Check → Fix**

## Git

### Remote already exists

- **Symptom:** `remote origin already exists`  
- **Cause:** `origin` was added earlier  
- **Check:** `git remote -v`  
- **Fix:** `git remote set-url origin https://github.com/YOUR_USERNAME/se-kuppi.git` (or remove/re-add carefully)

### Rejected push

- **Symptom:** push rejected / non-fast-forward  
- **Cause:** remote has commits you do not have  
- **Check:** `git fetch` then `git status`  
- **Fix:** `git pull` (resolve conflicts) then `git push`

### Merge conflict

- **Symptom:** conflict markers in files  
- **Cause:** same lines changed on both branches  
- **Check:** `git status`  
- **Fix:** edit files, `git add`, `git commit`

### Detached HEAD

- **Symptom:** “You are in 'detached HEAD' state”  
- **Cause:** checked out a commit/tag instead of a branch  
- **Check:** `git branch` / `git status`  
- **Fix:** `git switch main` or create a branch from current commit

## Docker

### Port already allocated

- **Symptom:** `port is already allocated`  
- **Cause:** another process/container uses the host port  
- **Check:** `docker ps`, `ss -ltnp | grep 5000`  
- **Fix:** stop the conflicting container/process or map a different host port

### Container exits immediately

- **Symptom:** container status `Exited`  
- **Cause:** app crash / bad CMD / missing files  
- **Check:** `docker ps -a`, `docker logs <name>`  
- **Fix:** fix startup command / dependencies / copied files; rebuild

### Image not found

- **Symptom:** `Unable to find image`  
- **Cause:** wrong tag/name or not built  
- **Check:** `docker images`  
- **Fix:** rebuild/retag correctly

### Frontend cannot reach backend

- **Symptom:** UI loads, API fails  
- **Cause:** wrong API URL / backend down / networking  
- **Check:** `curl` health endpoint, inspect frontend env/logs  
- **Fix:** correct `VITE_API_URL`, start backend, fix SG/ports

### Docker permission denied

- **Symptom:** `permission denied while trying to connect to the Docker daemon`  
- **Cause:** user not in `docker` group / daemon not running  
- **Check:** `groups`, `systemctl status docker`  
- **Fix:** start Docker; use `sudo` or add user to `docker` group and re-login

## GitHub Actions

### Workflow doesn't trigger

- **Symptom:** no run after push  
- **Cause:** wrong branch filters / YAML path / syntax  
- **Check:** Actions tab, workflow `on:` block, file path `.github/workflows/`  
- **Fix:** push to matching branch; fix YAML; commit workflow file

### npm build failure

- **Symptom:** `npm run build` fails in CI  
- **Cause:** missing deps / Node version / code error  
- **Check:** step logs  
- **Fix:** reproduce locally with same Node version; fix code/deps

### Dependency failure

- **Symptom:** `npm install` fails  
- **Cause:** lockfile issues / network / registry  
- **Check:** CI logs around install step  
- **Fix:** fix `package.json` / lockfile; retry; pin versions

### Docker build failure

- **Symptom:** Docker build step red  
- **Cause:** Dockerfile error / context missing files  
- **Check:** build logs  
- **Fix:** fix Dockerfile / `.dockerignore` / paths; test `docker build` locally

## Kubernetes

### ImagePullBackOff

- **Symptom:** Pod cannot start; pull errors  
- **Cause:** image unavailable to cluster  
- **Check:** `kubectl describe pod`  
- **Fix:** `eval $(minikube docker-env)` then rebuild; verify tag/`imagePullPolicy`

### CrashLoopBackOff

- **Symptom:** Pod restarts repeatedly  
- **Cause:** app crashes on start  
- **Check:** `kubectl logs`, `kubectl describe pod`  
- **Fix:** fix app/CMD/env; redeploy

### Pending

- **Symptom:** Pod stuck Pending  
- **Cause:** cannot schedule  
- **Check:** `kubectl describe pod`, `minikube status`  
- **Fix:** free resources / restart Minikube / fix node readiness

### Wrong selector

- **Symptom:** Service has no endpoints  
- **Cause:** labels mismatch  
- **Check:** `kubectl get endpoints`, compare labels  
- **Fix:** align Service selector and Pod labels

### Wrong targetPort

- **Symptom:** connection fails though Pods run  
- **Cause:** Service targets wrong container port  
- **Check:** Deployment `containerPort`, Service `targetPort`  
- **Fix:** make ports match the app listen port

### Frontend service inaccessible

- **Symptom:** browser cannot open app  
- **Cause:** wrong Service type/URL / Minikube tunnel needs  
- **Check:** `kubectl get svc`, `minikube service se-kuppi-frontend --url`  
- **Fix:** use printed URL; verify NodePort; confirm Pods Ready

## AWS

### ECR login failure

- **Symptom:** `docker login` fails  
- **Cause:** wrong account/region/credentials  
- **Check:** `aws sts get-caller-identity`, region spelling  
- **Fix:** correct `ACCOUNT_ID`/region; refresh credentials/role

### AccessDenied

- **Symptom:** AWS API returns AccessDenied  
- **Cause:** IAM permissions insufficient  
- **Check:** identity + policy  
- **Fix:** grant least-privilege ECR/EC2 permissions needed

### EC2 cannot pull image

- **Symptom:** `docker pull` from ECR fails on EC2  
- **Cause:** no IAM role / login expired / wrong repo  
- **Check:** `aws sts get-caller-identity`, re-login  
- **Fix:** attach ECR pull role; login again; verify image URI

### Security Group blocks connection

- **Symptom:** browser/SSH timeout  
- **Cause:** inbound rules missing/wrong IP  
- **Check:** SG inbound rules, your public IP  
- **Fix:** allow SSH/app ports from your IP only for demo

### Frontend calls localhost

- **Symptom:** works on laptop, fails for remote users / EC2  
- **Cause:** baked/configured API URL is `localhost`  
- **Check:** browser Network tab  
- **Fix:** rebuild/redeploy with public backend URL

### Docker permission issue on EC2

- **Symptom:** permission denied to Docker socket  
- **Cause:** not root / not in docker group  
- **Check:** `groups`  
- **Fix:** `sudo` or add user to `docker` group and re-login

---

# 38. Complete Command Cheat Sheet

## Git

```bash
git init
git status
git add .
git commit -m "message"
git log --oneline
git branch
git switch
git merge
git remote -v
git pull
git push
git stash
```

## Docker

```bash
docker build
docker run
docker ps
docker images
docker logs
docker exec
docker stop
docker start
docker restart
docker rm
docker rmi
```

## Compose

```bash
docker compose up
docker compose up --build
docker compose down
docker compose ps
docker compose logs
docker compose pull
```

## Kubernetes

```bash
kubectl get nodes
kubectl get pods
kubectl get svc
kubectl get deployments
kubectl get all
kubectl describe pod
kubectl logs
kubectl apply
kubectl delete
kubectl scale
```

## Minikube

```bash
minikube start
minikube status
minikube service
minikube stop
minikube delete
```

## AWS

```bash
aws configure
aws sts get-caller-identity
aws ecr create-repository
aws ecr list-images
aws ecr get-login-password
docker login
docker tag
docker push
docker pull
```

---

# 39. Rapid-Fire Exam Questions

Use these in the final 5 minutes. Open each answer only after students attempt it.

### 1. What is Git?

<details>
<summary>Answer</summary>

Git is a distributed version control system that tracks changes to files over time on your machine.

</details>

### 2. Git vs GitHub?

<details>
<summary>Answer</summary>

Git is the tool. GitHub is a hosted platform for collaborating on Git repositories (remote hosting, PRs, Actions).

</details>

### 3. What does `git add` do?

<details>
<summary>Answer</summary>

It stages changes from the working directory into the staging area for the next commit.

</details>

### 4. What does `git commit` do?

<details>
<summary>Answer</summary>

It saves a snapshot of staged changes into the local repository history.

</details>

### 5. What is a branch?

<details>
<summary>Answer</summary>

A branch is a parallel line of development that lets you work without immediately changing `main`.

</details>

### 6. What is a Pull Request?

<details>
<summary>Answer</summary>

A request on GitHub to review and merge one branch into another.

</details>

### 7. What is Docker?

<details>
<summary>Answer</summary>

Docker packages applications and dependencies into images that run as containers consistently across environments.

</details>

### 8. Image vs container?

<details>
<summary>Answer</summary>

An image is the template. A container is a running instance of that image.

</details>

### 9. What does a Dockerfile do?

<details>
<summary>Answer</summary>

A Dockerfile is the recipe that defines how to build a Docker image.

</details>

### 10. What does `docker build` do?

<details>
<summary>Answer</summary>

It builds an image from a Dockerfile and build context.

</details>

### 11. What does `docker run` do?

<details>
<summary>Answer</summary>

It creates and starts a container from an image.

</details>

### 12. What is port mapping?

<details>
<summary>Answer</summary>

Publishing a container port to a host port using `-p HOST:CONTAINER` so external clients can reach the service.

</details>

### 13. Why does localhost cause networking problems?

<details>
<summary>Answer</summary>

`localhost` means “this machine/container only.” Inside containers, or in a user’s browser after deployment, it often points to the wrong place.

</details>

### 14. What is Docker Compose?

<details>
<summary>Answer</summary>

A tool to define and run multi-container applications with one YAML file and simple commands.

</details>

### 15. What is CI?

<details>
<summary>Answer</summary>

Continuous Integration: automatically building/testing changes when code is pushed.

</details>

### 16. What is CD?

<details>
<summary>Answer</summary>

Continuous Delivery/Deployment: keeping software releasable and optionally releasing automatically.

</details>

### 17. What is GitHub Actions?

<details>
<summary>Answer</summary>

GitHub’s automation system for workflows (CI/CD and other automations).

</details>

### 18. What is a runner?

<details>
<summary>Answer</summary>

The machine that executes workflow jobs and steps.

</details>

### 19. What is Kubernetes?

<details>
<summary>Answer</summary>

A container orchestration platform that manages deployments, scaling, networking, and recovery of containers/Pods.

</details>

### 20. What is a Pod?

<details>
<summary>Answer</summary>

The smallest deployable unit in Kubernetes; it wraps one or more containers.

</details>

### 21. What is a Deployment?

<details>
<summary>Answer</summary>

A Kubernetes object that declares desired replicas and manages Pods via ReplicaSets.

</details>

### 22. What is a Service?

<details>
<summary>Answer</summary>

A stable network endpoint that routes traffic to matching Pods.

</details>

### 23. Why does Kubernetes recreate a deleted Pod?

<details>
<summary>Answer</summary>

Self-healing: the Deployment wants N replicas, so Kubernetes creates a replacement to restore desired state.

</details>

### 24. What is scaling?

<details>
<summary>Answer</summary>

Changing the number of replicas of a Deployment to handle more/less load.

</details>

### 25. What is Minikube?

<details>
<summary>Answer</summary>

A tool that runs a local Kubernetes cluster for learning and development.

</details>

### 26. What is AWS?

<details>
<summary>Answer</summary>

Amazon Web Services: a cloud provider offering compute, storage, networking, and many managed services.

</details>

### 27. What is EC2?

<details>
<summary>Answer</summary>

Elastic Compute Cloud: virtual servers in AWS.

</details>

### 28. What is ECR?

<details>
<summary>Answer</summary>

Elastic Container Registry: AWS-managed Docker image registry.

</details>

### 29. ECR vs EC2?

<details>
<summary>Answer</summary>

ECR stores images. EC2 runs compute (and can pull/run those images with Docker).

</details>

### 30. What is IAM?

<details>
<summary>Answer</summary>

Identity and Access Management: controls who/what can do which actions in AWS.

</details>

### 31. What is a Security Group?

<details>
<summary>Answer</summary>

A virtual firewall that controls inbound/outbound traffic for AWS resources like EC2.

</details>

### 32. Why shouldn't AWS keys be committed to Git?

<details>
<summary>Answer</summary>

Anyone with repo access (or leaked history) can steal credentials and abuse the account. Use IAM roles/OIDC/secrets carefully and rotate if leaked.

</details>

### 33. Why use immutable Docker tags?

<details>
<summary>Answer</summary>

Commit-SHA/immutable tags identify exactly which build is running, enabling safe rollbacks and traceability. `latest` is ambiguous.

</details>

### 34. Explain the complete pipeline from `git push` to production.

<details>
<summary>Answer</summary>

`git push` → GitHub → GitHub Actions tests/builds Docker images → images pushed to Amazon ECR → EC2 pulls images → Docker Compose runs frontend/backend → users access the app.

</details>

### 35. Why use Kubernetes locally but EC2 for this Kuppi's AWS deployment?

<details>
<summary>Answer</summary>

Kubernetes concepts are taught safely/cheaply with Minikube. The AWS path intentionally uses ECR + EC2 + Compose to keep cloud deployment simpler and avoid running Kubernetes on AWS in this session.

</details>

---

# 40. Final 60-Second Explanation

Memorize and say this at the end:

> We start with **Git** for version control on the developer machine, then push to **GitHub** for collaboration.  
> **Docker** packages the React frontend and Express backend so they run the same everywhere.  
> **GitHub Actions** automates CI/CD after every push: install, build, and create Docker images.  
> Those images go to **Amazon ECR**, our cloud image registry.  
> An **AWS EC2** virtual server pulls the images and runs them with **Docker Compose** for production in this Kuppi.  
> Separately, we use **Minikube** locally to learn **Kubernetes**: Deployments, Pods, Services, self-healing, and scaling.  
> So the story is: commit → automate → package → store → run — from developer laptop all the way to production.

Compact map:

```text
Git → version control
GitHub → collaboration
Docker → consistent packaging
CI/CD → automation
Kubernetes → container orchestration
ECR → image registry
EC2 → cloud compute
Docker Compose → application deployment
```

---

# 41. Final Pre-Kuppi Checklist

- [ ] Application works locally  
- [ ] GitHub repository works  
- [ ] `.gitignore` configured  
- [ ] Dockerfiles tested  
- [ ] Docker containers tested  
- [ ] Docker Compose tested  
- [ ] GitHub Actions passes  
- [ ] Minikube starts  
- [ ] Kubernetes manifests tested  
- [ ] Self-healing demo tested  
- [ ] ECR repositories created  
- [ ] Images pushed to ECR  
- [ ] EC2 created  
- [ ] EC2 SSH works  
- [ ] EC2 IAM role configured  
- [ ] EC2 can pull ECR images  
- [ ] Docker Compose works on EC2  
- [ ] Frontend API URL is correct  
- [ ] Backup local demo prepared  
- [ ] All secrets removed from repository  

---

## End of runbook

You should be able to open this file and teach the full 3-hour path:

**Git & GitHub → Docker → CI/CD → Kubernetes (Minikube) → AWS (ECR → EC2 → Compose)**

without inventing commands mid-session. Replace placeholders, stay in the marked environment (`LOCAL` / `MINIKUBE` / `EC2`), and keep the architecture decision clear: **Kubernetes locally, Compose on EC2.**
