# NextJs JiraApp

For to excecute in local, its necesary the database:

```
docker-compose up -d
```

MongoDB local URL

```
mongo://localhost:27017/entriesdb
```

## Env variables

- Rename **.env.example** to **.env**

## Seed

- Initial seed and database cleanup

```
http://localhost:3000/api/seed
```
