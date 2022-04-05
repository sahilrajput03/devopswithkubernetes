# README 2

# Part 4

## Probe ?

Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.

src: https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe

Q. What is the role of replicas (say two replicas) of stateful sets which has a container of mongodb ?

```txt
How does the database works like if the request connection gets loadbalanced or what ?

Read @ https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
```

Ans. TODO_ANSWER

Q. Does the `readinessProbe` also checks for health after once the container is ready initially ?

Get help from : https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

Ans. TODO_ANSWER

## Ports in sevice confusing ?

Consider a service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: pingpong-svc
spec:
  type: ClusterIP
  selector:
    app: pingpong-app
  ports:
    - port: 2346
      protocol: TCP
      targetPort: 3000
```

> Note: A Service can map any incoming port to a targetPort. By default and for convenience, the targetPort is set to the same value as the port field.

> A service is completely independent entity from the pod or statefulsets. ~Sahil

Src: https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service

###
