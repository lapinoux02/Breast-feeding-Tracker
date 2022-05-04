Vue.component('number-selector', {
	template: `<div class="number-selector">
		<i class="icofont-caret-up" @click.stop="add"></i>
		<input type="number" :min="min" :max="max" v-model="number" @input="$emit('input', number)">
		<i class="icofont-caret-down" @click.stop="sub"></i>
	</div>`,
	props: {
		value: {
			type: [Number, String],
			required: true
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 60
		}
	},
	watch: {
		value(newValue) {
			this.number = newValue
		}
	},
	data() {
		return {
			number: this.value
		}
	},
	methods: {
		add() {
			if (this.number < this.max) {
				this.number++
				this.$emit('input', this.number)
			}
		},
		sub() {
			if (this.number > this.min) {
				this.number--
				this.$emit('input', this.number)
			}
		}
	}
})

Vue.component('datetime-picker', {
	template: `<div class="datetime-picker">
		<div class="fake-input" @click="openPicker">{{formatedDate}}</div>
		<div v-if="pickerOpen" class="picker-modal" @click="closePicker">
			<div class="picker" @click.stop>
				<i class="icofont-ui-close" @click.stop="closePicker"></i>
				<number-selector v-model="month" :min="1" :max="12" @input="handleDaysInMonth"/>
				/
				<number-selector v-model="day" :max="monthDays" @input="inputHandler" />
				,
				<number-selector v-model="hour" @input="inputHandler" />
				:
				<number-selector v-model="minute" @input="inputHandler" />
			</div>
		</div>
	</div>`,
	props: {
		value: {
			type: Date,
			required: false,
			default: () => new Date()
		}
	},
	data() {
		return {
			month: this.value.getMonth() + 1,
			day: this.value.getDate(),
			hour: this.value.getHours(),
			minute: this.value.getMinutes(),
			pickerOpen: false
		}
	},
	methods: {
		zeroPad(val, n = 2) {
			return (new Array(n).fill('0').join('') + val).slice(-n)
		},
		openPicker() {
			this.pickerOpen = true
		},
		closePicker() {
			this.pickerOpen = false
		},
		inputHandler() {
			this.$emit('input', this.date)
		},
		handleDaysInMonth() {
			if (this.monthDays < this.day) {
				this.day = this.monthDays
				console.log(this.day)
			}
			this.inputHandler()
		}
	},
	computed: {
		date() {
			let newDate = new Date()
			newDate.setMonth(this.month - 1)
			newDate.setDate(this.day)
			newDate.setHours(this.hour)
			newDate.setMinutes(this.minute)

			return newDate
		},
		formatedDate() {
			return new Intl.DateTimeFormat('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'}).format(this.date)
		},
		monthDays() {
			return new Date(new Date().getFullYear(), this.month, 0).getDate()
		}
	}
})