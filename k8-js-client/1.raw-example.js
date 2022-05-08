// src: Official K8s (js client examples): https://github.com/kubernetes-client/javascript/blob/master/examples/raw-example.js
const k8s = require('@kubernetes/client-node')
const request = require('request')
const fs = require('fs')

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const opts = {}
kc.applyToRequest(opts)

console.log('::CurrentClusterServer:', kc.getCurrentCluster().server)
// Output:  https://0.0.0.0:35455

request.get(`${kc.getCurrentCluster().server}/api/v1/namespaces/default/pods`, opts, (error, response, body) => {
	if (error) {
		console.log(`error: ${error}`)
	}
	if (response) {
		console.log(`statusCode: ${response.statusCode}`)
	}
	// console.log(`body: ${body}`) // JSON string.

	// Pretty print with indentation:
	// console.log(JSON.stringify(JSON.parse(body), null, 2))

	// Write output to pods.json
	// fs.writeFileSync('pods.json', JSON.stringify(JSON.parse(body), null, 2))
	// Sample output is present in pods.json though.

	let podsData = JSON.parse(body)

	// Print podNames
	let podNames = podsData.items.map((item) => item.metadata.name)
	console.log('pods:', podNames)
	// Output: pods: ['countdown-controller-dep-7b5b98bb8b-nbcwr','doomsday-job-7--1-rr8lj']
})
