// Gestion service worker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/serviceWorker.js');
	});
}

// app
new Vue({
	el: '#app',
	data() {
		try {
			var storedLog = localStorage.getItem('log') && JSON.parse(localStorage.getItem('log')) || []
		} catch(e) {
			localStorage.removeItem('log')
			sortedLog = []
		}
		return {
			// 0: no bf, 1: left, 2: right, 3: baby bottle
			position: 0,
			log: storedLog.map(l => ({start: new Date(l.start), end: new Date(l.end), side: l.side})),
			entry: undefined,
			drawerClosed: true
		}
	},
	computed: {
		babyPosition() {
			switch (this.position) {
				case 0:
					return 'top: calc(12.5vh - var(--half-size)); left: calc(50vw - var(--half-size));'
				case 1:
					return 'top: calc(50vh - var(--half-size)); left: calc(calc(25vw - var(--half-size)) + 2.5px); background-image: url("assets/breastfeedingLeft.png");'
				case 2:
					return 'top: calc(50vh - var(--half-size)); left: calc(calc(75vw - var(--half-size)) - 2.5px); background-image: url("assets/breastfeedingRight.png");'
				case 3:
					return 'top: calc(calc(87.5vh - var(--half-size)) - 10px); left: calc(50vw - var(--half-size)); background-image: url("assets/breastfeedingRight.png");'
			}
		},
		logByDay() {
			if (!this.log.length) return

			let days = []
			let sortedLog = this.log.sort((a, b) => b.start.getTime() - a.start.getTime())
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
		gotoBabyBottle() {
			if (this.position === 3) return

			this.position = 3
			this.endEntry()
			this.startEntry(3)
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
			this.log.push(this.entry)
			localStorage.setItem('log', JSON.stringify(this.log))
			console.log(document.cookie)
			this.entry = undefined
			Vue.nextTick(this.scrollTop())
		},
		toggleDrawer() {
			this.drawerClosed = !this.drawerClosed
			if (!this.drawerClosed) {
				this.scrollTop()
			}
		},
		getDate(date) {
			return new Intl.DateTimeFormat('fr-FR', {hour: 'numeric', minute: 'numeric'}).format(date)
		},
		getPosition(pos) {
			switch (pos) {
				case 1: return 'Gauche'
				case 2: return 'Droite'
				case 3: return 'Biberon'
			}
		},
		scrollTop() {
			document.getElementById('drawer-content').scroll({top: -9999})
		}
	}
})