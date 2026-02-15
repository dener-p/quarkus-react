
# Default target
.DEFAULT_GOAL := help

# ---------- DEV ----------
dev:
	docker compose -f docker-compose.dev.yml up -d --build

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f


# ---------- PROD ----------
prod:
	docker compose -f docker-compose.prod.yml up --build -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f


# ---------- CLEAN ----------
clean:
	docker system prune -f


# ---------- HELP ----------
help:
	@echo ""
	@echo "Available commands:"
	@echo "  make dev            Start dev environment"
	@echo "  make dev-down       Stop dev"
	@echo "  make dev-logs       Tail dev logs"
	@echo ""
	@echo "  make prod           Start prod environment"
	@echo "  make prod-down      Stop prod"
	@echo "  make prod-logs      Tail prod logs"
	@echo ""
	@echo "  make clean          Docker cleanup"
	@echo ""
