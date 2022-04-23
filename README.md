<!-- prettier-ignore -->
# Devops with kubernetes

kubernetes has 86.8k stars and 1L+ commits.

Website: https://devopswithkubernetes.com/

History of Kubernetes (wikipedia): https://en.wikipedia.org/wiki/Kubernetes#History

ingress docs @ k8: https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types
ingress docs @ k3: https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types
nginx docs(rewrite): https://kubernetes.github.io/ingress-nginx/examples/rewrite/

What is a pod?

```bash
kc explain po
```

- Supported tag names for docker images(USED DIRECTLY BY K8 AS WELL): https://docs.docker.com/engine/reference/commandline/tag/#:~:text=A%20tag%20name%20must%20be,a%20maximum%20of%20128%20characters.

If you have private repository, you can refer https://docs.docker.com/engine/reference/commandline/tag/#tag-an-image-for-a-private-repository .

```bash
docker tag 0e5574283393 fedora/httpd:version1.0
docker tag httpd:test fedora/httpd:version1.0.test # so common tag names schemes:
# - latest, v1.0, v1.0.test, version1.0.test

# Example of tags from a real docker image: https://hub.docker.com/_/alpine
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
`kubectl` for Docker Users@k8 Docs - Comparing Docker and Kubernetes Commands compared: https://kubernetes.io/docs/reference/kubectl/docker-cli-to-kubectl/
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

###### view logs of a particular container in a pod
# Here redis-ss-0 is pod and redis is a container name:
kubectl logs -f redis-ss-0 redis
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

- LOVE_MUST_READ: New commands learned by reading official docss @ [Deployments@Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

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
# or similarly, (-w is alias for --watch)
kc get svc --watch
```

## install nginx-ingress

```bash
# src: https://kubernetes.github.io/ingress-nginx/deploy/#quick-start

# Install
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/cloud/deploy.yaml

# verify if all pods are up:
kubectl get pods --namespace=ingress-nginx

# OR YOU CAN CHECK WHEN THESE ARE UP using below command:
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

#ALSO:
kc get ingressclass nginx
```

## Know target port from the service

```bash
# kc describe svc hash-svc
# Name:              hash-svc
# Namespace:         default
# Labels:            <none>
# Annotations:       <none>
# Selector:          app=images
# Type:              ClusterIP
# IP Family Policy:  SingleStack
# IP Families:       IPv4
# IP:                10.43.102.203
# IPs:               10.43.102.203
# Port:              <unset>  2345/TCP
# TargetPort:        3000/TCP
# Endpoints:         <none>
# Session Affinity:  None
# Events:            <none>
```

## rocker aliases

```bash
alias kc='kubectl'
alias ka='kubectl apply -f'
alias kam='kubectl apply -f manifests/'
alias kd='kubectl delete -f'
alias kdm='kubectl delete -f manifests/'
alias kResetCluster='k3d cluster delete; k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2'


alias pd='kc get po,deploy'
alias pds='kc get po,deploy,svc'
alias pdsi='kc get po,deploy,svc,ing'
alias pdsic='kc get po,deploy,svc,ing,ingressclass'

# FYI: You can provide multiple files to `kubectl apply -f` as well:
# SO BELOW WORKS AMAZINGLY COOL!
ka deployment-persistent.yaml,ingress.yaml
kd deployment-persistent.yaml,ingress.yaml
```

## Making use of persistent volume

Qutoing from dwk:

```txt
For the PersistentVolume to work you first need to create the local path in the node
we are binding it to. Since our k3d cluster runs via docker let's create a directory
at /tmp/kube in the k3d-k3s-default-agent-0 container. This can simply be done via
# command:
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
```

Trying to diff, old deployment.yaml -> deployment-persistent.yaml

```bash
diff ../manifestsOriginal/deployment.yaml deployment-persistent.yaml
17c17,18
<           emptyDir: {}
---
>           persistentVolumeClaim:
>             claimName: image-claim
```

## An amazing article talkig about storages with kubernetes cluster

Souce, from kubernetes Chapter 4 (Part 1).

At https://softwareengineeringdaily.com/2019/01/11/why-is-storage-on-kubernetes-is-so-hard/ .

### Rook - Rook is an open source cloud-native storage orchestrator for Kubernetes, providing the platform, framework, and support for a diverse set of storage solutions to natively integrate with cloud-native environments.

https://rook.io/

