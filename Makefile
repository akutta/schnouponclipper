all: clean build run
build:
	docker build -t akutta/schnouponclipper .
run:
	docker run --env SCHNOUPON_KEY=${SCHNOUPON_KEY} --name schnouponclipper -d -t akutta/schnouponclipper
clean:
	docker rm -f `docker ps -qa --filter "name=schnouponclipper"` &>/dev/null || true
logs:
	docker logs schnouponclipper
