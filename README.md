# Devops with kubernetes

Website: https://devopswithkubernetes.com/

History of Kubernetes (wikipedia): https://en.wikipedia.org/wiki/Kubernetes#History

- Supported tag names for docker images(USED DIRECTLY BY K8 AS WELL): https://docs.docker.com/engine/reference/commandline/tag/#:~:text=A%20tag%20name%20must%20be,a%20maximum%20of%20128%20characters.

If you have private repository, you can refer https://docs.docker.com/engine/reference/commandline/tag/#tag-an-image-for-a-private-repository .

```bash
docker tag 0e5574283393 fedora/httpd:version1.0
docker tag httpd:test fedora/httpd:version1.0.test
# so common tag names schemes:
# - latest, v1.0, v1.0.test, version1.0.test
```

**Good naming conventions ~Sahil**

**_tl;dr_**: Always use `-` instead of `.` to name anything for usage of separators.

```bash
# app name
ex1-01
# deploy name
ex1-01-dep
# service name
ex1-01-svc
# ingress name
ex1-01-ing
```

- cli: `kubectl` and `k3d`.

Course Repo: https://github.com/kubernetes-hy/kubernetes-hy.github.io
Material Examples: https://github.com/kubernetes-hy/material-example
Docker and Kubernetes Commands compared: https://kubernetes.io/docs/reference/kubectl/docker-cli-to-kubectl/
Deployment (kubernete docs): https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
Jakousa's Docker Hub: https://hub.docker.com/search?q=jakousa&type=image

- Kubectl is a command-line tool that we will use to communicate with our Kubernetes cluster.

```bash
# Install kubectl
sudo pacman -S kubectl
alias kc='kubectl'


### I USED PACMAN BUT FOR  OFFICIAL INSTALL INSTRUCTS: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/

# k3d install permission issue, check @ part0
# IMPORTANT: Do not run k3d as sudo, it can cause problems.
# k3d config location: `~/.kube`
# Install k3d
git clone https://aur.archlinux.org/rancher-k3d-bin.git
cd rancher-k3d-bin
makepkg -si
```

Docs: k3d: src: https://github.com/k3d-io/k3d#get

Docs: k3s: src: https://k3s.io/

Docs: kubectl: src: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/

```bash
k3d cluster create -a 2
k3d cluster create -a 2 --no-lb



# K3d sets up a kubeconfig, the contents of which is
k3d kubeconfig get k3s-default


# kubectl will be able to access the cluster after this
kubectl config use-context k3d-k3s-default

# show cluster with kubectl
kubectl will be able to access the cluster

# Kubectl will read kubeconfig from the location in KUBECONFIG environment value or by default from file:
cat ~/.kube/config
```

## starting, stopping, deleting clusters:

```bash
# LIST CLUSTERS
k3d cluster ls #or list works as well

# STOP CLUSTER
k3d cluster stop

# START CLUSTER
k3d cluster start

# REMOVE THE CLUSTER
k3d cluster delete.

# To deploy an application we'll need to create a Deployment object with the image:
kubectl create deployment hashgenerator-dep --image=jakousa/dwk-app1
```

- Pod: A container of containers.

- In Kubernetes all entities that exist are called objects. You can list all objects of a resource with kubectl get RESOURCE.

```bash
kc get po
kc get deploy
# To get both pods and deploy, use:
kc get po,deploy

# To get output in json or yaml, you can do like
kc get po,deploy,svc -o yaml
kc get po,deploy,svc -o json


# po is alias for pods
# deploy is alias for deployment

# YOU MAY USE YOUR OWN BASH ALIAS TO GET ALL DEPLOY and PODS:
pd
```

## A Deployment resource and a Pod resource-

- Pod is an abstraction around one or more containers.

- A Deployment resource takes care of deployment. It's a way to tell Kubernetes what container you want, how they should be running and how many of them should be running.

```bash
# view logs
kubectl logs -f hashgenerator-dep-6965c5c7-2pkxc
```

Pushing to docker hub:

```bash
# Make container of from the recipie(Dockerfile):
docke build . -t ex1.01
# confirm with build image with
docker images

docker image tag youtube-dl <username>/<repositoryname>
docker image push <username>/<repositoryname>


docker pull <image-name>
```

