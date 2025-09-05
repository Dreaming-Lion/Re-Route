#!/bin/bash
# clean-docker.sh

echo "Stopping and removing all containers, networks, volumes, and images created by docker-compose..."
docker-compose down -v --rmi all --remove-orphans

echo "Pruning dangling images/volumes/networks..."
docker system prune -af --volumes
