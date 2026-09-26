# SE Kuppi Platform

**From Commit to Production** — an interactive learning platform built for a 3-hour university
Software Engineering Kuppi covering Git & GitHub, Docker, CI/CD, Kubernetes and AWS fundamentals.

The site has three parts:

- **Live Demo** (`/demo`) — a real React frontend talking to a real Node.js backend over a REST API,
  so the deployment topics later in the session have an actual application to be applied to.
- **Kuppi Notes** (`/notes`) — documentation-style notes with theory, commands, diagrams, code
  examples, common mistakes, exam tips and a quick-revision Q&A section.
- **Topic Quiz** (`/quiz`) — a separate multiple-choice quiz for each of the five topics, marked as
  you answer, with an explanation per question and a score summary at the end.

## Project purpose

The application is deliberately small: a Todo list, an in-memory array, no database and no auth.
That is the point. Docker, GitHub Actions, Kubernetes and AWS get introduced **on top of** this
project during the Kuppi, and none of them are part of the repository yet.

## Architecture

```text
Browser
  │
  │  React (Vite dev server, port 5173)
  ▼
fetch()  ──►  HTTP + JSON  ──►  Express (port 5000)
                                   │
                                   ▼
                          In-memory todos array
```

The frontend keeps no permanent data. Every action (list, add, toggle, delete) is an HTTP request to
the backend, which owns the todo list.

## Technology stack

| Layer    | Tools                                                             |
| -------- | ----------------------------------------------------------------- |
| Frontend | React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React |
| Backend  | Node.js, Express.js, JavaScript, REST API                         |
| Data     | In-memory array (no database)                                     |

## Folder structure

```text
se-kuppi-platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, TodoApp, BackendStatus, notes renderers
│   │   │   └── notes/           # CodeBlock, CommandList, ConceptGrid, FlowDiagram, Callout, QuizList
│   │   ├── pages/               # Home.jsx, Demo.jsx, Notes.jsx
│   │   ├── services/            # api.js - the only place the backend URL appears
│   │   ├── data/                # notes.js (all Kuppi content), journey.js
│   │   ├── utils/               # highlight.js - small dependency-free syntax highlighter
│   │   ├── App.jsx              # routes
│   │   ├── main.jsx             # entry point
│   │   └── index.css            # Tailwind import + dark theme tokens
│   ├── public/
│   ├── .env.example
│   ├── Dockerfile               # two-stage build: Vite -> nginx
│   ├── nginx.conf               # SPA fallback for React Router
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── routes/              # todoRoutes.js
│   │   ├── controllers/         # todoController.js
│   │   ├── data/                # todos.js - the in-memory store
│   │   └── server.js            # Express app, CORS, /api/health
│   ├── Dockerfile               # packages the API into an image
│   ├── .dockerignore
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # install, smoke test, build, build images
│       └── cd.yml               # push to ECR, deploy on EC2 (manual trigger)
│
├── docker-compose.yml           # builds and runs both services together
├── .gitignore
└── README.md
```

## Running the project locally

You need **two terminals**, because the frontend and backend are two separate programs.

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on <http://localhost:5000> (`npm run dev` uses nodemon and restarts on save; `npm start` runs
it once with plain `node`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on <http://localhost:5173>. Open that URL in your browser.

### Environment configuration

The frontend reads the backend URL from `VITE_API_URL`. Copy the example file and edit it if your
backend is not on port 5000:

```bash
cd frontend
cp .env.example .env
```

```text
VITE_API_URL=http://localhost:5000
```

`.env` is gitignored — never commit real secrets. Vite only exposes variables prefixed with `VITE_`,
and it reads them at startup, so restart `npm run dev` after changing the file.

The backend reads `PORT` and defaults to `5000`:

```bash
PORT=8080 npm run dev
```

## Routes

| Route    | Page                                                                       |
| -------- | -------------------------------------------------------------------------- |
| `/`      | Landing page: hero, two primary actions, clickable technology journey       |
| `/demo`  | Live demo: architecture cards, backend status indicator, Todo application   |
| `/notes` | Kuppi notes; `?topic=git\|docker\|cicd\|kubernetes\|aws\|architecture\|revision` |
| `/quiz`  | Topic quiz; `?topic=git\|docker\|cicd\|kubernetes\|aws` jumps straight into one |

Anything else redirects to `/`.