- Exercise 1.01

```bash
docke build . -t ex1.01
docker image tag ex1.01 sahilrajput03/ex1.01
docker image push sahilrajput03/ex1.01
kc create deployment ex1.01 --image=sahilrajput03/ex1.01

# verify
kc get pods
kc logs -f ex1.01-8645676449-zwnnb
```

## Deleting a deployment

```bash
# Note: When you use kubectl, you don't delete the pod directly. You have to first delete the Deployment that owns the pod. If you delete the pod directly, the Deployment recreates the pod.

kc get deploy
# SAME AS: kc get deployment

# now choose one of above deployment via their `NAME`
kc delete deploy myDeploymentHere
```

- Exercise 1.02

```bash
# FYI: dk is alias for docker

dk build . -t projectv1.01
# FYI: You can name the image prefixed with repo-name in above step as well:
dk image tag projectv1.01 sahilrajput03/projectv1.01
dk image push sahilrajput03/projectv1.01
# create deploy
kc create deploy dep-projectv1.01 --image=sahilrajput03/projectv1.01

# verify
kc get pods
kc logs -f dep-projectv1.01-6c7f4f78c9-wbvd9
#FYI: You dont get autocomplete with kc alias(say for above command) unless you add below line to your bashrc:
complete -F __start_kubectl kc # src: https://stackoverflow.com/a/52907262/10012446
```

### Learn via `kubectl help delte` command:

```bash
deployments:
kc delete deploy myDeploymentHere #TIP: Use <tab> autocomplete to get list.

pod:

kc delete pod foo --now # Delete a pod with minimal delay

kc delete pod foo --force # Force delete a pod on a dead node

kc delete pods --all # Delete all pods
```

```bash
# create deploy
kc create deployment hashgenerator-dep --image=jakousa/dwk-app1

# scaling a deployment
kc scale deployment hashgenerator-dep --replicas=4

# update the image, so all pods gets updated
kc set image deploy hashgenerator-dep dwk-app1=jakousa/dwk-app1:b7fc18de2376da80ff0cfc72cf581a9f94d10e64

#########^^^^ in above we are fetching a different tag so that we can update our pods in real, it is required so that template changes over all pods.
######### IMPORTANT: Note: A Deployment's rollout is triggered if and only if the Deployment's Pod template (that is, .spec.template) is changed, for example if the labels or container images of the template are updated. Other updates, such as scaling the Deployment, do not trigger a rollout.
######### You may get all available tags for the image `jakousa/dek-app` for this image @ https://hub.docker.com/r/jakousa/dwk-app1/tags



# delete a deployment
kubectl delete deploy hashgenerator-dep


#
```

```bash
######## Using manifests/deployment.yaml file

# apply the deployment: 1. using local file
kc apply -f manifests/deployment.yaml

# apply the deployement: 2. using the internet file:

# delete pods and deployment as well associated with data from file passed:
kc delete -f manifests/deployment.yaml

kc apply -f https://raw.githubusercontent.com/kubernetes-hy/material-example/master/app1/manifests/deployment.yaml
# Output: deployment.apps/hashgenerator-dep created
```

## Quoting text from the course, dealing with `manifestdeployment.yml` file

Instead of deleting the deployment we could just apply a modified deployment on top of what we already have. Kubernetes will take care of rolling out a new version. By using tags (e.g. dwk/image:tagGA) with the deployments each time we update the image we can modify and apply the new deployment yaml. Previously you may have always used the 'latest' tag, or not thought about tags at all. From the tag Kubernetes will know that the image is a new one and pulls it.

When updating anything in Kubernetes the usage of delete is actually an anti-pattern and you should use it only as the last option. As long as you don't delete the resource Kubernetes will do a rolling update, ensuring minimum (or none) downtime for the application. On the topic of anti-patterns: you should also always avoid doing anything imperatively! If your files don't tell Kubernetes and your team what the state should be and instead you run commands that edit the state you are just lowering the bus factor for your cluster and application.

## deployment

Quoting from official docs:

> A Deployment provides declarative updates for Pods and ReplicaSets.

https://kubernetes.io/docs/concepts/workloads/controllers/deployment/

## Your basic workflow may look something like this:

Quoting from Part 1 - Chapter 1.

