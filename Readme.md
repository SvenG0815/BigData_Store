# BigData_store

BigData_store is a BigData application for learning, how BigData handling and processing is done.  

## Getting Started

1. download the project.
2. meet the prerequisites 
3. deploy the application using [Skaffold](https://skaffold.dev/), use `skaffold dev`.
4. make sure, webapp:3000 is accessible as localhost:3000 (via ingress/port forward)
5. open frontend-service:80 (via ingress/port forward)
6. add some Advertisments by clicking create and creating some in the top menu bar of the frontend.
7. lookup the logfile for the sparkapp pod in kubernetes. `kubectl logs -f popular-slides-spark-[0000000-00000]`

note: mysql database persistency of the batch output is not implemented yet.

## Prerequisites

A running Strimzi.io Kafka operator

```bash
helm repo add strimzi http://strimzi.io/charts/
helm install my-kafka-operator strimzi/strimzi-kafka-operator
kubectl apply -f https://farberg.de/talks/big-data/code/helm-kafka-operator/kafka-cluster-def.yaml
```

A running Hadoop cluster with YARN

```bash
helm repo add stable https://charts.helm.sh/stable
helm install --namespace=default --set hdfs.dataNode.replicas=1 --set yarn.nodeManager.replicas=1 --set hdfs.webhdfs.enabled=true my-hadoop-cluster stable/hadoop
```

## Deploy

To develop using [Skaffold](https://skaffold.dev/), use `skaffold dev`.  

## Authors

* **Tobias Mahler** -  [TobiasMahler](https://github.com/TobiasMahler)
* **Sven Guenther** - [SvenG0815](https://github.com/SvenG0815)
* **Lukas Bossani** - [lukiboss31](https://github.com/lukiboss31)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details