https://github.com/rook/rook (10k stars@github)

Article about rook: https://blog.rook.io/rook-moves-into-the-cncf-incubator-d25197a6bb14

Cloud Native Computing Foundation(CNFC):https://landscape.cncf.io/members

Landscape: https://landscape.cncf.io/?fullscreen=yes

Cloud Native Interactive Landscape: https://github.com/cncf/landscape

Persistent Volume Claims (PVC), on the other hand, are requests for the storage, i.e. PVs. With PVC, it’s possible to bind storage to a particular node, making it available to that node for usage.

**Container Storage Interface (CSI):** https://kubernetes-csi.github.io/docs/drivers.html

Volume type - CSI: https://kubernetes.io/docs/concepts/storage/volumes/#csi

> With the introduction of CSI, storage can be treated as another workload to be containerized and deployed on a Kubernetes cluster.

> Without delving into its architecture, the key point to take is, Ceph is a distributed storage cluster that makes scalability much easier, eliminates single points of failure without sacrificing performance, and provides a unified storage with access to object, block, and file.Naturally, Ceph has been adapted into the cloud-native environment. There are numerous ways you can deploy a Ceph cluster, such as with Ansible. You can deploy a Ceph cluster and have an interface into it from your Kubernetes cluster, using CSI and PVCs.

> Another interesting, and quite popular project is Rook, a tool that aims to converge Kubernetes and Ceph – to bring compute and storage together in one cluster.

> Rook is a cloud-native storage orchestrator. It extends Kubernetes. Rook essentially allows putting Ceph into containers, and provides cluster management logic for running Ceph reliably on Kubernetes. Rook automates deployment, bootstrapping, configuration, scaling, rebalancing, i.e. the jobs that a cluster admin would do.

> Rook allows deploying a Ceph cluster from a yaml, just like Kubernetes. This file serves as the higher-level declaration of what the cluster admin wants in the cluster. Rook spins up the cluster, and starts actively monitoring. Rook serves as an operator or a controller, making sure that the declared desired state in the yaml file is upheld. Rook runs in a reconciliation loop that observes the state and acting upon the differences it detects.

> Rook does not have its own persistent state, and does not need to be managed. It’s truly built according to the principles of Kubernetes.

> CSI Drivers @ k8 docs @ https://kubernetes-csi.github.io/docs/drivers.html

## Most helpful debugging commmands

```
kc describe po
kc logs -f <TAB>
```

# Using multiple yarml files in one file ?

Src: https://stackoverflow.com/a/52255987/10012446

tldr: You can do it by separating files with --- in any yaml file. Yo!!

- Multi port service: https://kubernetes.io/docs/concepts/services-networking/service/#multi-port-services

- Read from a yaml file using `yq`

`yq` A yaml command line reader, read about its usage @ https://github.com/kislyuk/yq

```bash
yq .metadata.name *
# Output:
"ex1-11-dep"
"ex1-11-ingress"
"pong-claim"
"example-pv"
"log-output-svc"
"pingpong-svc"
```

## All about volumes @ k8 docs

src: https://kubernetes.io/docs/concepts/storage/volumes/#out-of-tree-volume-plugins

## Science of naming things...

There are two hard things in computer science i.e., naming things and invalidating cache.

So i recommend a good way to name different things a kub app like,

```txt
project=rocket

# So names for other elements go like:
APP_NAME				=		rocket-app
VOLUME					=		rocket-vol
VOLUME_CLAIM			=		rocket-claim
IMAGE					=		rocket-img
PERSISTENT_VOLUME		=		rocket-pv
SERVICE					=		rocket-svc
```

## You can edit the deployment files as well

```bash
kubectl edit deploy project1-dep

# This works as well:
kubectl edit deploy

# Docs @ https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/#kubectl-edit
## FYI: the files is at path like:
## FYI: the file is removed after closing the editor and next time when you run the command the name of file changes as well.
# PATH: /tmp/kubectl-edit-2588926272.yaml
# PATH: /tmp/kubectl-edit-2171599199.yaml
```

- kubectl cheatsheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

```
####### I GOT IP OF EACH POD'S CONTAINER VIA
kc describe po container-name-here
## log-output
kubectl exec -it busybox1 -- wget -qO - 10.42.2.21:3000
## pingpong
kubectl exec -it busybox1 -- wget -qO - 10.42.1.6:3000
#######

###### making request using the service name:
# making a request to a pod with a cluster ip service:
kubectl exec -it busybox1 -- wget -qO - http://ex1-01-svc:2345

# making a request to a pod with a cluter ip service:
kubectl exec -it busybox1 -- wget -qO - http://pingpong-svc:2346
```

