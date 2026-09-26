// Multiple choice questions, one set per notes topic.
// `answer` is the index of the correct option. Titles and icons are not repeated
// here - the Quiz page looks those up from notes.js so the two never drift apart.

export const quizTopicIds = ['git', 'docker', 'cicd', 'kubernetes', 'aws'];

const questions = {
  git: [
    {
      id: 'git-1',
      question: 'What does git add do?',
      options: [
        'Uploads your changes to GitHub',
        'Moves chosen changes into the staging area for the next commit',
        'Creates a new branch',
        'Permanently saves a snapshot of the project',
      ],
      answer: 1,
      explanation:
        'git add only stages changes. The snapshot is created later by git commit, and nothing reaches GitHub until git push.',
    },
    {
      id: 'git-2',
      question: 'Which command creates a new branch and switches to it in one step?',
      options: ['git branch feature/login', 'git merge feature/login', 'git switch -c feature/login', 'git checkout main'],
      answer: 2,
      explanation:
        'git branch creates a branch but leaves you where you are. The -c flag on git switch creates it and moves you onto it.',
    },
    {
      id: 'git-3',
      question: 'What is the difference between Git and GitHub?',
      options: [
        'They are two names for the same tool',
        'Git is the version control tool on your machine; GitHub hosts repositories online',
        'Git is the paid version of GitHub',
        'GitHub tracks history and Git only shares it',
      ],
      answer: 1,
      explanation:
        'Git works entirely offline and stores the history in .git. GitHub is one of many places you can host a copy of that history.',
    },
    {
      id: 'git-4',
      question: 'A merge conflict happens when:',
      options: [
        'You forget to write a commit message',
        'Two branches changed the same part of the same file differently',
        'You push to the wrong remote',
        'Your branch is behind main',
      ],
      answer: 1,
      explanation:
        'Git merges automatically whenever it can. It only stops and asks a human when the same lines were changed in two different ways.',
    },
    {
      id: 'git-5',
      question: 'Which of these belongs in .gitignore?',
      options: ['src/App.jsx', 'package.json', 'node_modules/ and .env', 'README.md'],
      answer: 2,
      explanation:
        'node_modules can be reinstalled and .env holds credentials, so neither should ever be committed. Source files and manifests must be tracked.',
    },
    {
      id: 'git-6',
      question: 'git pull is equivalent to:',
      options: [
        'git fetch followed by git merge',
        'git push in reverse, discarding local commits',
        'git clone into the current folder',
        'git add followed by git commit',
      ],
      answer: 0,
      explanation:
        'Pull is a convenience command: it downloads the remote commits (fetch) and then merges them into your current branch.',
    },
    {
      id: 'git-7',
      question: 'In a conflicted file, what sits between <<<<<<< HEAD and =======?',
      options: [
        'The version from the branch you are merging in',
        'The version on your current branch',
        'A backup Git created automatically',
        'The oldest version of the file',
      ],
      answer: 1,
      explanation:
        'HEAD is where you are standing, so that block is your current branch. The incoming version is below ======= up to >>>>>>>.',
    },
    {
      id: 'git-8',
      question: 'Which command shows the commit history?',
      options: ['git status', 'git log', 'git remote -v', 'git branch'],
      answer: 1,
      explanation:
        'git status shows what has changed right now; git log shows the commits already recorded. Try git log --oneline --graph.',
    },
  ],

  docker: [
    {
      id: 'docker-1',
      question: 'What is the relationship between an image and a container?',
      options: [
        'A container is a template; an image is a running copy of it',
        'An image is a read-only template; a container is a running instance of it',
        'They are the same thing with different names',
        'An image runs inside a container',
      ],
      answer: 1,
      explanation:
        'Think class and object: the image is the definition, the container is the live instance. One image can start many containers.',
    },
    {
      id: 'docker-2',
      question: 'What does -p 3000:3000 do in docker run -p 3000:3000 my-app?',
      options: [
        'Runs the app with 3000 MB of memory',
        'Maps port 3000 on your machine to port 3000 inside the container',
        'Starts three thousand processes',
        'Sets the PORT environment variable',
      ],
      answer: 1,
      explanation:
        'The format is host:container. Without it, the container runs fine but nothing on your machine can reach it.',
    },
    {
      id: 'docker-3',
      question: 'What is a Dockerfile?',
      options: [
        'A log of everything a container did',
        'A text file of instructions Docker follows to build an image',
        'A compressed copy of a running container',
        'The configuration file for Docker Hub',
      ],
      answer: 1,
      explanation:
        'It is the recipe: FROM, WORKDIR, COPY, RUN, EXPOSE, CMD. docker build turns it into an image.',
    },
    {
      id: 'docker-4',
      question: 'Why do we COPY package*.json and run npm install before COPY . . ?',
      options: [
        'npm refuses to work any other way',
        'So Docker can cache the dependency layer and skip reinstalling when only source code changes',
        'To make the final image smaller',
        'Because COPY . . deletes the manifests',
      ],
      answer: 1,
      explanation:
        'Docker caches each layer. If only your source changed, the expensive npm install layer is reused and the build is much faster.',
    },
    {
      id: 'docker-5',
      question: 'What is Docker Hub?',
      options: [
        'The Docker desktop application',
        'A public registry that stores and serves images',
        'The command line tool for building images',
        'A tool for orchestrating containers across machines',
      ],
      answer: 1,
      explanation:
        'A registry stores images so other machines can pull them. Docker Hub is the public default; Amazon ECR is a private alternative.',
    },
    {
      id: 'docker-6',
      question: 'Which problem is Docker mainly solving?',
      options: [
        'Writing code faster',
        'The app needs a specific environment, and every machine has a slightly different one',
        'Storing data permanently',
        'Keeping track of code changes',
      ],
      answer: 1,
      explanation:
        'This is the "works on my machine" problem. Shipping the environment with the code means what you tested is what runs.',
    },
    {
      id: 'docker-7',
      question: 'Which command lists containers that have stopped?',
      options: ['docker ps', 'docker ps -a', 'docker images', 'docker logs'],
      answer: 1,
      explanation:
        'docker ps shows only running containers. The -a flag adds the stopped ones, which is where you look when something exited.',
    },
    {
      id: 'docker-8',
      question: 'What happens to data written inside a container when the container is removed?',
      options: [
        'It is lost, unless it was written to a volume',
        'It is always kept in the image',
        'It is automatically backed up to Docker Hub',
        'It moves to the next container you start',
      ],
      answer: 0,
      explanation:
        'Containers are disposable. Anything that must survive being replaced belongs in a volume or an external database.',
    },
  ],

  cicd: [
    {
      id: 'cicd-1',
      question: 'What is Continuous Integration?',
      options: [
        'Deploying to production several times a day',
        'Merging into the shared branch frequently, with automated tests and builds checking every change',
        'Writing tests after a release',
        'Keeping each feature on its own branch for months',
      ],
      answer: 1,
      explanation:
        'CI is about integrating often and letting automation verify each integration, so problems surface within minutes.',
    },
    {
      id: 'cicd-2',
      question: 'What separates Continuous Delivery from Continuous Deployment?',
      options: [
        'Delivery runs tests, deployment does not',
        'Delivery keeps every passing change ready to release; deployment releases it automatically',
        'They are the same thing',
        'Deployment only applies to mobile apps',
      ],
      answer: 1,
      explanation:
        'Both automate the pipeline. Delivery leaves a human to press the button; deployment removes even that step.',
    },
    {
      id: 'cicd-3',
      question: 'Where must a GitHub Actions workflow file live?',
      options: ['In the repository root', 'In .github/workflows/', 'In .git/hooks/', 'Anywhere, as long as it ends in .yml'],
      answer: 1,
      explanation:
        'GitHub only picks up YAML files inside .github/workflows/. A workflow anywhere else is just a text file.',
    },
    {
      id: 'cicd-4',
      question: 'What does this trigger mean?  on: push: branches: [main]',
      options: [
        'Run once when the repository is created',
        'Run every hour on main',
        'Run whenever commits are pushed to the main branch',
        'Run only when a pull request is merged',
      ],
      answer: 2,
      explanation:
        'The on block is the trigger. This one fires on any push to main; pull_request or schedule would be different triggers.',
    },
    {
      id: 'cicd-5',
      question: 'In GitHub Actions, what is a runner?',
      options: [
        'The developer who started the workflow',
        'The machine that executes a job, for example ubuntu-latest',
        'A script that deploys to production',
        'The queue that stores pending workflows',
      ],
      answer: 1,
      explanation:
        'Each job gets a fresh runner. That freshness is what proves your project installs and builds from nothing.',
    },
    {
      id: 'cicd-6',
      question: 'Where should an AWS access key used by a workflow be stored?',
      options: [
        'Hard-coded in the workflow YAML',
        'In GitHub Secrets, referenced as ${{ secrets.NAME }}',
        'In a committed .env file',
        'In the commit message',
      ],
      answer: 1,
      explanation:
        'Workflow files are committed and visible in history. Secrets are encrypted and injected at run time instead.',
    },
    {
      id: 'cicd-7',
      question: 'A pipeline is best described as:',
      options: [
        'A branch reserved for releases',
        'An automated sequence of stages such as test, build, package and deploy',
        'The network link between GitHub and your server',
        'A log of all deployments',
      ],
      answer: 1,
      explanation:
        'Each stage must pass before the next runs, so a broken change stops early instead of reaching users.',
    },
    {
      id: 'cicd-8',
      question: 'What does the step  uses: actions/checkout@v4  do?',
      options: [
        'Installs Node.js on the runner',
        'Clones your repository onto the runner so later steps can see the code',
        'Checks out a pull request for review',
        'Publishes a release',
      ],
      answer: 1,
      explanation:
        'A fresh runner starts empty. Without checkout, commands like npm install have no package.json to work with.',
    },
  ],

  kubernetes: [
    {
      id: 'k8s-1',
      question: 'What is the smallest deployable unit in Kubernetes?',
      options: ['A container', 'A Pod', 'A Node', 'A Deployment'],
      answer: 1,
      explanation:
        'You never schedule a bare container. Kubernetes wraps one or more containers in a Pod, which shares a network and storage.',
    },
    {
      id: 'k8s-2',
      question: 'Which object keeps the requested number of replicas running?',
      options: ['Service', 'Namespace', 'Deployment', 'Node'],
      answer: 2,
      explanation:
        'A Deployment declares the desired state. If a pod dies, it notices the count is wrong and creates a replacement.',
    },
    {
      id: 'k8s-3',
      question: 'Why should you never send traffic to a pod IP directly?',
      options: [
        'Pod IPs are blocked by the firewall',
        'Pods are replaced constantly and their IPs change, so you use a Service instead',
        'Pod IPs only work inside one container',
        'It is slower than using a Service',
      ],
      answer: 1,
      explanation:
        'A Service is the stable address in front of a changing set of pods, and it load balances across the healthy ones.',
    },
    {
      id: 'k8s-4',
      question: 'A pod is in CrashLoopBackOff. What does that mean?',
      options: [
        'The image could not be downloaded',
        'The container keeps starting, crashing and being restarted with growing delays',
        'No node has enough resources for it',
        'The container finished its work successfully',
      ],
      answer: 1,
      explanation:
        'The pod was scheduled and the image was pulled, so the problem is inside your app. kubectl logs is the next step.',
    },
    {
      id: 'k8s-5',
      question: 'ImagePullBackOff usually means:',
      options: [
        'The app crashed on startup',
        'Kubernetes cannot download the image - wrong name or tag, or missing registry credentials',
        'The pod was deleted manually',
        'The readiness check failed',
      ],
      answer: 1,
      explanation:
        'Nothing has run yet at this point. Check the image name and tag first, then whether the cluster can authenticate to the registry.',
    },
    {
      id: 'k8s-6',
      question: 'What does kubectl apply -f deployment.yaml do?',
      options: [
        'Validates the file without changing anything',
        'Creates the objects described in the file, or updates them if they already exist',
        'Deletes and recreates the cluster',
        'Downloads the current state into the file',
      ],
      answer: 1,
      explanation:
        'apply is declarative: you describe what you want and Kubernetes works out which changes are needed.',
    },
    {
      id: 'k8s-7',
      question: 'How do you run four copies of an existing deployment?',
      options: [
        'kubectl get pods --replicas=4',
        'kubectl scale deployment se-kuppi-backend --replicas=4',
        'kubectl apply -f pod.yaml four times',
        'kubectl exec --replicas=4',
      ],
      answer: 1,
      explanation:
        'You change the desired replica count, either with kubectl scale or by editing replicas in the Deployment YAML.',
    },
    {
      id: 'k8s-8',
      question: 'What makes a rolling update different from simply restarting everything?',
      options: [
        'It is faster because all pods restart at once',
        'New pods start and become healthy before old pods are removed, so there is no downtime',
        'It skips the image pull',
        'It only works on a single node',
      ],
      answer: 1,
      explanation:
        'Kubernetes replaces pods gradually. Users keep hitting healthy pods throughout the update.',
    },
  ],

  aws: [
    {
      id: 'aws-1',
      question: 'You need a virtual server in the cloud. Which service?',
      options: ['S3', 'EC2', 'IAM', 'ECR'],
      answer: 1,
      explanation:
        'EC2 (Elastic Compute Cloud) rents you virtual machines. You choose the size and OS and manage what runs on them.',
    },
    {
      id: 'aws-2',
      question: 'Which service stores files such as images, backups and build artefacts?',
      options: ['S3', 'RDS', 'VPC', 'EKS'],
      answer: 0,
      explanation:
        'S3 is object storage, organised into buckets. It is for files, not for running queries over structured data.',
    },
    {
      id: 'aws-3',
      question: 'You want a managed PostgreSQL database with automatic backups. Which service?',
      options: ['S3', 'EC2', 'RDS', 'ECR'],
      answer: 2,
      explanation:
        'RDS runs relational databases for you, handling patching, backups and failover. You could install PostgreSQL on EC2, but then all of that is your job.',
    },
    {
      id: 'aws-4',
      question: 'Where does your CI pipeline push the Docker image so the cluster can pull it?',
      options: ['S3', 'ECR', 'IAM', 'RDS'],
      answer: 1,
      explanation:
        'ECR (Elastic Container Registry) is the private image registry - the AWS equivalent of a private Docker Hub.',
    },
    {
      id: 'aws-5',
      question: 'Which service decides who is allowed to do what to which resource?',
      options: ['VPC', 'IAM', 'EKS', 'EC2'],
      answer: 1,
      explanation:
        'IAM holds users, roles and policies. Give every person and service the minimum permissions it needs.',
    },
    {
      id: 'aws-6',
      question: 'Subnets, route tables and security groups belong to which service?',
      options: ['VPC', 'S3', 'IAM', 'RDS'],
      answer: 0,
      explanation:
        'A VPC (Virtual Private Cloud) is your own isolated network inside AWS, and everything you run sits somewhere in it.',
    },
    {
      id: 'aws-7',
      question: 'What does EKS give you that plain EC2 does not?',
      options: [
        'Cheaper storage',
        'A managed Kubernetes control plane, so you only manage your workloads',
        'Automatic code deployment from GitHub',
        'A relational database',
      ],
      answer: 1,
      explanation:
        'You could install Kubernetes yourself on EC2 instances. EKS means AWS operates the control plane for you.',
    },
    {
      id: 'aws-8',
      question: 'What is the recommended way to use the AWS root account?',
      options: [
        'Use it daily, since it has all permissions',
        'Share it with the team so everyone can help',
        'Lock it down with MFA and work through IAM identities with least privilege',
        'Store its access key in the repository for automation',
      ],
      answer: 2,
      explanation:
        'The root account can do anything, including closing the account. Secure it and never use it for day-to-day work.',
    },
  ],
};

export function getQuiz(topicId) {
  return questions[topicId] ?? [];
}

export function hasQuiz(topicId) {
  return getQuiz(topicId).length > 0;
}
