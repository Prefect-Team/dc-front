# [Quint Frontend]

## 🔧 Setting up Local Development

Required:

- [Node v16](https://nodejs.org/download/release/latest-v16.x/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)

```bash
$ git clone https://github.com/Prefect-Team/dc-front.git
$ cd quint-front

# set up your environment variables
# read the comments in the .env files for what is required/optional
$ cp .env.example .env

# fill in your own values in .env, then =>
$ yarn
$ yarn start

# Set up Husky (for pre-commit hooks) by running:
$ yarn prepare
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

If you would like to run the frontend in a Docker image (e.g. to isolate dependencies and the nodejs version), run `yarn docker-start`.
