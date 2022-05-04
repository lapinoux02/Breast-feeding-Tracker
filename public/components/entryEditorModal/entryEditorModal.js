Vue.component('entry-editor-modal', {
	template: `<div id="entry-editor-modal" @click="close">
		<div id="entry-editor-content" @click.stop>
			<i class="icofont-ui-close" @click.stop="close"></i>
			<datetime-picker v-model="start"></datetime-picker>
			<input v-model="side" type="number" :min="1" max="3">
			<datetime-picker v-model="end"></datetime-picker>
			<div class="validate" @click="validate">Valider</div>
		</div>
	</div>`,
	props: {
		value: {
			type: Object,
			default: () => ({start: new Date(), side: 1, end: new Date()})
		}
	},
	data() {
		return {
			start: this.value.start,
			side: this.value.side,
			end: this.value.end
		}
	},
	methods: {
		close() {
			this.$emit('close')
		},
		validate() {
			this.$emit('input', {
				start: this.start,
				side: parseInt(this.side),
				end: this.end
			})
			this.$emit('close')
		}
	}
})