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

### Some Q/A

**Q. What is readiness probe actually for ?**

Ans. Readiness helps to make a continer `READY` only when a certain health check condition is met. In simple manner we defined `httpGet` end point i.e, `/healthz` to monitor the health. When any pod or container is in `NOT READY` status any connection to it is banished. ALSO: This is the very reason we don't add probeReadiness to any pod statefulset definition which has the database container defined in it (which will actually make the configuration a deadlock as a combination coz the connection to db won't be allowed till the pod is up and the pod won't be up till the connection to db is made, SO ITS A DEADLOCK. So as a solution you must defined backend server probably as a deployment separately and have the database in a different statefulset so they are independently run and probe can be functional).

**Q. Do readiness probe continually hit `/heathz` point even after the containers/pods are ready ?**

Ans. Yes it does check even after the pods/containers are ready even after they are ready for the first time and will turn them unready (i.e., 0/1 in READY column) if the `/healthz` endpoint goes down(status code 500) {TESTED: I deleted the mongo-statefulset and notice the pods for a minute and then the first container crashed bcoz of `MongoServerSelectionError` thus the endpoint `/healthz` get down as well coz whole server crashed COMPLETELY bcoz of exception thrown by mongoose(or mongo official driver). ALSO, since the logoutput's `/healthz` endpoint was dependent on the pingpong's `healthz`(which is down by now) endpoint so it gets down as well and `kc get po` shows both of pods i.e, pingpong and logoutput with status 0/1 in READY column}! TIP: It shows 0/1 coz I have only one replcia (so if i had 3 replicas, it would have shown 0/3 ).

## What else?
