# Local MongoDB Setup
How to setup a local mongodb database using docker.
Steps:
1. Pull the mongodb image from dockerhub: `docker pull mongo`
2. Run the image with specific environment variables to setup a root user with a password:
	`docker
docker run -d  --name mongo-on-docker  -p 27888:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
`
3. Connect with the URI `mongodb://mongoadmin:secret@localhost:27888/message-board?authSource=admin`