```
# launch sh in a pod container:
kubectl exec -it busybox1 -- sh
kubectl exec -it ex1-01-dep-5c44574dfc-8mklq -- sh


# FYI: /bin/bash didn't work in my own nodejs containers though:
kubectl exec -it ex1-01-dep-5c44574dfc-8mklq -- /bin/bash
```

## learning

If you see that your services are not linked up properly when looking in the ingress details:

```bash
kc describe ing project1-ing
# then you probably have used the app name incorrectly, i.e., you have to use same app name in all the service.yml files:
# I.e., I have two documents in single service.yaml file in ex
yq .spec.selector.app service.yaml
"project1"
"project1"

```

## for debugging the nework you may use `busybox` (Part 2, ch 1)

```bash
ka https://raw.githubusercontent.com/kubernetes/kubernetes/master/hack/testdata/recursive/pod/pod/busybox.yaml

# now you can use something like:
kubectl exec -it busybox1 -- wget -qO - http://google.fi


kubectl exec -it busybox1 -- sh
```

## Namespace accessing

```bash
# to get all element(pod, service, daemonset, deployment, replicaset, job) of all namespaces:
kubectl get all --all-namespaces

# to get all elements of a particular namespace say `kube-system` namespace, we can use -n option:
kubectl get pods -n kube-system
```

- Creating a namespace is a oneliner, i.e.,

```bash
# creating new namespace
kubectl create namespace example-namespace
```

You can define the namespace to use by adding it to the metadata section of the yamls, i.e.,

```yaml
---
metadata:
  namespace: example-namespace
  name: example
```

- **If you're using a specific namespace constantly, you can set the namespace to be used by default with:**

OR we can say that by default the active namespace is `default` i.e., if any yaml file doesn't have any namespace field in metadata then the currently active namespace will be used to create the resources, i.e., `default` which you can change using below command:

```bash
kubectl config set-context --current --namespace=<name>
# by default active namespace is set to `default`

## FAST IT!!!
# src: https://github.com/ahmetb/kubectx
# It has: kubectx + kubens: Power tools for kubectl
# INSTALLATION on arch:
sudo pacman -S kubectx

## USAGE: My Alias ~::Sahil::
kns

### origianl clis
kubectx
kubenx


###FYI: We can pass on cli about the namespace in which we want the resources to be created in via:
kc apply -f myFileOrFolder --namespace=test

###FYI: We may define the namespace inside the yaml file, which we already discussed doing it!

##FYI: If you define namespace in the yaml file and use the `--namespace` to pass someother value then the command will fail. src: https://youtu.be/xpnZX3if9Tc?t=180


### IMPORTANT:
# resources created in a non active namespace won't be reflected via:
kc get pods
# coz any comand is run against the currently active namespace only which is `default` unless you change it!

##SOLUTION: To get your pods you need to use namespace option:
kc get pods --namespace=test
```

- If you want to list all the currectly available namespaces, you do:

```bash
kc get ns
# or `kc get namespaces`
# NAME              STATUS   AGE
# default           Active   4d1h
# kube-system       Active   4d1h
# kube-public       Active   4d1h
# kube-node-lease   Active   4d1h
```

## wow

We can create service with same names in multiple namespaces!

`kubectl` detects namespace if you don't specify it i.e., `<service name>` would point to same namespace.

**But if you want to access a service from another namespace you need to do `<service-name>.<namespace>`.**

## kubernetes network policies

We can limit and isolate namespaces by using these, checkout video for this @ Kubernetes Best practises video from **Google Cloud Tech channel @ YT**.

## kubernetes best practises

[X] https://youtu.be/xpnZX3if9Tc , src: from Part2 Ch2 dwk.

Playlist: https://www.youtube.com/playlist?list=PLIivdWyY5sqL3xfXz5xJvwzFW_tlQB_GB

## label in ac

```bash
# label manually(you can add labels in the deployment file as well):
kc label po busybox1 exampleLabel=smart
# You can verify if the label is added by `kc describe po busybox1` and look for labels property.

# we can query anything using labels using -l flag:
kc get po -l app=hashresponse
kc get describe -l app=hashresponse
# .. more...
# .. more...

## Delete a label
# Deleting `exampleLabel` from pod:
kc label po busybox1 exampleLabel-
```

