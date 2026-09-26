import { GitBranch, Container, Workflow, Ship, Cloud, Rocket } from 'lucide-react';

// The spine of the whole Kuppi: one project moving from a laptop to production.
// `topic` points at the matching notes section so every stage is clickable.
export const journeyStages = [
  {
    id: 'git',
    icon: GitBranch,
    label: 'Git & GitHub',
    summary: 'Track every change and share the project with the team.',
    detail: 'Working directory -> staging area -> commit -> GitHub',
    topic: 'git',
  },
  {
    id: 'docker',
    icon: Container,
    label: 'Docker',
    summary: 'Package the app with its environment so it runs anywhere.',
    detail: 'Dockerfile -> image -> container',
    topic: 'docker',
  },
  {
    id: 'cicd',
    icon: Workflow,
    label: 'CI/CD',
    summary: 'Test, build and ship automatically on every push.',
    detail: 'git push -> test -> build -> deploy',
    topic: 'cicd',
  },
  {
    id: 'kubernetes',
    icon: Ship,
    label: 'Kubernetes',
    summary: 'Run many containers reliably, heal and scale them.',
    detail: 'Deployment -> pods -> containers',
    topic: 'kubernetes',
  },
  {
    id: 'aws',
    icon: Cloud,
    label: 'AWS',
    summary: 'Rent the compute, storage and networking underneath.',
    detail: 'EC2 - S3 - RDS - ECR - EKS',
    topic: 'aws',
  },
  {
    id: 'production',
    icon: Rocket,
    label: 'Production',
    summary: 'Real users hitting the app you wrote this morning.',
    detail: 'The full pipeline, end to end',
    topic: 'architecture',
  },
];
