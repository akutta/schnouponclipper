all: clean build run
build:
	docker build -t akutta/schnouponclipper .
run:
	docker run --env USERNAME=${USERNAME} --env PASSWORD=${PASSWORD} --name schnouponclipper -d -t akutta/schnouponclipper
clean:
	docker rm -f `docker ps -qa --filter "name=schnouponclipper"` &>/dev/null || true
release:
	docker push akutta/schnouponclipper
logs:
	docker logs schnouponclipper