## what is node ?

node is the vm in which our cluster is running imo, like k3d thing..>>

## Taints and Tolerations

Node affinity is a property of Pods that attracts them to a set of nodes (either as a preference or a hard requirement). Taints are the opposite -- they allow a node to repel a set of pods.

Src: https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/

## Affinity and anti-affinity

nodeSelector is the simplest way to constrain Pods to nodes with specific labels. Affinity and anti-affinity expands the types of constraints you can define.

Src: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity

## labelling and unlabelling a node

```bash
# here we are unlabelling networkquality label:
kubectl label nodes k3d-k3s-default-agent-1 --overwrite networkquality=
```

# `Sops` and `age`

age is recommended over pgp @ https://github.com/mozilla/sops#22encrypting-using-age

SOPS: sops is an editor of encrypted files that supports YAML, JSON, ENV, INI and BINARY formats and encrypts with AWS KMS, GCP KMS, Azure Key Vault, age, and PGP.

- Mozilla sops: https://github.com/mozilla/sops

age: age is a simple, modern and secure file encryption tool, format, and Go library.

- age: https://github.com/FiloSottile/age

## `secrets` and play

Docs: https://kubernetes.io/docs/concepts/configuration/secret/

```bash
# View secret names, this doesn't show the values though:
kc get secrets

# Delete a secret
kc delete secrets pixabay-apikey

# Edit a secret in a live cluster:
kc edit secrets telegram-secret
# example to edit valued for a secret resource file like below:
```
A sample secret file:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: '2020-09-03T14:59:34Z'
  name: telegram-secret
  namespace: default
data:
  NATS_URL: BASE64_ENCODED
  TELEGRAM_ACCESS_TOKEN: BASE64_ENCODED
  TELEGRAM_CHAT_ID: BASE64_ENCODED

```

Q. What is opaque secret?

Docs: https://kubernetes.io/docs/concepts/configuration/secret/#opaque-secrets

## kubernetes hierarchy

**Kubernetes cluster is a group of nodes!**

**A node can have a list of deployments.**

**A deployment controls a list of pods.**

**A pod has a list of containers.**

**A kubelet is an agent that runs on each node in the cluster. It makes sure that containers are running in a pod.**

## Get nodes

```bash
kc get node

kc describe node
```

## Using jsonpath in `-o` in `kubectl`

JSONPath Support: https://kubernetes.io/docs/reference/kubectl/jsonpath/

```bash
kubectl get pods -o jsonpath='{.apiVersion}'

# You can inspect if the value is correct by actually printing whols josn object via:
kubectl get pods -o json
```

## Defining environment variable for a pod

https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/

## lol

```bash
kc get pod -o json | jiq
```

## persistenr volume

src: https://rancher.com/docs/k3s/latest/en/storage/

When deploying an application that needs to retain data, you’ll need to create persistent storage. Persistent storage allows you to store application data external from the pod running your application. This storage practice allows you to maintain application data, even if the application’s pod fails.

A persistent volume (PV) is a piece of storage in the Kubernetes cluster, while a persistent volume claim (PVC) is a request for storage. For details on how PVs and PVCs work, refer to the official Kubernetes documentation on storage.

## stateful sets

```bash
# delete a stateful set
kc delete statefulsets.apps redis-ss

kc get statefulset
# Output:
NAME       READY   AGE
redis-ss   2/2     32s
```

## Exec into a particular container in a pod ?

Src: https://stackoverflow.com/a/39979989/10012446

```
kc exec -it redis-ss-0 -c db -- sh

# Here I got `redis-ss-0` from: .metadata.name (and appended -0 bcoz i have two replicasets defined in .spec.replicas )
# Here I got `db` from: .spec.template.spec.containers[1].name
```

## moritz solutions

https://github.com/movd/devopswithkubernetes

## Using helm

###  install `helm`, `prometheus`, `grafana, `loki`:

