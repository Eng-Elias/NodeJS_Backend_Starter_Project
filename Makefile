# Makefile for managing the project

.PHONY: dev up down logs install lint lint-fix build sh

# Start the docker containers in development mode
dev:
	docker-compose up --build

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

# Run tests and clean up the test database
test:
	@echo "Running tests with isolated database..."
	docker-compose run --rm -e MONGO_URI=mongodb://mongo:27017/mydatabase-test app npm run test

# Run migrations
migrate:
	docker-compose run --rm app npm run migrate

# Run DB seed
seed:
	docker-compose run --rm app npm run seed