## API endpoints

Base URL: `http://localhost:5000`

| Method   | Endpoint         | Description                                            |
| -------- | ---------------- | ------------------------------------------------------ |
| `GET`    | `/api/health`    | `{ "status": "ok", "service": "se-kuppi-backend" }`    |
| `GET`    | `/api/todos`     | List all todos                                         |
| `POST`   | `/api/todos`     | Create a todo from `{ "title": "Learn Kubernetes" }`   |
| `PATCH`  | `/api/todos/:id` | Update `completed`/`title`; toggles when body is empty |
| `DELETE` | `/api/todos/:id` | Delete a todo (`204 No Content`)                       |

Errors: `400` for an empty title, `404` for an unknown id.

### Try it from the terminal

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/todos
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Kubernetes"}'
curl -X PATCH http://localhost:5000/api/todos/2
curl -X DELETE http://localhost:5000/api/todos/2
```

## Notes content

`/notes` covers seven sections, each with theory, key concepts, commands, code blocks, diagrams,
common mistakes and exam tips:

```text
01  Git & GitHub
02  Docker
03  CI/CD
04  Kubernetes
05  AWS Fundamentals
06  From Developer to Production
07  Exam Quick Revision
```

All content lives in [frontend/src/data/notes.js](frontend/src/data/notes.js) as plain data, so
adding or editing a topic never requires touching a component.

Quiz questions live the same way in [frontend/src/data/quiz.js](frontend/src/data/quiz.js) — eight
per topic, each with four options, the correct index and a short explanation. Titles and icons are
read from `notes.js`, so the two never disagree. Best scores are kept in `localStorage`; there is no
quiz API and no database.

## Running in Docker

### Backend

[backend/Dockerfile](backend/Dockerfile) packages the API so it runs the same way anywhere. It is a
single-stage build, kept deliberately small so it can be read line by line.

```bash
# build an image and tag it
docker build -t se-kuppi-backend:1.0.0 ./backend

# run it, publishing container port 5000 on host port 5000
docker run -d -p 5000:5000 --name kuppi-backend se-kuppi-backend:1.0.0

curl http://localhost:5000/api/health
docker logs kuppi-backend

# stop and remove it
docker rm -f kuppi-backend
```

Three things worth pointing out while explaining it:

- **The manifests are copied before the source.** Docker caches every step, so editing `server.js`
  reuses the cached `npm ci` layer and the rebuild takes under a second. Copying everything at once
  would reinstall dependencies on every code change.
- **`npm ci --omit=dev`** installs exactly the lock file versions and leaves out `nodemon`. The
  container runs `node src/server.js`, not a file watcher.
- **`EXPOSE 5000` documents, it does not publish.** Without `-p` on `docker run`, nothing on your
  machine can reach the container.

[backend/.dockerignore](backend/.dockerignore) keeps the host `node_modules` out of the build, so
`COPY . .` cannot overwrite the dependencies installed for Alpine Linux inside the image.

Because the todo list lives in memory, removing the container discards it — which is exactly the
problem volumes and databases exist to solve.

### Frontend

[frontend/Dockerfile](frontend/Dockerfile) is a **two-stage** build: stage one runs Vite with Node to
produce `dist/`, stage two copies only `dist/` into a plain nginx image. Node, npm and every
devDependency stay behind in the discarded first stage.

```bash
# the API URL must be supplied at BUILD time, not run time
docker build --build-arg VITE_API_URL=http://localhost:5000 \
  -t se-kuppi-frontend:1.0.0 ./frontend

# nginx serves on port 80 inside the container
docker run -d -p 8080:80 --name kuppi-frontend se-kuppi-frontend:1.0.0

# then open http://localhost:8080
docker rm -f kuppi-frontend
```

Two points specific to this image:

- **`VITE_API_URL` is a build argument, not a runtime variable.** Vite replaces `import.meta.env`
  values while bundling, so they end up as literal strings in the JavaScript. Passing `-e` to
  `docker run` has no effect — by then the frontend is just static files. This is why the backend
  reads `PORT` at runtime but the frontend cannot read its API URL the same way.
- **[frontend/nginx.conf](frontend/nginx.conf) exists for React Router.** Its
  `try_files $uri $uri/ /index.html;` makes nginx return `index.html` for unknown paths. Without it,
  the app works from `/` but reloading `/notes` or `/quiz` returns a 404, since no such file exists
  on disk.

### Both together with Docker Compose

[docker-compose.yml](docker-compose.yml) describes both services in one file, so the whole
application starts with a single command:

```bash
docker compose up --build     # build both images and start them
docker compose ps             # what is running, and on which ports
docker compose logs -f        # follow both logs together
docker compose down           # stop and remove the containers and network
```

The frontend is then on <http://localhost:8080> and the API on <http://localhost:5000>.

Compose creates a network for the two services automatically, so inside it the backend is reachable
as `http://backend:5000` — by service name, no IP addresses. Two things to keep in mind:

