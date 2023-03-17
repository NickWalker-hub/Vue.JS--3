let eventBus = new Vue()

Vue.component('cards', {
    template:`
    <div>
        <fill></fill>
        <div id="columns">
            <column1 :column1="column1"></column1>
            <column2 :column2="column2"></column2>
            <column3 :column3="column3"></column3>
            <column4 :column4="column4"></column4>
        </div>
    </div>
    `,
    data() {
        return {
            column1:[],
            column2:[],
            column3:[],
            column4:[],
            updateCard: false
        }
    },
    methods:{
    },
    mounted() {
        eventBus.$on('create', card => {
            this.column1.push(card)
        })
    }
});

Vue.component('fill', {
    props:{
    },
    template:`
    <div>
        <h1>Новая задача</h1>
        <form @submit.prevent="onSubmit">
            <p>Заголовок:
                <input type="text" v-model="title" maxlength="50" placeholder="">
            </p>
            <p>Описание:
                <textarea v-model="description" cols="25" rows="5"></textarea>
            </p>
            <p>Дедлайн:
                <input type="date" v-model="dateDeadline">
            </p>
            <p>
                <input type="submit" value="Добавить новую задачу">
            </p>
        </form>
    </div>
    `,
    data(){
        return {
            title: null,
            description: null,
            dateDeadline: null,
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                dateDeadline: this.dateDeadline,
                dateCreate: new Date().toLocaleString(),
                dateLastChange: null,
                dateEnd: null,
                inTime: true,
            }
            eventBus.$emit('create', card)
            this.title = null
            this.description = null
            this.dateDeadline = null
            console.log(card)
        },
    }
});

Vue.component('column1', {
    props:{
        card: {
            type: Object,
            required: true
        },
        column1: {
            type: Array,
            required: true
        },
        updateCard:{
            type: Boolean,
            required: true
        }
    },
    template:`
    <div class="column">
        <h2>Запланированные задачи</h2>
        <div v-for="card in column1">
            <ul>
                <li><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание:</b> {{ card.description }}</li>
                <li><b>Дедлайн:</b> {{ card.dateDeadline }}</li>
                <li><b>Создано:</b> {{ card.dateCreate }}</li>
                <li v-if="card.dateLastChange"><b>Последнее изменение</b>{{ card.dateLastChange }}</li>
            </ul>
            <button @click="deleteCard(card)">Удалить</button>
            <button @click="updateC">Редактировать</button>
            <div v-if="updateCard">
                <form @submit.prevent="updateTask(card)">
                    <p>Заголовок:
                        <input type="text" v-model="card.title" maxlength="50" placeholder="">
                    </p>
                    <p>Описание:
                        <textarea v-model="card.description" cols="25" rows="5"></textarea>
                    </p>
                    <p>Дедлайн:
                        <input type="date" v-model="card.dateDeadline">
                    </p>
                    <p>
                        <input type="submit" value="Отредактировать задачу">
                    </p>
                </form>
            </div>
        </div>
    </div>
    `,
    methods: {
        deleteCard(card){
            this.column1.splice(this.column1.indexOf(card), 1)
        },
        updateC(){
            this.updateCard = true
            console.log(this.updateCard)
        },
        updateTask(card){
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
        }
    },
});

Vue.component('column2', {
    props:{

    },
    template:`
    <div class="column">
        <h3>Задачи в работе</h3>
    </div>
    `,
    methods: {

    },
})

Vue.component('column3', {
    props:{

    },
    template:`
    <div class="column">
        <h3>Тестирование</h3>
    </div>
    `,
    methods: {

    },
})

Vue.component('column4', {
    props:{

    },
    template:`
    <div class="column">
        <h3>Выполненные задачи</h3>
    </div>
    `,
    methods: {

    },
})

let app = new Vue({
    el:'#app',
    data:{

    }
});
