import { GitBranch, Container, Workflow, Ship, Cloud, Network, Zap } from 'lucide-react';

// All Kuppi content lives here as plain data so the components stay tiny.
// Block types: text | concepts | commands | code | diagram | callout | qa
// Callout variants: key | exam | mistake
// Diagram variants: flow | tree | map

const git = {
  id: 'git',
  number: '01',
  title: 'Git & GitHub',
  icon: GitBranch,
  tagline: 'Record every change, then share it with the team.',
  sections: [
    {
      id: 'git-theory',
      title: 'Theory',
      blocks: [
        {
          type: 'text',
          body: [
            'Git is a distributed version control system. It takes snapshots of your project over time so you can see what changed, who changed it, when, and why - and go back if you need to.',
            'Version control is the practice of tracking those changes. Without it, teams email zip files around, overwrite each other, and keep folders called final, final2 and final-REALLY-final. With it, every change is a labelled, reversible entry in a shared history.',
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Git vs GitHub',
          body: 'Git is the tool that runs on your machine and stores the history. GitHub is a website that hosts a copy of that history so people can collaborate on it. Git works with no internet; GitHub is where you push to.',
        },
        {
          type: 'concepts',
          title: 'Core vocabulary',
          items: [
            {
              term: 'Repository (repo)',
              detail: 'A project folder plus its full history, stored in the hidden .git directory.',
            },
            {
              term: 'Working directory',
              detail: 'The files you can actually see and edit right now.',
            },
            {
              term: 'Staging area (index)',
              detail: 'A holding area where you choose exactly which changes go into the next commit.',
            },
            {
              term: 'Commit',
              detail: 'A saved snapshot with a message, an author and a unique hash. The unit of history.',
            },
            {
              term: 'Branch',
              detail: 'A movable pointer to a commit. It lets you build a feature without touching main.',
            },
            {
              term: 'Merge',
              detail: 'Combining the work of two branches back into one.',
            },
            {
              term: 'Remote',
              detail: 'Another copy of the repo, usually on GitHub, normally named origin.',
            },
            {
              term: 'Clone',
              detail: 'Download a full copy of a remote repository, including its history.',
            },
            {
              term: 'Push / Pull',
              detail: 'Push sends your local commits to the remote. Pull fetches remote commits and merges them in.',
            },
            {
              term: 'Merge conflict',
              detail: 'Two branches changed the same lines, so Git asks a human to decide.',
            },
            {
              term: '.gitignore',
              detail: 'A list of paths Git should never track, such as node_modules, dist and .env.',
            },
          ],
        },
        {
          type: 'diagram',
          variant: 'flow',
          title: 'Where your changes travel',
          steps: [
            { label: 'Working Directory', sub: 'Files you edited' },
            { label: 'git add', kind: 'command' },
            { label: 'Staging Area', sub: 'Chosen changes' },
            { label: 'git commit', kind: 'command' },
            { label: 'Local Repository', sub: 'History on your laptop' },
            { label: 'git push', kind: 'command' },
            { label: 'GitHub', sub: 'Shared remote copy' },
          ],
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Committing things that should never be committed',
          body: 'node_modules, build output and .env files do not belong in Git. node_modules can be reinstalled, dist can be rebuilt, and a leaked .env means leaked credentials. Write .gitignore before your first commit.',
        },
      ],
    },
    {
      id: 'git-commands',
      title: 'Commands',
      blocks: [
        {
          type: 'commands',
          title: 'The everyday set',
          items: [
            { command: 'git init', detail: 'Turn the current folder into a Git repository.' },
            { command: 'git status', detail: 'What has changed and what is staged. Run it constantly.' },
            { command: 'git add .', detail: 'Stage every change in the current directory.' },
            { command: 'git commit -m "Initial commit"', detail: 'Save the staged changes as a snapshot.' },
            { command: 'git log', detail: 'Show the commit history. Try git log --oneline --graph.' },
            { command: 'git branch', detail: 'List branches and show which one you are on.' },
            { command: 'git switch main', detail: 'Move to an existing branch.' },
            { command: 'git switch -c feature/login', detail: 'Create a new branch and switch to it.' },
            { command: 'git merge feature/login', detail: 'Merge that branch into the branch you are on.' },
            { command: 'git remote -v', detail: 'Show the remote URLs this repo is connected to.' },
            { command: 'git push', detail: 'Send local commits to the remote branch.' },
            { command: 'git pull', detail: 'Fetch remote commits and merge them into your branch.' },
            { command: 'git clone <url>', detail: 'Copy an existing remote repository to your machine.' },
          ],
        },
        {
          type: 'code',
          language: 'bash',
          title: 'A complete first-project session',
          code: `# start tracking the project
git init
git add .
git commit -m "Initial commit"

# connect it to GitHub and publish
git remote add origin https://github.com/you/se-kuppi-platform.git
git branch -M main
git push -u origin main

# work on a feature safely
git switch -c feature/todo-api
git add backend/src/routes/todoRoutes.js
git commit -m "Add todo routes"
git push -u origin feature/todo-api`,
        },
      ],
    },
    {
      id: 'git-conflict',
      title: 'Merge conflicts',
      blocks: [
        {
          type: 'text',
          body: [
            'A conflict is not an error, it is a question. Git is telling you that two commits changed the same lines and it will not guess which one you meant.',
          ],
        },
        {
          type: 'code',
          language: 'bash',
          title: 'How a conflict happens',
          code: `git switch -c feature/title
# edit the same line in README.md, commit it
git switch main
# someone else edited that same line on main
git merge feature/title
# Auto-merging README.md
# CONFLICT (content): Merge conflict in README.md
# Automatic merge failed; fix conflicts and then commit the result.`,
        },
        {
          type: 'code',
          language: 'text',
          title: 'What the file looks like',
          code: `<<<<<<< HEAD
# SE Kuppi Platform
=======
# SE Kuppi - From Commit to Production
>>>>>>> feature/title`,
        },
        {
          type: 'text',
          body: [
            'Everything between <<<<<<< HEAD and ======= is the version on your current branch. Everything between ======= and >>>>>>> is the incoming version. Delete the markers, leave the text you actually want, then stage and commit.',
          ],
        },
        {
          type: 'code',
          language: 'bash',
          title: 'Finishing the merge',
          code: `# after editing the file by hand
git add README.md
git commit -m "Merge feature/title into main"
git status   # should be clean`,
        },
        {
          type: 'callout',
          variant: 'exam',
          title: 'Exam tip',
          body: 'Define a merge conflict as: the same part of the same file was changed differently in two branches, so Git cannot merge automatically and requires manual resolution.',
        },
        {
          type: 'code',
          language: 'text',
          title: 'A sensible .gitignore for this project',
          code: `node_modules/
dist/
.env
*.log
.DS_Store`,
        },
      ],
    },
  ],
};

const docker = {
  id: 'docker',
  number: '02',
  title: 'Docker',
  icon: Container,
  tagline: 'Package the app with its environment so it runs the same everywhere.',
  sections: [
    {
      id: 'docker-problem',
      title: 'The problem Docker solves',
      blocks: [
        {
          type: 'text',
          body: [
            'Your app does not only need your code. It needs a specific Node version, specific packages, specific environment variables and a specific operating system layout. Your laptop has all of that; the server usually has something slightly different.',
            'That gap is the famous "works on my machine" bug. Docker closes it by shipping the code together with its environment as one image, so the thing you tested is exactly the thing that runs in production.',
          ],
        },
        {
          type: 'concepts',
          title: 'Key concepts',
          items: [
            {
              term: 'Containerisation',
              detail: 'Running an app in an isolated process with its own filesystem, sharing the host kernel. Much lighter than a virtual machine.',
            },
            {
              term: 'Image',
              detail: 'A read-only template: your code plus its dependencies and runtime. Built once, reused anywhere.',
            },
            {
              term: 'Container',
              detail: 'A running instance of an image. You can start many containers from one image.',
            },
            {
              term: 'Dockerfile',
              detail: 'The recipe. A text file of instructions that Docker follows to build the image.',
            },
            {
              term: 'Registry',
              detail: 'Storage for images, so other machines can pull them. Docker Hub and Amazon ECR are registries.',
            },
            {
              term: 'Docker Hub',
              detail: 'The public default registry. node:20-alpine comes from there.',
            },
            {
              term: 'Port mapping',
              detail: 'A container has its own network. -p hostPort:containerPort exposes it to your machine.',
            },
            {
              term: 'Volume',
              detail: 'Storage that outlives the container, so data is not lost when the container is removed.',
            },
            {
              term: 'Environment variables',
              detail: 'Configuration passed in at run time with -e, so one image works in dev and in production.',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Image vs container',
          body: 'An image is like a class; a container is like an object created from it. Or: the image is the recipe, the container is the cooked meal. Images are static and shareable, containers are running and disposable.',
        },
        {
          type: 'diagram',
          variant: 'flow',
          title: 'From recipe to running app',
          steps: [
            { label: 'Dockerfile', sub: 'Instructions you write' },
            { label: 'docker build', kind: 'command' },
            { label: 'Docker Image', sub: 'Immutable template' },
            { label: 'docker run', kind: 'command' },
            { label: 'Docker Container', sub: 'Running process' },
          ],
        },
      ],
    },
    {
      id: 'docker-commands',
      title: 'Commands',
      blocks: [
        {
          type: 'commands',
          title: 'Build, run, inspect, clean up',
          items: [
            { command: 'docker --version', detail: 'Check Docker is installed and the daemon is reachable.' },
            { command: 'docker build -t my-app .', detail: 'Build an image named my-app from the Dockerfile in this folder.' },
            { command: 'docker images', detail: 'List the images stored locally.' },
            { command: 'docker run my-app', detail: 'Start a container from the image.' },
            { command: 'docker run -p 3000:3000 my-app', detail: 'Same, but map host port 3000 to container port 3000.' },
            { command: 'docker ps', detail: 'List running containers.' },
            { command: 'docker ps -a', detail: 'List all containers, including stopped ones.' },
            { command: 'docker stop <id>', detail: 'Gracefully stop a running container.' },
            { command: 'docker start <id>', detail: 'Start a container that was stopped.' },
            { command: 'docker rm <id>', detail: 'Delete a container.' },
            { command: 'docker rmi my-app', detail: 'Delete an image.' },
            { command: 'docker logs <id>', detail: 'Print the container output. Your first debugging step.' },
            { command: 'docker exec -it <id> sh', detail: 'Open a shell inside a running container and look around.' },
          ],
        },
        {
          type: 'code',
          language: 'dockerfile',
          title: 'backend/Dockerfile - the real file in this project',
          code: `# A small official Node image
FROM node:22-alpine

# Everything below runs inside /app in the container
WORKDIR /app

# Manifests first, so the install layer is cached
COPY package.json package-lock.json ./

# Exactly the lock file versions, without dev tools like nodemon
RUN npm ci --omit=dev

# Then the source (.dockerignore keeps node_modules out)
COPY . .

ENV NODE_ENV=production

# Documentation only - you still need docker run -p 5000:5000
EXPOSE 5000

# The process the container runs
CMD ["node", "src/server.js"]`,
        },
        {
          type: 'code',
          language: 'text',
          title: 'backend/.dockerignore',
          code: `node_modules
.env
*.log`,
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Why .dockerignore matters here',
          body: 'COPY . . would otherwise copy the node_modules from the laptop into the image, overwriting the ones npm ci just installed for Alpine Linux. Native modules built for your OS then fail inside the container.',
        },
        {
          type: 'code',
          language: 'dockerfile',
          title: 'frontend/Dockerfile - two stages, because the browser does not need Node',
          code: `# Stage 1: build the static files
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Vite bakes VITE_ variables in at build time
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: serve them with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
        },
        {
          type: 'code',
          language: 'text',
          title: 'frontend/nginx.conf - the line that keeps React Router working',
          code: `server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}`,
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Why two stages?',
          body: 'Stage 1 needs Node and every devDependency to run Vite. Stage 2 only needs the finished HTML, CSS and JS. Copying just dist/ into a fresh nginx image means the shipped image is tens of megabytes instead of hundreds, and contains no build tools for an attacker to use.',
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Expecting VITE_API_URL to work at docker run time',
          body: 'Vite replaces import.meta.env values while building, so they are literal strings inside the bundle. Pass it as a build argument (--build-arg VITE_API_URL=...) - an -e flag on docker run changes nothing, because the frontend is just static files by then.',
        },
        {
          type: 'commands',
          title: 'Build and run this project',
          items: [
            { command: 'docker build -t se-kuppi-backend:1.0.0 ./backend', detail: 'Build the image from backend/Dockerfile and tag it with a version.' },
            { command: 'docker run -d -p 5000:5000 --name kuppi-backend se-kuppi-backend:1.0.0', detail: 'Run it in the background with the port published to your machine.' },
            { command: 'curl http://localhost:5000/api/health', detail: 'Same endpoint as before, now answered from inside a container.' },
            { command: 'docker logs -f kuppi-backend', detail: 'Follow the server output. This is where a crash explains itself.' },
            { command: 'docker build -t se-kuppi-frontend:1.0.0 ./frontend', detail: 'Build the frontend image using the default API URL.' },
            { command: 'docker build --build-arg VITE_API_URL=http://localhost:5000 -t se-kuppi-frontend:1.0.0 ./frontend', detail: 'Same build, with the API URL passed in explicitly.' },
            { command: 'docker run -d -p 8080:80 --name kuppi-frontend se-kuppi-frontend:1.0.0', detail: 'Serve the built site on http://localhost:8080 through nginx.' },
            { command: 'docker rm -f kuppi-backend kuppi-frontend', detail: 'Stop and remove both containers. The todo list is gone with them.' },
          ],
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Forgetting -p and thinking the app is broken',
          body: 'Without -p the container runs happily but nothing on your machine can reach it. localhost:5000 in your browser is your machine, not the container.',
        },
        {
          type: 'callout',
          variant: 'exam',
          title: 'Exam tip',
          body: 'Copy package.json and package-lock.json before COPY . . because Docker caches layers. If only your source changed, the dependency layer is reused and the rebuild takes about a second.',
        },
      ],
    },
    {
      id: 'docker-compose',
      title: 'Running both with Docker Compose',
      blocks: [
        {
          type: 'text',
          body: [
            'Two containers means two build commands and two run commands, each with its own flags to remember. Docker Compose moves all of that into one file you commit alongside the code, so starting the whole application becomes a single command.',
            'Compose also creates a network for the services automatically. Inside that network each service is reachable by its own name, so the backend is http://backend:5000 from any other container - no IP addresses involved.',
          ],
        },
        {
          type: 'code',
          language: 'yaml',
          title: 'docker-compose.yml - the real file in this project',
          code: `services:
  backend:
    build: ./backend
    container_name: kuppi-backend
    ports:
      - "5000:5000"
    environment:
      PORT: 5000

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:5000
    container_name: kuppi-frontend
    ports:
      - "8080:80"
    depends_on:
      - backend`,
        },
        {
          type: 'concepts',
          title: 'What each key does',
          items: [
            { term: 'services', detail: 'One entry per container. The key (backend, frontend) becomes both the service name and its hostname on the network.' },
            { term: 'build', detail: 'Path to the folder holding the Dockerfile. Use image: instead when pulling a ready-made image.' },
            { term: 'ports', detail: 'host:container, exactly like -p on docker run. Without it the service is only reachable from other containers.' },
            { term: 'environment', detail: 'Variables the process reads at run time, like -e on docker run.' },
            { term: 'args', detail: 'Build arguments, passed while the image is being built. This is where VITE_API_URL has to go.' },
            { term: 'depends_on', detail: 'Start order only. Compose starts the backend container first, but does not wait for Express to be ready.' },
          ],
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Setting VITE_API_URL to http://backend:5000',
          body: 'It looks right and it fails every time. The request to the API is made by the browser on your laptop, and your laptop is not on the Compose network - only the containers are. The name backend does not resolve there, so use http://localhost:5000, the published port. A server-rendered app talking to the API from inside a container would use http://backend:5000.',
        },
        {
          type: 'commands',
          title: 'The Compose commands you need',
          items: [
            { command: 'docker compose up --build', detail: 'Build both images if needed and start everything, logs in the foreground.' },
            { command: 'docker compose up -d', detail: 'Same, but detached - your terminal comes back.' },
            { command: 'docker compose ps', detail: 'Show the services, their state and their published ports.' },
            { command: 'docker compose logs -f backend', detail: 'Follow one service; drop the name to follow all of them together.' },
            { command: 'docker compose exec backend sh', detail: 'Open a shell inside the running backend container.' },
            { command: 'docker compose down', detail: 'Stop and remove the containers and the network they shared.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Compose is for one machine',
          body: 'It is excellent for local development and small deployments, but it only runs containers on the machine you type the command on. Spreading them across many machines, restarting the failures and scaling them up is the job Kubernetes takes over in the next section.',
        },
        {
          type: 'callout',
          variant: 'exam',
          title: 'Exam tip',
          body: 'Be ready to say what Compose adds over plain docker run: multiple services defined declaratively in one committed file, a shared network with name-based discovery, and one command to start or stop the whole set.',
        },
      ],
    },
  ],
};

const cicd = {
  id: 'cicd',
  number: '03',
  title: 'CI/CD',
  icon: Workflow,
  tagline: 'Let a machine test, build and ship on every push.',
  sections: [
    {
      id: 'cicd-theory',
      title: 'CI, Continuous Delivery, Continuous Deployment',
      blocks: [
        {
          type: 'text',
          body: [
            'CI/CD is the automation between "I pushed a commit" and "users have it". Instead of one nervous release every few months, you make small changes that a pipeline verifies and ships continuously.',
          ],
        },
        {
          type: 'concepts',
          title: 'Continuous Integration (CI)',
          items: [
            {
              term: 'Frequent integration',
              detail: 'Everyone merges into main often - ideally daily - so branches never drift far apart.',
            },
            {
              term: 'Automated testing',
              detail: 'Tests run on a clean machine for every push, not only on the laptop of whoever wrote the code.',
            },
            {
              term: 'Build verification',
              detail: 'The pipeline proves the project still installs and builds from scratch.',
            },
            {
              term: 'Pull requests',
              detail: 'Proposed changes get reviewed and must pass the checks before they can be merged.',
            },
          ],
        },
        {
          type: 'concepts',
          title: 'Delivery vs Deployment',
          items: [
            {
              term: 'Continuous Delivery',
              detail: 'Every change that passes the pipeline is automatically packaged and made ready to release. The final push to production is a human decision - one button.',
            },
            {
              term: 'Continuous Deployment',
              detail: 'Goes one step further: if all checks pass, the change goes to production automatically with no human step at all.',
            },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Same CD letters, different last step',
          body: 'Delivery = always ready to deploy, released manually. Deployment = actually deployed automatically. Both require a trustworthy test suite.',
        },
        {
          type: 'diagram',
          variant: 'flow',
          title: 'The pipeline',
          steps: [
            { label: 'Developer', sub: 'Writes code' },
            { label: 'git push', kind: 'command' },
            { label: 'GitHub', sub: 'Receives the commit' },
            { label: 'CI/CD Pipeline', sub: 'Triggered automatically' },
            { label: 'Test', sub: 'Run the test suite' },
            { label: 'Build', sub: 'Compile and bundle' },
            { label: 'Docker Image', sub: 'Push to a registry' },
            { label: 'Deploy', sub: 'Roll out the new version' },
            { label: 'Production', sub: 'Users get the change' },
          ],
        },
      ],
    },
    {
      id: 'cicd-actions',
      title: 'GitHub Actions',
      blocks: [
        {
          type: 'text',
          body: [
            'GitHub Actions is the CI/CD system built into GitHub. You commit a YAML file under .github/workflows/ and GitHub runs it on its own machines (runners) whenever the trigger you described happens.',
          ],
        },
        {
          type: 'concepts',
          title: 'Workflow vocabulary',
          items: [
            { term: 'Workflow', detail: 'One YAML file describing an automated process.' },
            { term: 'Trigger (on)', detail: 'The event that starts it: a push, a pull request, a schedule.' },
            { term: 'Job', detail: 'A group of steps that runs on one fresh virtual machine.' },
            { term: 'Runner', detail: 'The machine executing the job, for example ubuntu-latest.' },
            { term: 'Step', detail: 'A single command or a reusable action such as actions/checkout.' },
            { term: 'Secret', detail: 'Encrypted configuration (tokens, passwords) stored in GitHub, never in the repo.' },
          ],
        },
        {
          type: 'code',
          language: 'yaml',
          title: 'The shape of every workflow',
          code: `name: CI

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test`,
        },
        {
          type: 'code',
          language: 'yaml',
          title: '.github/workflows/ci.yml - the real pipeline in this project',
          code: `name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

      - name: Install backend dependencies
        run: npm ci
        working-directory: backend

      - name: Install frontend dependencies
        run: npm ci
        working-directory: frontend

      - name: Smoke test the API
        run: |
          node src/server.js &
          sleep 2
          curl -fsS http://localhost:5000/api/health
        working-directory: backend

      - name: Build frontend
        run: npm run build
        working-directory: frontend

      - name: Build backend image
        run: docker build -t se-kuppi-backend:\${{ github.sha }} ./backend

      - name: Build frontend image
        run: docker build -t se-kuppi-frontend:\${{ github.sha }} ./frontend`,
        },
        {
          type: 'concepts',
          title: 'Why each step is there',
          items: [
            { term: 'Checkout', detail: 'The runner starts empty. Without this step there is no package.json for npm to find.' },
            { term: 'Setup Node.js', detail: 'Installs the Node version we want and caches the npm downloads, so later runs are faster.' },
            { term: 'npm ci', detail: 'Installs exactly the lock file versions. npm install may quietly pick up newer patch releases.' },
            { term: 'Smoke test', detail: 'Starts the API and asks /api/health. curl -f exits non-zero on an error status, which fails the job.' },
            { term: 'Build frontend', detail: 'Proves the project still compiles from a clean checkout - not just on the laptop that last touched it.' },
            { term: 'Build images', detail: 'Proves both Dockerfiles are still valid. Tagged with the commit SHA for traceability.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'ci.yml stops at build',
          body: 'It verifies and packages, but pushes nothing and deploys nowhere. The release half lives in a second workflow, cd.yml, which pushes the images to Amazon ECR and restarts the containers on EC2.',
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Assuming the runner is your laptop',
          body: 'It is a clean machine every time: no node_modules, no .env, no globally installed tools, and no memory of the last run. Anything the build needs must either be in the repository or installed by a step. This is exactly why CI catches "works on my machine".',
        },
      ],
    },
    {
      id: 'cicd-deploy',
      title: 'The CD half: ECR and EC2',
      blocks: [
        {
          type: 'text',
          body: [
            'Continuous Integration proves the change is good. Continuous Delivery and Deployment take that proven change and put it somewhere real. In this project that is a second workflow, cd.yml, which pushes both images to Amazon ECR and then restarts the containers on an EC2 instance.',
            'It is triggered manually, by pressing Run workflow in the Actions tab. That single design choice is the whole Delivery versus Deployment distinction: a human decides when to release. Uncommenting the push trigger turns the same file into Continuous Deployment, where every merge to main ships by itself.',
          ],
        },
        {
          type: 'diagram',
          variant: 'flow',
          title: 'What cd.yml actually does',
          steps: [
            { label: 'Run workflow', sub: 'Pressed by a human, or a push to main' },
            { label: 'Configure AWS credentials', sub: 'From GitHub Secrets' },
            { label: 'Log in to ECR', sub: 'Returns the registry address' },
            { label: 'Build and push images', sub: 'Tagged with the commit SHA and latest' },
            { label: 'SSH into EC2', sub: 'Pull the new images' },
            { label: 'Restart containers', sub: 'Old removed, new started' },
            { label: 'Verify', sub: 'curl /api/health from outside' },
          ],
        },
        {
          type: 'concepts',
          title: 'The four secrets it needs',
          items: [
            { term: 'AWS_ACCESS_KEY_ID', detail: 'Access key of a scoped IAM user, so the runner can talk to ECR.' },
            { term: 'AWS_SECRET_ACCESS_KEY', detail: 'The matching secret. Encrypted by GitHub and masked in the logs.' },
            { term: 'EC2_HOST', detail: 'Public IPv4 of the instance. Also used to build the frontend API URL.' },
            { term: 'EC2_SSH_KEY', detail: 'Contents of the .pem private key, so the runner can SSH in and restart the containers.' },
          ],
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Deploying a frontend still pointing at localhost',
          body: 'The bundle has the API URL baked in from build time. If the image was built with the default http://localhost:5000, the deployed site loads fine and then every request fails - because localhost now means the student\u2019s own laptop, not the server. The workflow builds it with --build-arg VITE_API_URL=http://EC2_HOST:5000 for exactly this reason.',
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Why tag with the commit SHA',
          body: 'latest tells you nothing about what is running. A SHA tag means any container in production can be traced back to the exact commit that produced it, and rolling back is just deploying the previous tag.',
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Putting AWS keys in the YAML file',
          body: 'Workflow files are committed, so a key typed into one is in the Git history forever - and public repositories are scanned for exactly that within minutes. Use GitHub Secrets, and prefer OIDC with an IAM role, which issues a short-lived token per run and means there is no long-lived key to leak at all.',
        },
        {
          type: 'commands',
          title: 'Preparing AWS once, before the first deploy',
          items: [
            { command: 'aws ecr create-repository --repository-name se-kuppi-backend --region ap-southeast-1', detail: 'ECR does not create repositories on push; they must exist first.' },
            { command: 'aws ecr create-repository --repository-name se-kuppi-frontend --region ap-southeast-1', detail: 'One repository per image.' },
            { command: 'aws ecr describe-repositories --region ap-southeast-1', detail: 'Confirm both exist and copy their URIs.' },
            { command: 'aws ecr list-images --repository-name se-kuppi-backend --region ap-southeast-1', detail: 'After a deploy, check the tags that arrived.' },
          ],
        },
        {
          type: 'callout',
          variant: 'exam',
          title: 'Exam tip',
          body: 'A complete answer names the stages in order and who owns each: Git records, GitHub stores, Actions tests and builds, Docker packages, ECR stores the image, and the deploy step runs it on EC2 or Kubernetes.',
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Putting secrets in the YAML file',
          body: 'Workflow files are committed to the repository, so anything typed into them is visible in the history. Use GitHub Secrets and reference them, for example ${{ secrets.AWS_ACCESS_KEY_ID }}.',
        },
        {
          type: 'callout',
          variant: 'exam',
          title: 'Exam tip',
          body: 'A pipeline is simply an automated sequence of stages - typically test, build, package and deploy - that a change must pass through before it reaches production.',
        },
      ],
    },
  ],
};

const kubernetes = {
  id: 'kubernetes',
  number: '04',
  title: 'Kubernetes',
  icon: Ship,
  tagline: 'Run many containers reliably, heal them, scale them.',
  sections: [
    {
      id: 'k8s-why',
      title: 'Why Kubernetes exists',
      blocks: [
        {
          type: 'text',
          body: [
            'Docker runs a container on one machine. That is fine until you need twenty containers across five machines, with zero-downtime updates, automatic restarts when one crashes, and more copies when traffic doubles at exam results time.',
            'Kubernetes is a container orchestrator: you describe the desired state ("I want three copies of this image reachable at this address") and it continuously works to make reality match that description.',
          ],
        },
        {
          type: 'concepts',
          title: 'The objects you must know',
          items: [
            { term: 'Cluster', detail: 'The whole system: a control plane plus a set of worker machines.' },
            { term: 'Node', detail: 'One machine (virtual or physical) in the cluster that runs pods.' },
            { term: 'Pod', detail: 'The smallest deployable unit. Wraps one container (sometimes a few that must share a network).' },
            { term: 'Container', detail: 'Your actual Docker image running inside the pod.' },
            { term: 'Deployment', detail: 'Declares which image to run and how many replicas. Creates and replaces pods for you.' },
            { term: 'Service', detail: 'A stable name and IP in front of a changing set of pods, with load balancing.' },
            { term: 'Namespace', detail: 'A logical partition of the cluster, for example dev and prod side by side.' },
            { term: 'Replica', detail: 'One of the identical pod copies a Deployment keeps running.' },
          ],
        },
        {
          type: 'concepts',
          title: 'What you get for free',
          items: [
            { term: 'Self-healing', detail: 'If a pod dies, the Deployment notices the replica count is wrong and starts a new one.' },
            { term: 'Scaling', detail: 'Change replicas from 2 to 10 and Kubernetes schedules the extra pods.' },
            { term: 'Rolling updates', detail: 'New pods start and pass checks before old pods are removed, so users see no downtime.' },
          ],
        },
        {
          type: 'diagram',
          variant: 'tree',
          title: 'Cluster structure',
          root: {
            label: 'Kubernetes Cluster',
            children: [
              {
                label: 'Node 1',
                children: [
                  { label: 'Pod', children: [{ label: 'Container' }] },
                  { label: 'Pod', children: [{ label: 'Container' }] },
                ],
              },
              {
                label: 'Node 2',
                children: [{ label: 'Pod', children: [{ label: 'Container' }] }],
              },
            ],
          },
        },
        {
          type: 'diagram',
          variant: 'flow',
          title: 'Who creates what',
          steps: [
            { label: 'Deployment', sub: 'Desired state: 3 replicas' },
            { label: 'Pods', sub: 'Created and watched' },
            { label: 'Containers', sub: 'Your image, running' },
          ],
        },
        {
          type: 'diagram',
          variant: 'flow',
          title: 'How traffic reaches a pod',
          steps: [
            { label: 'User', sub: 'Browser request' },
            { label: 'Service', sub: 'Stable address, load balances' },
            { label: 'Pods', sub: 'Whichever copies are healthy' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Pods are cattle, not pets',
          body: 'Pods are created and destroyed constantly and their IPs change. Never point anything at a pod IP - point it at a Service.',
        },
      ],
    },
    {
      id: 'k8s-commands',
      title: 'Commands',
      blocks: [
        {
          type: 'commands',
          title: 'kubectl, the cluster remote control',
          items: [
            { command: 'kubectl version', detail: 'Check the client and cluster versions.' },
            { command: 'kubectl get nodes', detail: 'List the machines in the cluster.' },
            { command: 'kubectl get pods', detail: 'List pods and their status. The command you run most.' },
            { command: 'kubectl get deployments', detail: 'Show deployments with ready vs desired replicas.' },
            { command: 'kubectl get services', detail: 'Show services and the addresses they expose.' },
            { command: 'kubectl apply -f deployment.yaml', detail: 'Create or update objects from a YAML file.' },
            { command: 'kubectl delete -f deployment.yaml', detail: 'Remove the objects that file defines.' },
            { command: 'kubectl describe pod <name>', detail: 'Detailed state plus the event log. Best tool for "why is it not starting?".' },
            { command: 'kubectl logs <pod>', detail: 'Application output from the container.' },
            { command: 'kubectl exec -it <pod> -- sh', detail: 'Get a shell inside a running pod.' },
            { command: 'kubectl scale deployment se-kuppi-backend --replicas=4', detail: 'Change how many copies are running.' },
          ],
        },
        {
          type: 'concepts',
          title: 'Pod states you will meet',
          items: [
            { term: 'Pending', detail: 'Accepted but not running yet - often no node has enough resources, or the image is still downloading.' },
            { term: 'Running', detail: 'The container is up. This is the happy state.' },
            { term: 'Completed', detail: 'The process finished successfully. Normal for jobs, suspicious for a web server.' },
            { term: 'CrashLoopBackOff', detail: 'The container starts, crashes, and Kubernetes keeps restarting it with increasing delays. Read the logs - it is almost always an application error or a missing env variable.' },
            { term: 'ImagePullBackOff', detail: 'Kubernetes cannot download the image. Wrong name or tag, or missing registry credentials.' },
          ],
        },
        {
          type: 'code',
          language: 'yaml',
          title: 'Example Deployment + Service (educational - no k8s files in this repo yet)',
          code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: se-kuppi-backend
spec:
  replicas: 3
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
          image: se-kuppi-backend:1.0.0
          ports:
            - containerPort: 5000
          env:
            - name: PORT
              value: "5000"
---
apiVersion: v1
kind: Service
metadata:
  name: se-kuppi-backend
spec:
  selector:
    app: se-kuppi-backend
  ports:
    - port: 80
      targetPort: 5000
  type: ClusterIP`,
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Labels and selectors that do not match',
          body: 'A Service finds pods by label. If the Service selector says app: backend but the pods are labelled app: se-kuppi-backend, the Service has no endpoints and every request fails - with nothing in the logs.',
        },
        {
          type: 'callout',
          variant: 'exam',
          title: 'Exam tip',
          body: 'Remember the chain: Deployment manages ReplicaSets, ReplicaSets manage Pods, Pods contain Containers, and a Service gives Pods a stable address.',
        },
      ],
    },
  ],
};

const aws = {
  id: 'aws',
  number: '05',
  title: 'AWS Fundamentals',
  icon: Cloud,
  tagline: 'Rent the machines, storage and networking instead of owning them.',
  sections: [
    {
      id: 'aws-services',
      title: 'The services you should recognise',
      blocks: [
        {
          type: 'text',
          body: [
            'AWS is a cloud provider: you rent computing resources on demand instead of buying servers. There are hundreds of services, but for this Kuppi seven of them cover the whole journey.',
          ],
        },
        {
          type: 'concepts',
          title: 'Seven services',
          items: [
            { term: 'EC2 - Elastic Compute Cloud', detail: 'Virtual servers in the cloud. You choose the size and OS, you manage what runs on it.' },
            { term: 'S3 - Simple Storage Service', detail: 'Object storage for files: images, backups, build artefacts, static websites. Organised into buckets.' },
            { term: 'RDS - Relational Database Service', detail: 'Managed relational databases such as PostgreSQL or MySQL. AWS handles backups, patching and failover.' },
            { term: 'ECR - Elastic Container Registry', detail: 'A private Docker registry. Your CI pipeline pushes images here and Kubernetes pulls from it.' },
            { term: 'IAM - Identity and Access Management', detail: 'Users, roles and policies. Defines who can do what to which resource.' },
            { term: 'VPC - Virtual Private Cloud', detail: 'Your own isolated network: subnets, route tables, security groups.' },
            { term: 'EKS - Elastic Kubernetes Service', detail: 'Managed Kubernetes. AWS runs the control plane so you only manage your workloads.' },
          ],
        },
        {
          type: 'diagram',
          variant: 'map',
          title: 'Pick a service by the question you are asking',
          pairs: [
            { from: 'Need a server?', to: 'EC2' },
            { from: 'Need object storage?', to: 'S3' },
            { from: 'Need a relational database?', to: 'RDS' },
            { from: 'Need Docker image storage?', to: 'ECR' },
            { from: 'Need permissions?', to: 'IAM' },
            { from: 'Need networking?', to: 'VPC' },
            { from: 'Need managed Kubernetes?', to: 'EKS' },
          ],
        },
        {
          type: 'diagram',
          variant: 'tree',
          title: 'AWS by category',
          root: {
            label: 'AWS',
            children: [
              { label: 'Compute -> EC2' },
              { label: 'Storage -> S3' },
              { label: 'Database -> RDS' },
              { label: 'Container Registry -> ECR' },
              { label: 'Kubernetes -> EKS' },
              { label: 'Networking -> VPC' },
              { label: 'Security -> IAM' },
            ],
          },
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'Managed means less work, not magic',
          body: 'EC2 gives you a bare machine and all the responsibility. RDS and EKS take the boring operational parts (patching, backups, control plane) and charge you for the convenience.',
        },
        {
          type: 'callout',
          variant: 'mistake',
          title: 'Using root credentials or long-lived access keys',
          body: 'The root account should be locked away with MFA. Give each person and each service a dedicated IAM identity with the minimum permissions it needs - the principle of least privilege.',
        },
        {
          type: 'callout',
          variant: 'exam',
          title: 'Exam tip',
          body: 'Expect one-line matching questions. Compute = EC2, object storage = S3, relational database = RDS, image registry = ECR, permissions = IAM, networking = VPC, managed Kubernetes = EKS.',
        },
      ],
    },
  ],
};

const architecture = {
  id: 'architecture',
  number: '06',
  title: 'From Developer to Production',
  icon: Network,
  tagline: 'The whole journey on one page.',
  sections: [
    {
      id: 'architecture-flow',
      title: 'The complete path',
      blocks: [
        {
          type: 'text',
          body: [
            'Everything covered today is one pipeline. A change starts on a laptop and ends up serving users, and each tool owns exactly one part of that trip.',
          ],
        },
        {
          type: 'diagram',
          variant: 'tree',
          title: 'End to end',
          root: {
            label: 'Developer',
            children: [
              {
                label: 'Git',
                children: [
                  {
                    label: 'GitHub',
                    children: [
                      {
                        label: 'GitHub Actions',
                        children: [
                          {
                            label: 'Docker',
                            children: [
                              {
                                label: 'Amazon ECR',
                                children: [
                                  {
                                    label: 'Kubernetes / EKS',
                                    children: [
                                      { label: 'React Frontend' },
                                      {
                                        label: 'Node.js Backend',
                                        children: [{ label: 'Database' }],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'concepts',
          title: 'What each stage contributes',
          items: [
            { term: 'Developer', detail: 'Writes and runs the code locally - exactly what the Live Demo page shows.' },
            { term: 'Git', detail: 'Records the change as a commit with a message and an author.' },
            { term: 'GitHub', detail: 'Hosts the shared repository and runs code review through pull requests.' },
            { term: 'GitHub Actions', detail: 'Reacts to the push: installs dependencies, runs tests, builds the app.' },
            { term: 'Docker', detail: 'Packages the built app with its runtime into a versioned image.' },
            { term: 'Amazon ECR', detail: 'Stores that image privately so the cluster can pull it by tag.' },
            { term: 'Kubernetes / EKS', detail: 'Pulls the image and keeps the right number of healthy pods running behind Services.' },
            { term: 'React frontend', detail: 'Served to browsers; talks to the backend through its Service URL.' },
            { term: 'Node.js backend', detail: 'Serves the REST API. Today it holds data in memory; in production it would not.' },
            { term: 'Database', detail: 'Keeps state outside the containers, so pods can be replaced without losing data.' },
          ],
        },
        {
          type: 'callout',
          variant: 'key',
          title: 'One sentence to remember the whole session',
          body: 'Git tracks it, GitHub shares it, Actions verifies it, Docker packages it, ECR stores it, Kubernetes runs it, AWS hosts it.',
        },
      ],
    },
  ],
};

const revision = {
  id: 'revision',
  number: '07',
  title: 'Exam Quick Revision',
  icon: Zap,
  tagline: 'Short questions, short answers. Reveal each one to test yourself.',
  sections: [
    {
      id: 'revision-qa',
      title: 'Questions and answers',
      blocks: [
        {
          type: 'text',
          body: [
            'Click a question to reveal the answer. Say your answer out loud first - recognising an answer is much easier than producing one.',
          ],
        },
        {
          type: 'qa',
          groups: [
            {
              title: 'Git',
              items: [
                { q: 'What is Git?', a: 'A distributed version control system that records snapshots of a project over time.' },
                { q: 'What is GitHub?', a: 'A cloud platform that hosts Git repositories and adds collaboration features such as pull requests and Actions.' },
                { q: 'What is a commit?', a: 'A saved snapshot of the staged changes, with a message, an author and a unique hash.' },
                { q: 'What is a branch?', a: 'A movable pointer to a commit that lets you develop independently of main.' },
                { q: 'What is a merge conflict?', a: 'Two branches changed the same lines of the same file, so Git cannot merge automatically and a human must resolve it.' },
                { q: 'What does .gitignore do?', a: 'Lists files and folders Git should not track, such as node_modules, dist and .env.' },
              ],
            },
            {
              title: 'Docker',
              items: [
                { q: 'What is an image?', a: 'A read-only template containing the application, its dependencies and its runtime.' },
                { q: 'What is a container?', a: 'A running instance of an image, isolated from the host and from other containers.' },
                { q: 'What is a Dockerfile?', a: 'A text file of instructions (FROM, WORKDIR, COPY, RUN, CMD) that Docker uses to build an image.' },
                { q: 'What does -p do in docker run?', a: 'Maps a host port to a container port, as in -p 3000:3000 (host:container), so the app is reachable from outside.' },
                { q: 'What is a registry?', a: 'A store for images, such as Docker Hub or Amazon ECR, that machines pull from.' },
                { q: 'Why use a volume?', a: 'To keep data outside the container so it survives the container being deleted or replaced.' },
              ],
            },
            {
              title: 'CI/CD',
              items: [
                { q: 'What is Continuous Integration?', a: 'Merging code into the shared branch frequently, with automated tests and builds verifying every change.' },
                { q: 'What is Continuous Delivery?', a: 'Every passing change is automatically packaged and kept ready to release; the release itself is a manual decision.' },
                { q: 'What is Continuous Deployment?', a: 'Every change that passes the pipeline is deployed to production automatically, with no manual step.' },
                { q: 'What is a pipeline?', a: 'An automated sequence of stages - typically test, build, package, deploy - that a change must pass before reaching production.' },
                { q: 'What are GitHub Actions?', a: 'GitHub\u2019s built-in CI/CD service that runs YAML-defined workflows on triggers such as push or pull_request.' },
              ],
            },
            {
              title: 'Kubernetes',
              items: [
                { q: 'What is a Pod?', a: 'The smallest deployable unit in Kubernetes: one or more containers sharing a network and storage.' },
                { q: 'What is a Deployment?', a: 'An object that declares which image to run and how many replicas, then creates, replaces and updates pods to match.' },
                { q: 'What is a Service?', a: 'A stable network address that load balances traffic across a changing set of pods.' },
                { q: 'What does kubectl do?', a: 'It is the command line client that sends your instructions and queries to the Kubernetes API server.' },
                { q: 'What is CrashLoopBackOff?', a: 'A pod state where the container repeatedly starts and crashes, so Kubernetes restarts it with growing delays.' },
                { q: 'What is container orchestration?', a: 'Automatically deploying, scaling, healing and networking containers across a group of machines.' },
              ],
            },
            {
              title: 'AWS',
              items: [
                { q: 'What is EC2?', a: 'Elastic Compute Cloud - virtual servers you rent in the cloud.' },
                { q: 'What is S3?', a: 'Simple Storage Service - object storage for files, organised into buckets.' },
                { q: 'What is RDS?', a: 'Relational Database Service - managed SQL databases with backups and patching handled by AWS.' },
                { q: 'What is ECR?', a: 'Elastic Container Registry - a private registry for your Docker images.' },
                { q: 'What is IAM?', a: 'Identity and Access Management - users, roles and policies controlling who can do what.' },
                { q: 'What is VPC?', a: 'Virtual Private Cloud - your own isolated network inside AWS.' },
                { q: 'What is EKS?', a: 'Elastic Kubernetes Service - managed Kubernetes where AWS operates the control plane.' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const topics = [git, docker, cicd, kubernetes, aws, architecture, revision];

export function findTopic(id) {
  return topics.find((topic) => topic.id === id);
}
