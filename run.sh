imageName="worker-threads:v1"
docker build -t $imageName .
docker run -it -p 5000:5000 --rm $imageName