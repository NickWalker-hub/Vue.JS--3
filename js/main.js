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
        })
        eventBus.$on('moving1', card => {
            this.column2.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
        })
        eventBus.$on('moving2', card => {
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        })
        eventBus.$on('moving3-2', card => {
            this.column2.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateEnd = new Date().toLocaleDateString()
        })
        eventBus.$on('moving3-4', card => {
            this.column4.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
            card.dateEnd = new Date().toLocaleDateString()
            card.dateEnd = card.dateEnd.split('.').reverse().join('-')
            console.log(card)
            if (card.dateEnd > card.dateDeadLine){
                card.inTime = false
            }
        })
    },
});

Vue.component('fill', {
    props:{
    },
    template:`
    <div>
    <div id="form">
        <h2>Новая задача</h2>
        <form @submit.prevent="onSubmit">
            <p class="pForm">Заголовок: 
                <input required type="text" v-model="title" maxlength="30" placeholder="">
            </p>
           <p class="pForm">Описание: </p>
            <textarea v-model="description" cols="32" rows="4"></textarea>
            <p class="pForm">Дедлайн: 
                <input required type="date" v-model="dateDeadLine">
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
            dateDeadLine: null,
        }
    },
    methods: {
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                dateDeadLine: this.dateDeadLine,
                dateCreate: new Date().toLocaleString(),
                updateCard: false,
                dateLastChange: null,
                dateEnd: null,
                inTime: true,
                reason: []
            }
            eventBus.$emit('create', card)
            this.title = null
            this.description = null
            this.dateDeadLine = null
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
        <h3>Запланированные задачи</h3>
        <div class="card" v-for="card in column1">
            <ul>
                <li class="title"><b>Заголовок: </b>{{ card.title }}</li>
                <li><b>Описание: </b>{{ card.description }}</li>
                <li><b>Дедлайн: </b>{{ card.dateDeadLine }}</li>
                <li><b>Создано: </b>{{ card.dateCreate }}</li>
                <li v-if="card.dateLastChange"><b>Последнее изменение: </b>{{ card.dateLastChange }}</li>
                <button @click="deleteCard(card)">Удалить</button>
                <button @click="updateC(card)">Изменить</button>
                <div class="change" v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Заголовок: 
                            <input type="text" v-model="card.title" maxlength="50" placeholder="">
                        </p>
                        <p>Описание: 
                            <textarea v-model="card.description" cols="25" rows="5"></textarea>
                        </p>
                        <p>Дедлайн: 
                            <input type="date" v-model="card.dateDeadLine">
                        </p>
                        <p>
                             <input class="button" type="submit" value="Отредактировать задачу">
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
        reason:{
            type:Array,
            required: true
        },
    },
    template:`
    <div class="column">
        <h3>В работе</h3>
         <div class="card" v-for="card in column2">
            <ul>
                 <li class="title"><b>Заголовок: </b>{{ card.title }}</li>
                <li><b>Описание: </b>{{ card.description }}</li>
                <li><b>Дедлайн: </b>{{ card.dateDeadLine }}</li>
                <li><b>Создания: </b>{{ card.dateCreate }}</li>
                <li v-if="card.dateLastChange"><b>Последнее изменение: </b>{{ card.dateLastChange }}</li>
                <li v-if="card.reason.length"><b>Комментарий: </b><li v-for="r in card.reason">{{ r }}</li></li>
                <button @click="updateC(card)">Изменить</button>
                 <div class="change" v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Заголовок: 
                            <input type="text" v-model="card.title" maxlength="50" placeholder="">
                        </p>
                        <p>Описание: 
                            <textarea v-model="card.description" cols="25" rows="5"></textarea>
                        </p>
                        <p>Дедлайн: 
                            <input type="date" v-model="card.dateD">
                        </p>
                        <p>
                            <input class="button" type="submit" value="Отредактировать задачу">
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
            card.dateLastChange = new Date().toLocaleString()
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
        <h3>Тестирование</h3>
        <div class="card" v-for="card in column3">
            <ul>
                <li class="title"><b>Заголовок: </b>{{ card.title }}</li>
                <li><b>Описание: </b>{{ card.description }}</li>
                <li><b>Дедлайн: </b>{{ card.dateDeadLine }}</li>
                <li><b>Создано: </b>{{ card.dateCreate }}</li>
                <li v-if="card.dateLastChange"><b>Последнее изменение: </b>{{ card.dateLastChange }}</li>
                <li v-if="card.reason.length"><b>Комментарий: </b><li v-for="r in card.reason">{{ r }}</li></li>
                <li v-if="moveBack">
                    <form @submit.prevent="onSubmit(card)">
                        <textarea v-model="reason2" cols="20" rows="4"></textarea>
                        <input class="button" type="submit" value="Подтвердить">
                    </form>
                </li>
                <button @click="updateC(card)">Изменить</button>
                 <div class="change" v-if="card.updateCard">
                    <form @submit.prevent="updateTask(card)">
                        <p>Заголовок: 
                            <input type="text" v-model="card.title" maxlength="50" placeholder="">
                        </p>
                        <p>Описание: 
                            <textarea v-model="card.description" cols="25" rows="5"></textarea>
                        </p>
                        <p>Дедлайн: 
                            <input type="date" v-model="card.dateDeadLine">
                        </p>
                        <p>
                            <input class="button" type="submit" value="Отредактировать задачу">
                        </p>
                    </form>
                </div>
            </ul>
            <button @click="movingBack">⮪</button>
            <button @click="moving(card)">⮫</button>
        </div>    
    </div>
    `,
    data(){
        return{
            moveBack: false,
            reason2: null
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
        <h3>Выполненные задачи</h3>
         <div class="card" v-for="card in column4">
            <ul>
                <li class="title"><b>Заголовок: </b>{{ card.title }}</li>
                <li><b>Описание: </b>{{ card.description }}</li>
                <li><b>Создано: </b>{{ card.dateCreate }}</li>
                <li><b>Выполнено: </b>{{ card.dateCreate }}</li>
                <li><b>Дедлайн: </b>{{ card.dateDeadLine }}</li>
                <li id="inTime" v-if="card.inTime">Задача выполнена в срок 👍</li>
                <li id="notInTime" v-else>Задача выполнена не в срок 👎</li>
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
