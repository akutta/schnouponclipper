all: clean build run
build:
	docker build -t akutta/schnouponclipper .
run:
	docker run --name schnouponclipper -d -t akutta/schnouponclipper
clean:
	docker rm -f `docker ps -q --filter "name=schnouponclipper"` &>/dev/null || true
