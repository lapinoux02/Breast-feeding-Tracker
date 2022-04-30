// Gestion service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/serviceWorker.js');
	});
}

// Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCLTl3xX1RlWbzs3Z3TCAT2NFpUfWkv8ug",
    authDomain: "breast-feeding-tracker-31ba4.firebaseapp.com",
    databaseURL: "https://breast-feeding-tracker-31ba4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "breast-feeding-tracker-31ba4",
    storageBucket: "breast-feeding-tracker-31ba4.appspot.com",
    messagingSenderId: "290308381002",
    appId: "1:290308381002:web:25b4e9698fc683e4a209b3"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

// app
new Vue({
	el: '#app',
	data() {
		return {
			// 0: no bf, 1: left, 2: right
			position: 0,
			log: [],
			entry: undefined,
			drawerClosed: true
		}
	},
	async mounted() {
		let snapshot = await firebase.database().ref().child('log').get()
		if (snapshot.exists()) {
			let data = snapshot.val()
			this.log = data.map(d => {
				let start = new Date()
				start.setTime(d.start)
				let end = new Date()
				end.setTime(d.end)
				return {
					start,
					end,
					side: d.side
				}
			})
		} else {
			console.log('no data')
			this.log = []
		}
	},
	computed: {
		babyPosition() {
			switch (this.position) {
				case 0:
					return 'top: calc(16.67vh - var(--half-size)); left: calc(50vw - var(--half-size))'
				case 1:
					return 'top: calc(66.67vh - var(--half-size)); left: calc(25vw - var(--half-size))'
				case 2:
					return 'top: calc(66.67vh - var(--half-size)); left: calc(75vw - var(--half-size))'
			}
		},
		logByDay() {
			if (!this.log.length) return

			let days = []
			let sortedLog = this.log.sort((a, b) => a.start.getTime() - b.start.getTime())
			let day = {day: sortedLog[0].start.getDate(), month: sortedLog[0].start.getMonth(), log: []}
			days.push(day)
			sortedLog.forEach(l => {
				if (l.start.getDate() === day.day && l.start.getMonth() === day.month) {
					day.log.push(l)
				} else {
					day = {day: l.start.getDate(), month: l.start.getMonth(), log: [l]}
					days.push(day)
				}
			})

			return days
		}
	},
	methods: {
		gotoNoBf() {
			if (this.position === 0) return

			this.position = 0;
			this.endEntry()
		},
		gotoLeft() {
			if (this.position === 1) return

			this.position = 1
			this.endEntry()
			this.startEntry(1)
		},
		gotoRight() {
			if (this.position === 2) return

			this.position = 2
			this.endEntry()
			this.startEntry(2)
		},
		startEntry(side) {
			this.entry = {
				start: new Date(),
				side
			}
		},
		endEntry() {
			if (!this.entry) return

			this.entry.end = new Date()
			firebase.database().ref(`log/${this.log.length}`).set({start: this.entry.start.getTime(), end: this.entry.end.getTime(), side: this.entry.side})
			this.log.push(this.entry)
			this.entry = undefined
		},
		toggleDrawer() {
			this.drawerClosed = !this.drawerClosed
		},
		getDate(date) {
			return new Intl.DateTimeFormat('fr-FR', {hour: 'numeric', minute: 'numeric'}).format(date)
		},
		getPosition(pos) {
			switch (pos) {
				case 1: return 'Gauche'
				case 2: return 'Droite'
			}
		}
	}
})