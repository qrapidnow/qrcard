{
  "version": 2,
  "name": "mern-stack-project",
  "builds": [
    { "src": "backend/app.js", "use": "@vercel/node" },
    { "src": "frontend/package.json", "use": "@vercel/static-build", "config": { "distDir": "frontend/build" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/app.js" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ]
}