```bash
# Using helm search
helm search hub mongo

# Adding promethus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Adding stable
helm repo add stable https://charts.helm.sh/stable

# install kube-prometheus-stack
kubectl create namespace prometheus
helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus

##### >>>>  You can remove almost everything with `helm delete [name]` with the name found via the helm list command.  #####

# add graphana, official install guide: https://grafana.com/docs/grafana/latest/installation/kubernetes/
kc get po -n prometheus # OR Simply use below command to get it:
kc -n prometheus get po | grep grafana | awk '{print $1}'

# We port-forward graphana i.e, pod `kube-prometheus-stack-x-grafana-y` to 3000 of host.
kubectl -n prometheus port-forward kube-prometheus-stack-<USE_YOUR_ID>-grafana-<USE_YOUR_ID_> 3000
# OR YOU CAN USE THE DYNAMIC COMMAND(BASH ROCKS, ***>>>>I aliased it startGrafana, yikes!!<<<<****):
kubectl -n prometheus port-forward $(kc -n prometheus get po | grep grafana | awk '{print $1}') 3000
# Now we can open grafana @ http://localhost:3000/ locally.

# If you had installed prometheus simply via lens, you can connect to prometheus using `startPrometheus` alias in your shell:
alias startPrometheus="kp -n lens-metrics prometheus-0 9090"

# Install loki charts: (Grafana has bunch of charts @ https://github.com/grafana/helm-charts/tree/main/charts)
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# install loki in namespace `loki-stack`
kubectl create namespace loki-stack
helm upgrade --install loki --namespace=loki-stack grafana/loki-stack
kubectl get all -n loki-stack # We analyse that loki is running at port 3100
# IMPORTANT: TODO: NOW TO USE LOKI in graphana, we must add loki with URL as http://loki.loki-stack:3100
#
```

```
# test application to test terminal logs in lens:
kc apply -f https://raw.githubusercontent.com/kubernetes-hy/material-example/master/app5/manifests/statefulset.yaml
```

# google cloud pricing ?

https://www.coursera.org/learn/gcp-cost-management

## cluster info ?

You can check the cluster info with kubectl cluster-info to verify it's pointing in the right direction.

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

**Q. Why you should use `nodemon index.js` as you start script in your backend containers ?**

Ans. Bcoz if you do `kubectl exec -it my-container -- sh` and edit the `index.js` file the server will simply restart without having to build the dockerimage again and again after adding any debug console logs or any other code that you want to do for some temporarily hackings. Yo!

## portforward from a pod's container to host system ?

```bash
# I made alias kp for `kubectl port-forward`

kp POD_NAME hostPort:containerPort
# or
kp POD_NAME port
#								^^^ this will be considered same for hostPort and containerPort.
```

- What happens if I execute `kubectl rollout undo deployment flaky-update-dep` twice ?

Ans. It'll do like: 1. undo deployment, 2. redo deployment. So, it works exactly like toggling between current and previous deployment only.

```bash
# Undoing a deployment
kubectl rollout undo deployment flaky-update-dep

# Undoint a deployment to a version other than previous version
kubectl rollout undo deployment flaky-update-dep --to-revision=1

kc rollout undo -h
# Output: (there is no alias for this :(
      --to-revision=0: The revision to rolback to. Default to 0 (last revision).
```

# Debugging ?

```bash
# i made `kge` alias for `kc get events`
kge

# IMPORATANT IMPORTANT IMPORATANT:
# To get pod specific info, you may use
kge POD_NAME
```


# Whats so good thing about `readinessProbe` and  `alivenessProbe`?

Ans. These are really very phenomenal options in kubernetes which can check the health of any container(most helpful in backend servers) which we are delploying.

Problem1: So, consider you have already running pods(say having our server container) which are in ready state and you have a new update in the server and its managed to push to kubernetes automatically.


Problem2: So, consider you have a endpoint which is faulty and which causes server to crash and thus the whole container is down now or eventually all the containers go down bcoz of that faulty endpoint (say any code throws exception and that is very normal to happen by any third-party library or may be mongoose connection error even after the server started).

SOLUTION: So this very problem can be solved by alivenessProbe coz it will restart the container as soon as it get crashed or say our `healthz` endpoint is down( since the whole server crashed in that server, the `/healthz` endpoint of the container will throw 500 internal server error). RESTARTING THE CONTAINER FIXES THE ANONYMOUS SERVER CRASHING AT ANY URGENT SERVER FAILURE.


