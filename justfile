# Run the API and the app in watch mode, with the app calling the local API
[parallel]
dev: dev-api dev-app

[working-directory: 'api']
dev-api:
    npm run dev

[working-directory: 'app']
dev-app:
    npm run dev
