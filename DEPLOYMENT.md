# Deploying Chorde

## Prerequisites
- Ensure all changes are committed and pushed to `main`.

## Deployment Script
The project includes a `deploy.sh` script that handles building and pushing to the `gh-pages` branch.

### Usage
Run the following command from the project root:

```bash
./deploy.sh
```

### What it does
1.  **Builds** the project using `npm run build` (Vite).
2.  Navigates to the `dist` folder.
3.  Initializes a temporary git repo.
4.  Commits the build artifacts.
5.  **Force pushes** to the `gh-pages` branch of the remote repository (`https://github.com/shonegrad/chorde.git`).

## Verifying Deployment
After the script completes, visit:
[https://shonegrad.github.io/chorde/](https://shonegrad.github.io/chorde/)

*Note: Changes may take a few minutes to propagate.*