- LEARN: `readinessProbe` also continuously check for health for the container/pod for the whole life of the container/pod. (readinessProbe simply stops access to the container(whole pod) only) if the healthz endpoint get faulty by marking the pod as <0/REPLICA_COUNT> in the READY column in `kc get all` ouput, thats why `livenessProbe` is good fit for the case. The reason readinessProbe works good for two usecases: 1. Initial deployment check if the new container is healthy and if healthy then only marks as READY thus requests won't be redirected to that pod till its ready and before its ready all the requests are routed to older working pods/containers only. 2. It gets really useful say we have 3 pods running and one of them crashed bcoz of some error and then that po/container would be marked as UNREADY and thus request won't be mapped to that container till the time it gets READY (which will happen only if `livenessProbe` is implemented as well). 

- LEARN: `livenessProbe` restart the container anytime in future if at anytime the the server's software (say nodejs's express server) crashes. THIS IS REALLY IMPORTANT THING TO DO IN PRODUCTION! I implemented a `/crash` endpoint using ingress which connects to `ex2-02` exercise solution. So, you can actually go to `http://localhost:8081/crash` endpoint which will crash the container completely thus `livenessProbe` will assist and restart the container/pod instantly (yikes) and `readinessProbe` will simply mark the container unready.

- LEARN: OUTCOME: Using `readinessProbe` and `livenessProbe` are complementary to each other and having them both is the best solution bcoz each does distinct work i.e., `readinessProbe` manages the READY state and `livenessProbe` is responsible for restarting the container/pod anytime its unhealthy.


## VERY BASIC(IMPORATANT IMPORTANT IMPORTANT): How deployment works ?

- Say you update the code of appliction say `index.js` server, then you start the deployment for the first time via `ka manifest/`.
- Now anytime you update the code in `index.js` file then you for deployment to update you need to rebuild the image(say we are building image with same older tag i.e., `latest`).
- You update the deployment via `kd manifest` and then doing `ka manifest/`.

Q. What is `kd` and why do we need to do it? Why can't we simply `ka manifest/` without `kd manifest/` ?

FYI: Considering below image building of image with tag `latest` tag and pushed it to docker registry as well.

The reason is that we do this coz whenever we do `ka manifest/` after we rebuild the image with same tag (say `latest`) `kubectl` doesn't update the deployment.

DONT' BE STUPID TO DELETE AND APPLY DEPLOYMENT AGAIN: We can use `kubectl roll restart deployemnt my-deployment-name` and this is actually a good way to deploy a new image coz this will keep the older container running till the new container is ready. YO!!

**But a legitimate and officially recommended way to deploy new images is by using tags like: `0.0.1` instead of plain `latest` tag. And thus editing the image tag in `deployment.yaml` file with the new tag we can then relase new deployment simply by `kc apply -f manifest/` without using `kc delete -f manifest/deployment.yaml` or `kc delete -f manifest/` at all. YO!!**

## Canary release

Qutoing from material (part 4 ch 1):

> The above strategy will first move 25% (setWeight) of the pods to a new version (in our case 1 pod) after which it will wait for 30 seconds, move to 50% of pods and then wait for 30 seconds until every pod is updated. A

**Using `rollout.yaml`:**

1. Delete all resources fist.
2. Apply `rollout.yaml`, all pods will be up instantly.
3. Change image tag version in `rollout.yaml` file and apply `rollout.yaml` file to take canary rollout release format into account.

But if you run rollout.yaml file for the first time it'll release all containers instantly! Yo!

## You can encode/decode base64 with build in installed by linux


```bash
# google it do on your own...:
base64 --decode
```

# log into your natbox

```bash
alias ken='ke -n default my-nats-box-d6bd784b-txccl -- sh -l'


## Adding nats:
# STRAIGHT FROM: https://devopswithkubernetes.com/part-4/2-messaging-systems 
$ helm repo add nats https://nats-io.github.io/k8s/helm/charts/
  ...
$ helm repo update
...
$ helm install my-nats nats/nats
#   NAME: my-nats
#   LAST DEPLOYED: Thu Jul  2 15:04:56 2020
#   NAMESPACE: default
#   STATUS: deployed
#   REVISION: 1
#   TEST SUITE: None
#   NOTES:
#   You can find more information about running NATS on Kubernetes
#   in the NATS documentation website:
# 
#     https://docs.nats.io/nats-on-kubernetes/nats-kubernetes
# 
#   NATS Box has been deployed into your cluster, you can
#   now use the NATS tools within the container as follows:
# 
#     kubectl exec -n default -it my-nats-box -- /bin/sh -l
# 
#     nats-box:~# nats-sub test &
#     nats-box:~# nats-pub test hi
#     nats-box:~# nc my-nats 4222
# 
#   Thanks for using NATS!
```