- **`VITE_API_URL` stays `http://localhost:5000`, not `http://backend:5000`.** The request to the API
  is made by the browser on your machine, and your machine is not on the Compose network. Only the
  containers are. A server-side caller inside a container would use `http://backend:5000`.
- **`depends_on` controls start order, not readiness.** Compose starts the backend container first,
  but does not wait for Express to be listening. For a demo this is fine; a healthcheck with
  `condition: service_healthy` is the real fix.

Stop the local `npm run dev` backend before `docker compose up`, or port 5000 will already be taken.

## CI pipeline

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every push to `main` and on every pull
request targeting `main`. One job on a fresh `ubuntu-latest` runner:

```text
checkout → setup node 22 → npm ci (backend, frontend)
        → smoke test the API → build frontend → build both Docker images
```

The smoke test starts Express and calls `/api/health` and `/api/todos` with `curl -fsS`, so a broken
API fails the pipeline rather than silently passing. Images are tagged with `${{ github.sha }}`, so
any image can be traced back to the exact commit that produced it.

The pipeline stops at building. Nothing is pushed and nothing is deployed — that is `cd.yml`'s job.

## CD pipeline (ECR + EC2)

[.github/workflows/cd.yml](.github/workflows/cd.yml) pushes both images to Amazon ECR and restarts the
containers on an EC2 instance.

```text
Run workflow → configure AWS credentials → log in to ECR
  → build & push backend + frontend (tagged :<sha> and :latest)
  → SSH to EC2 → pull → restart containers → curl /api/health
```

**It is manual on purpose.** The only trigger is `workflow_dispatch`, so nothing runs until you press
*Run workflow* in the Actions tab — meaning the repository cannot go red before the secrets exist.
That button is also the teaching point: pressing it yourself is Continuous **Delivery**; uncommenting
the `push:` block at the top makes it Continuous **Deployment**.

### Secrets to add (Settings → Secrets and variables → Actions)

| Secret | Value |
| ------ | ----- |
| `AWS_ACCESS_KEY_ID` | Access key of a scoped IAM user |
| `AWS_SECRET_ACCESS_KEY` | Its secret access key |
| `EC2_HOST` | Public IPv4 of the instance, e.g. `13.229.x.x` |
| `EC2_SSH_KEY` | Full contents of the `.pem` private key |

Region and repository names are plain `env:` values at the top of the file (`ap-southeast-1`,
`se-kuppi-backend`, `se-kuppi-frontend`) — edit them there, they are not secret.

### Prerequisites on the AWS side

- Both ECR repositories must already exist; ECR does not create them on push:
  `aws ecr create-repository --repository-name se-kuppi-backend --region ap-southeast-1`
- The EC2 instance needs Docker, the AWS CLI, the `ubuntu` user in the `docker` group, and an IAM role
  that can read from ECR — that role is why the deploy script needs no keys of its own.
- Security group open on `22` (SSH), `5173` (frontend) and `5000` (API).

### Two details that decide whether it works

- **The frontend image is built with `--build-arg VITE_API_URL=http://$EC2_HOST:5000`.** The API URL is
  baked in at build time, so an image built with the `localhost` default would load on the server and
  then fail every request — `localhost` would mean the visitor's own laptop.
- **The frontend container publishes `5173:80`.** nginx serves on port 80 inside the container, while
  `5173` is the host port the security group opens, keeping the browser URL `http://<EC2_IP>:5173`.

Prefer OIDC over stored keys when you get the chance: the commented `role-to-assume:` line in the
workflow replaces both AWS secrets with a short-lived token per run, so there is no key to leak.

## Not included yet (on purpose)

No Kubernetes manifests or Terraform. The notes show those as examples only — they are added live
during the Kuppi.
