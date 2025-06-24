# Makefile for managing the project

.PHONY: up down logs install lint lint-fix build sh

# Start the docker containers in detached mode
up:
	docker-compose up --build -d

# Stop and remove the docker containers
down:
	docker-compose down

# View logs from the containers
logs:
	docker-compose logs -f

# Install npm dependencies
install:
	docker-compose run --rm app npm install

# Run the linter
lint:
	docker-compose run --rm app npm run lint

# Fix linting issues
lint-fix:
	docker-compose run --rm app npm run lint:fix

# Build the application for production
build:
	docker-compose run --rm app npm run build

# Open a shell inside the app container
sh:
	docker-compose exec app sh
