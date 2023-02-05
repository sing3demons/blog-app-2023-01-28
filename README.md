# blog-app-2023-01-28

## dev
```run backend
docker compose up -d
```
```
yarn start
```

## production
```
docker compose -f docker-compose.prod.yml up -d
docker-compose down --remove-orphans
```