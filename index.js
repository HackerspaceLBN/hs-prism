const arpListener = require('arp-listener')
const _ = require('lodash')
const axios = require('axios');
const config = require('./config.js')

let pureArpTable = []
let arpTable = []

const createIP = (arpData) => {
	if (arpData.sender_pa) {
		return arpData.sender_pa.addr.join('.')
	}
}

const flushARPTable = () => {
	arpTable = []
	pureArpTable = []
	console.log('+ = + = + FLUSH + = + = +')
}

const displayUsers = () => {
	console.log('+==============================+')
	console.log('Users online: ' + arpTable.length)
	console.log('ARP Table:')
	arpTable.forEach(item => console.log('\t' + item.ip + ' \t ' + item.mac))
}

const sendUsers = () => {
	let requestObject = {
		date: new Date(),
		count: arpTable.length,
		arp: arpTable
	}

	axios.post(config.api_url, requestObject).then(result => {
		console.log('Request sent to server witout errors')
	})
}

console.log('                                              ')
console.log(' _____ _____    _____ _____ _____ _____ _____ ')
console.log('|  |  |   __|  |  _  | __  |     |   __|     |')
console.log('|     |__   |  |   __|    -|-   -|__   | | | |')
console.log('|__|__|_____|  |__|  |__|__|_____|_____|_|_|_|')
console.log('                                              ')                               

arpListener('en0', function(arpData) {
	let arpObject = {
		mac: arpData.sender_ha,
		ip: createIP(arpData)
	} 

	if (! _.includes(pureArpTable, arpData.sender_ha)) {
		pureArpTable.push(arpData.sender_ha)
  	arpTable.push(arpObject)
	}
})

setInterval(displayUsers, config.display_information_ivterval)
setInterval(sendUsers, config.send_to_server_interval)
setInterval(flushARPTable, config.flush_data_interval)


