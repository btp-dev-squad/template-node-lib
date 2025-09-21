# Aarini Node JS Starter Template

# Branches

1. main - Productive branch
2. develop - Development branch
3. staging - Pre-production branch

## Branch Protection

The branch protection rules are to be executed to prevent the productive landscape `main`, `develop` and `staging`. 

To set up the validation, setup the permission to the executables. The scripts can be executed via either the shell command or script file. 

**Shell Command**

```sh
chmod +x ./scripts/setup.sh
```

**Script command**

```sh
chmod +x ./scripts/setup.js
```

After the executables permissions are set, then run the script to add branch protection rule. 

```sh
./scripts/setup.sh <repo_org> <repo_name> <github_token>
```