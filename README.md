# VueJS - Php - Nginx

Boilerplate docker contenant :
- Une PWA VueJS avec authentification
- Un serveur HTTP Nginx
- Php 7 avec connexion à une base de données
- MySQL
- La documentation des différentes parties 

## TODO
- Docker compose de production
- Graphique architecture
- Doc docker

## Prérequis
- La dernière version de NodeJS LTS
- La dernière version de docker
- La dernière version de docker-compose
- Git

## Installation 

Cloner le projet :
```
git clone git@github.com:averdier/vuejs_php_nginx.git
```

Installer les dépendances:
```
cd vuejs_php_nginx/frontend
npm install

cd vuejs_php_nginx/backend
docker run --rm -v ${PWD}:/app composer/composer install
```

## Architecture

## Documentations

- [Backend](./docs/backend.md)
- [Frontend](./docs/frontend.md)
- [Docker](./docs/docker.md)

## Utilisation

### Développement

Lancer le projet
```
cd vuejs_php_nginx

docker-compose -f ./docker/docker-compose-dev.yml up -d
```

Stopper le projet
```
cd vuejs_php_nginx

docker-compose -f ./docker/docker-compose-dev.yml stop
```

Clean du des données

```
cd vuejs_php_nginx

docker-compose -f ./docker/docker-compose-dev.yml down -v
```