Vue.component('import-modal', {
	template: `<div id="import-modal" @click="close">
		<div id="import-content" @click.stop>
			<i class="icofont-ui-close" @click.stop="close"></i>
			<textarea v-model="raw"></textarea>
			<div @click="validate">Valider</div>
		</div>
	</div>`,
	data() {
		return {
			raw: ''
		}
	},
	methods: {
		close() {
			this.$emit('close')
		},
		validate() {
			let previousStart = new Date()
			let entries = this.raw.split('\n').reverse().map(rawEntry => {
				[rawStart, rawSide, rawEnd] = rawEntry.split(' ')

				let start = new Date(previousStart)
				start.setHours(rawStart.substring(0, 2))
				start.setMinutes(rawStart.substring(2))
				let side = rawSide.match(/droit/) ? 2 : rawSide.match(/gauche/) ? 1 : 3
				let end = new Date(previousStart)
				end.setHours(rawEnd.substring(0, 2))
				end.setMinutes(rawEnd.substring(2))
				if (previousStart.getHours() < start.getHours()) {
					start.setDate(previousStart.getDate() - 1)
					previousStart = start
					if (end.getHours() > start.getHours) {
						end.setDate(previousStart.getDate() - 1)
					}
				}

				return {
					start,
					side,
					end
				}
			})
console.log(entries)
			this.$emit('input', entries)
			this.$emit('close')
		}
	}
})