```bash
docker build -t <image>:<new_tag>

docker push <image>:<new_tag>
Then edit deployment.yaml so that the tag is updated to the <new_tag> and

kubectl apply -f manifests/deployment.yaml
```

# Chapter 2

```bash
# create deployment with pods:
kubectl apply -f https://raw.githubusercontent.com/kubernetes-hy/material-example/master/app1/manifests/deployment.yaml
# see details about our delployment:
kubectl describe deploy hashgenerator-dep
# see details of pods:
kubectl describe pod hashgenerator-dep-<TAB>

# get events:
kubectl get events
```

## Get kubelctl config:

```bash
# get config:
kubectl config view --minify --raw
```

## installing lens

```bash
# install lens (a k8 IDE)
# src: https://aur.archlinux.org/packages/lens

git clone https://aur.archlinux.org/lens.git
cd lens
makepkg -si


# Usage:
open-lens
```

## portforward

```bash
kc port-forward hashresponse-dep-869df48685-q9cmf 3001:3000
# here we are connecting host(3001) to container(3000).

# FYI: This syntax is same as
docker run -p host_port:container_port
```

Chapter 3

E.x. 1.06

```bash
# if ports are not exposed with existing k3d containers then u would need to do:
k3d cluster delete
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2

# Starting our app and the nodePort service:
cd projectv0.1
kubectl apply -f manifests/deployment.yaml
kubectl apply -f manifests/nodeport_service.yaml
curl localhost:8082
```

- Other useful:

```bash
kc get svc
kc get endpoints


kc gelete my-service
```

## Learning nodePort vs. (ingress + clusterip)?

```bash
##### PREREQUISITE: ######
# 1.  Our app in container runs @ port 3000.

# k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
# 2. We used above command to have connections from HOST to CLUSTER (via k3d)
# - host(8081) to loadbalancer(80)
# - host(8082) to agent0(30080)

###### Now we have two options i.e., use either nodePort or ingress(+clusterip)

###>>> OFFICIAL DOCS : LOVE: >>>> Exposing services:
# https://github.com/k3d-io/k3d/blob/main/docs/usage/exposing_services.md

## wrt to app2: ##
# >> FILES ARE PRESENT IN `manifest` FOLDER.
# >> Use `kc get svc,ing` command to spefici details of services and ingress respectively.

## USING INGRESS:
# - ingress.yaml : connects port from cluster{loadbalancer}(80) to a hashresponse-svc (a clusterIp service @ 2345). #### FYI: You may verify port 80 via command `kc get ingress`
# - service.yaml (cluster ip service): which connects port 2345 to app container(3000).
####### -> RESULT: We can access app-container from our host computer via port 8081.

## USING NODEPORT:
# - nodeport_service.yaml which connects port from cluster{agent:0}(30080) to app container(3000).
####### -> RESULT: We can access app-container from our host computer via port 8082.
```

## What if you deleted kubernetes service accidentally?

```bash
kc delete svc kubernetes
```

**_It will simply restart the service almost instantly._**

## very stupid error that you might be doing

- You haven't even build and pushed the docker image to dockerhub.
- You are trying to update the latest deploy resource without deleteing the older latest deploy resource.

## exercise 1.07

```bash
kc apply -f manifest/
# this will run deployment, service(clusterip) and ingress.


## FYI: ^^^  that command is really intelligentt as it takes care of ingress and service to only run if their files have changed, yikes!!
```

New commands learned by reading official docss @ [Deployments@Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

```bash
kubectl rollout status deployment/nginx-deployment
# Tip: You may use ctrl+c to stop the rollout status watch.

# get replicasets
kc get rs
# rs is alias for (replicasets)


### rollout to some previous deployment:
# View rollout history
kubectl rollout history deploy nginx-deployment

# view history of all deployments
kubectl rollout history deploy

# rollback to previous version
kc rollout undo deployment/nginx-deployment

# rollback to a specific revision
kc rollout undo deployment/nginx-deployment --to-revision=2

# CHECK if the rollback was successful and the Deployment is running as expected, run:
kc get deploy nginx-deployment
# DESCRIPTION of the Deployment, and look for *events* section in the last:
kubectl describe deployment nginx-deployment


# Watch the status of the rollout (rs is alias for relicasets):
kubectl get rs -w




```