## Using flux


flux official site: https://fluxcd.io/

flux docs gitrepostory: https://fluxcd.io/docs/components/source/gitrepositories/

flux kustomization: https://fluxcd.io/docs/components/kustomize/kustomization/#generate-kustomizationyaml

 
```bash
# Checks prerequisites
flux check --pre

# import secrets file with
. secrets

# configure flux to link with github
flux bootstrap github --owner=sahilrajput03 --repository=kube-cluster-dwk --personal --private=false
## ^^ This command creates a new repository in your accout if that repo doesn't exist already. Also, >>
## IMPORTANT(Deploying flux repo to a new cluster): If the repo exists already, it'll clone the repo internally and will use it apply the configuration to currently running cluster.

# flux docs for files configuration: https://fluxcd.io/docs/components/source/gitrepositories/


# My flux configuration repo linked with my local cluster @ https://github.com/sahilrajput03/kube-cluster-dwk

# Watch flux logs by
watchFluxLogs
# alias watchFluxLogs='flux logs -f'
```


## :TODO Learn about kustomize

AT https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/
Official Repo: https://github.com/kubernetes-sigs/kustomize

```bash
# Having kustomization.yaml file in current directory, you can run below command to check the generated output by kustomization:
kc kustomize

# use kustomization.yaml file from a different directory:
kc kustomize <kustomization_directory>

# To apply resources from a kustomize.yaml file with --kustomize or -k flag:
kc apply -k .

# delete resources using a kustomization file (in current directory)
kc delete -k .

# FYI: IMPORTANT: kc edit -k is not a feature yet.., I made an issue for this: https://github.com/kubernetes/kubernetes/issues/109598
```

## Important FLUX knowledge

You must use `namespace: default` under `metadata` field in every resource in yaml files when you need to apply those to flux system coz otherwise flux throws error (which you can see by `flux logs -f` command) i.e.,

```txt
2022-04-21T21:45:56.478Z error Kustomization/project-gitops-app.flux-system - Reconciliation failed after 518.639339ms, next try in 2m0s Service/ex2-02-svc namespace not specified, error: the server could not find the requested resource
```

Debugggin:  

```bash
# Get the reason of faliure: https://fluxcd.io/legacy/helm-operator/helmrelease-guide/debugging/#getting-the-reason-of-failure
 kubectl logs -n flux-system helm-controller-68686dc594-wftmp
```

Advance Debuggin in flux(haven't tried it yet): https://fluxcd.io/docs/gitops-toolkit/debugging/

## flux's way of creating yaml files via commandline

```bash
#### FYI: Below will only create a file (will not apply this to flux at all coz we're using --export
# flag and writing it to a file as per desire):
#### IMPORTANT: We are using --export flag, where as if we don't use it then the generated source will be
# applied to flux immediately and will throw error if there gitrepo is not a valid github url.
flux create source git podinfo \
  --url=https://github.com/stefanprodan/podinfo \
  --branch=master \
  --interval=30s \
  --export > ./podinfo-source.yaml
```

will ouput a file:

```yml
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: GitRepository
metadata:
  name: podinfo
  namespace: flux-system
spec:
  interval: 30s
  ref:
    branch: master
  url: https://github.com/stefanprodan/podinfo
```


```bash
# Get all kustomizations
flux get kustomizations

# Watch all kustomizations in sync (Home page of fluxcd)
flux get kustomizations --watch

# src: https://fluxcd.io/docs/cmd/flux_get_sources_all/
# get all git repositories
flux get sources all

# get all git repositories and kustomizations active
flux get all

# Delete a gitRepository resource
flux delete source git my-secrets

# FLUX UNINSTALL NAMESPACE AND ALL SETUP:
flux uninstall --namespace=flux-system
# src: https://fluxcd.io/docs/cmd/flux_uninstall/

# FLUX RESOURCES: https://fluxcd.io/resources/
```

# Some delete commands I used

```bash
kc delete deployments.apps hashgenerator-dep 
kc delete deployments.apps 
kc delete deployments.apps my-nats-box 
kc delete cronjobs.batch daily-todos 
kc delete statefulsets.apps my-nats 
kc delete po daily-todos--1-kwhxg 
kc delete job daily-todos 
```
