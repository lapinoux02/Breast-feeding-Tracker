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
			var storedEntry = localStorage.getItem('entry') && JSON.parse(localStorage.getItem('entry')) || undefined
			var storedPosition = parseInt(localStorage.getItem('position') || 0)
		} catch(e) {
			localStorage.removeItem('log')
			localStorage.removeItem('entry')
			localStorage.removeItem('position')
			storedLog = []
			storedEntry = undefined
			storedPosition = 0
		}
		return {
			// 0: no bf, 1: left, 2: right, 3: baby bottle
			position: storedPosition,
			log: storedLog.map(l => ({start: new Date(l.start), end: new Date(l.end), side: l.side})),
			entry: storedEntry && {start: new Date(storedEntry.start), side: storedEntry.side},
			drawerClosed: true,
			entryOpen: false,
			newEntry: undefined,
			importOpen: false
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
			this.storePosition()
		},
		gotoLeft() {
			if (this.position === 1) return

			this.position = 1
			this.endEntry()
			this.startEntry(1)
			this.storePosition()
		},
		gotoRight() {
			if (this.position === 2) return

			this.position = 2
			this.endEntry()
			this.startEntry(2)
			this.storePosition()
		},
		gotoBabyBottle() {
			if (this.position === 3) return

			this.position = 3
			this.endEntry()
			this.startEntry(3)
			this.storePosition()
		},
		storePosition() {
			localStorage.setItem('position', this.position)
		},
		startEntry(side) {
			this.entry = {
				start: new Date(),
				side
			}
			localStorage.setItem('entry', JSON.stringify(this.entry))
		},
		endEntry() {
			if (!this.entry) return

			this.entry.end = new Date()
			this.log.push(this.entry)
			localStorage.setItem('log', JSON.stringify(this.log))
			this.entry = undefined
			Vue.nextTick(this.scrollTop())
		},
		toggleDrawer() {
			this.drawerClosed = !this.drawerClosed
			if (!this.drawerClosed) {
				this.scrollTop()
			}
		},
		openAddEntry() {
			this.newEntry = {
				start: new Date(),
				side: 1,
				end: new Date()
			}
			this.entryOpen = true
		},
		getDate({day, month}) {
			let tmpDate = new Date()
			tmpDate.setDate(day)
			tmpDate.setMonth(month)
			return new Intl.DateTimeFormat('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'}).format(tmpDate)
		},
		getTime(date) {
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
		},
		reset() {
			if (confirm('Souhaitez-vous supprimer les données ?')) {
				localStorage.setItem('position', 0)
				localStorage.setItem('log', [])
				localStorage.setItem('entry', undefined)
				this.log = []
				this.entry = undefined
				this.position = 0
			}
		},
		addNewEntry() {
			if (this.newEntry) {
				this.log.push(this.newEntry)
				localStorage.setItem('log', JSON.stringify(this.log))
				this.entry = undefined
				Vue.nextTick(this.scrollTop())
			}
		},
		openImport() {
			this.importOpen = true
		},
		addNewEntries(entries) {
			this.log.push(...entries)
			localStorage.setItem('log', JSON.stringify(this.log))
			this.entry = undefined
			Vue.nextTick(this.scrollTop())
		}
	}
})