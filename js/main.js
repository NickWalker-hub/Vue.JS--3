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
            showCard: true,
        }
    },
    methods:{

    },
    mounted() {
        eventBus.$on('create', card => {
            this.column1.push(card)
        });
        eventBus.$on('moving1', card => {
            this.column2.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
        });
        eventBus.$on('moving2', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        });
        eventBus.$on('moving3-2', card => {
            this.column2.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
        });
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
                updateCard: false,
                dateLastChange: null,
                dateEnd: null,
                inTime: true,
                reason: [],
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
                <button @click="(card)">Удалить</button>
                <button @click="updateC">Отредактировать задачу</button>
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
            </ul>
            <button @click="moving(card)">⮫</button>
        </div>
    </div>
    `,
    methods: {
        deleteCard(card){
            this.column1.splice(this.column1.indexOf(card), 1)
        },
        updateC(card){
            card.updateCard = true
            console.log(card.updateCard)
        },
        updateTask(card){
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            card.dateLastChange = new Date().toLocaleString()
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving1', card)
        },
    },
});

Vue.component('column2', {
    props:{
        card:{
            type:Object,
            required: true
        },
        column2:{
            type: Array,
            required: true
        },
        reason: {
            type: Array,
            required: true
        },
    },
    template:`
    <div class="column">
        <h2>Задачи в работе</h2>
        <div v-for="card in column2">
            <ul>
                <li><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание:</b> {{ card.description }}</li>
                <li><b>Дедлайн:</b> {{ card.dateDeadline }}</li>
                <li><b>Создано:</b> {{ card.dateCreate }}</li>
                <li v-if="card.dateLastChange"><b>Последнее изменение</b>{{ card.dateLastChange }}</li>
                <li v-if="card.reason.length"><b>Комментарий: </b><li v-for="r in card.reason">{{ r }}</li></li>
                <button @click="updateC(card)">Отредактировать задачу</button>
                <div v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Заголовок:
                            <input type="text" v-model="card.title" maxlength="50" placeholder="Заголовок">
                        </p>
                        <p>Описание:
                            <textarea v-model="card.description" cols="25" rows="5"></textarea>
                        </p>
                        <p>Дедлайн:
                            <input type="date" v-model="card.dateDeadLine">
                        </p>
                        <p>
                            <input type="submit" value="Отредактировать задачу">
                        </p>
                    </form>
                </div>
            </ul>
             <button @click="moving(card)">⮫</button>
        </div>     
    </div>
    `,
    methods: {
        updateC(card){
            card.updateCard = true
            console.log(card.updateCard)
        },
        updateTask(card){
            this.column2.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
            card.dateL = new Date().toLocaleString()
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving2', card)
        },
    },
});

Vue.component('column3', {
    props:{
        card:{
            type:Object,
            required: true
        },
        column3:{
            type: Array,
            required: true
        },
        reason:{
            type:Array,
            required: true
        },
    },
    template:`
    <div class="column">
        <h2>Тестирование</h2>
        <div v-for="card in column3">
            <ul>
                <li><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание:</b> {{ card.description }}</li>
                <li><b>Дедлайн:</b> {{ card.dateDeadLine }}</li>
                <li><b>Создано:</b> {{ card.dateCreate }}</li>
                <li v-if="card.dateLastChange"><b>Последнее изменение:</b>{{ card.dateLastChange }}</li>
                <li v-if="card.reason.length"><b>Комментарий:</b><li v-for="r in card.reason">{{ r }}</li></li>
                <li v-if="moveBack">
                    <form @submit.prevent="onSubmit(card)">
                        <textarea v-model="reason2" cols="20" rows="4"></textarea>
                        <input type="submit" value="Подтвердить">
                    </form>
                </li>
                <button @click="updateC(card)">Отредактировать задачу</button>
                <div v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Заголовок:
                            <input type="text" v-model="card.title" maxlength="50" placeholder="Заголовок">
                        </p>
                        <p>Описание:
                            <textarea v-model="card.description" cols="25" rows="5"></textarea>
                        </p>
                        <p>Дедлайн:
                            <input type="date" v-model="card.dateDeadLine">
                        </p>
                        <p>
                            <input type="submit" value="Отредактиовать задачу">
                        </p>
                    </form>
                </div>
            </ul>
            <button @click="movingBack">⮪</button>
            <button @click="moving">⮫</button>
        </div>  
    </div>
    `,
    data(){
        return{
            moveBack: false,
            reason2: null,
        }
    },
    methods: {
        updateC(card){
            card.updateCard = true
            console.log(card.updateCard)
        },
        updateTask(card){
            this.column3.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateLastChange = new Date().toLocaleString()
            return card.updateCard = false
        },
        moving(card){
            eventBus.$emit('moving3-4', card)
            card.dateEnd = new Date().toLocaleDateString()
        },
        movingBack(){
            this.moveBack = true
        },
        onSubmit(card) {
            card.reason.push(this.reason2)
            eventBus.$emit('moving3-2', card)
            this.reason2 = null
            this.moveBack = false
        },
    },
});

Vue.component('column4', {
    props:{
        card: {
            type: Object,
            required: true
        },
        column4:{
            type: Array,
            required: true,
        },
    },
    template:`
    <div class="column">
        <h2>Выполненные задачи</h2>
        <div v-for="card in column4">
            <ul>
                <li><b>Заголовок:</b> {{ card.title }}</li>
                <li><b>Описание:</b> {{ card.description }}</li>
                <li><b>Дедлайн:</b> {{ card.dateDeadLine }}</li>
                <li><b>Создано:</b> {{ card.dateCreate }}</li>
                <li v-if="card.dateLastChange"><b>Пследнее изменение:</b>{{ card.dateLastChange }}</li>
            </ul>
        </div>
    </div>
    `,
    methods: {

    },
});

let app = new Vue({
    el:'#app',
    data:{

    }
});
