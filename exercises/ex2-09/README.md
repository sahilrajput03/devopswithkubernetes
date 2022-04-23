# README

Use below command to fetch logs of the pod:

```bash
kc logs $(kc get pod | grep daily-todos | awk '{print $1}')
```
