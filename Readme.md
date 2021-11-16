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
