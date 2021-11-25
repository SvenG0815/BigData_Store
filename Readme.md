Commands used:
kubectl create -f postgres-configmap.yaml
kubectl create -f postgresinit-configmap.yaml
kubectl create -f postgres-storage.yaml
kubectl create -f deployment.yaml
kubectl create -f postgres-service.yaml
#Find IP
kubectl get svc postgres

#Connect Shell to Container
kubectl exec --stdin --tty postgres-69bc4f7bc8-xj7lp -- /bin/bash


Postgress install:
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install my-release bitnami/postgresql


after install following log displayed:
PostgreSQL can be accessed via port 5432 on the following DNS names from within your cluster:

    postgres-postgresql.default.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace default postgres-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)

To connect to your database run the following command:

    kubectl run postgres-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.14.0-debian-10-r0 --env="PGPASSWORD=$POSTGRES_PASSWORD" --command -- psql --host postgres-postgresql -U postgres -d postgres -p 5432



To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/postgres-postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U postgres -d postgres -p 5432
