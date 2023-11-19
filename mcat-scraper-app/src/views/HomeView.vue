<script setup lang="ts">
import { onMounted } from 'vue';
import {  type ImcatQuestion } from '@/models/types/ImcatQuestion';
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

let testQuestion = {
    question: 'Why are triacylglycerols used in the human body for energy storage?',
    date: new Date(),
    answers: {    
        answerA: 'They are highly hydrated, and therefore can store lots of energy. ',
        answerB: 'They always have short fatty acid chains, for easy access by metabolic enzymes.',
        answerC: 'The carbon atoms of the fatty acid chains are highly reduced, and therefore yield more energy upon oxidation.',
        answerD: 'Polysaccharides, which would actually be a better energy storage form, would dissolve in the body.',
    },
    correctAnswer: 'C',
    answerExplanation: 'Triacylglycerols are highly hydrophobic and therefore not highly hydrated (which would add extra weight from the water of hydration, taking away from the energy density of these molecules), eliminating choice (A). The fatty acid chains produce twice as much energy as polysaccharides during oxidation because they are highly reduced. The fatty acid chains vary in length and saturation.'
} as ImcatQuestion

// let mcatQuestions : ImcatQuestion[];
// mcatQuestion.find().then((data) => {
//   mcatQuestions = data
//   console.log('wtf is happening here??', mcatQuestions)
// })

// onMounted(async () => {
  
//   const mcatQuestions = data as ImcatQuestion[]
// })

axios.get('http://localhost:3003/question')
.then(data => { loadQuestionDataFromAPI(data.data)})
.catch(err => console.log(err))
const mcatQuestions = reactive({ questions: [{}]})
const selectedQuestion = reactive({question: testQuestion as ImcatQuestion})

const show = ref(false)
const chosenAnswer = ref('D')
const answered = ref(false)
const correct = ref(false)

function showQuestionInSlideout(question: ImcatQuestion){
  show.value = true
  selectedQuestion.question = question
}

function loadQuestionDataFromAPI(data: any) {
  mcatQuestions.questions = [];
  [...data].forEach((singleData: any) => {
    //Version Upgrade: There has got to be some way to read this into JS from mongoose schema info, I mean I could probably just full on paste it in, but that feels wrong
    mcatQuestions.questions.push({
      question: singleData.question,
      date: new Date(singleData.date),
      answers: singleData.answers,
      correctAnswer: singleData.correctAnswer,
      answerExplanation: singleData.answerExplanation
    } as any)
  })
}

//Version Upgrade: This should be moved to its own file and imported as needed, this is kind of like killing a fly with a shotgun...oh well, I like the tool
const { t, d } = useI18n({
  locale: 'en-US',
  datetimeFormats: {
    'en-US': {
        short: {
          year: 'numeric', month: 'short', day: 'numeric'
        },
        long: {
          year: 'numeric', month: 'short', day: 'numeric',
          weekday: 'short', hour: 'numeric', minute: 'numeric'
        }
    }
  }
})


function closeSlideout(){
  show.value = false
}

function evaluateAnswer() {
  answered.value = true;
  (chosenAnswer.value === selectedQuestion.question.correctAnswer) ? correct.value = true : correct.value = false
}

const watcher = watch(show, (newShow, oldShow) => {
  if (!newShow) {
    answered.value = false;
    correct.value = false;
  }
}
)
</script>

<template>
  <body>
    <div class="home">
      <ui-list>
        <template v-for="question in mcatQuestions.questions">
          <ui-item @click="showQuestionInSlideout(question);">
            <ui-item-text-content>{{ d(question.date, 'short') + ' - ' + question.question }}</ui-item-text-content>
          </ui-item>
        </template>
      </ui-list>

      <!-- Answer slideout, can probably turn into a component -->
      <ui-side-sheet v-model="show" closable>
        <template #title>
          <!-- Can't change balm UI to span, so this is the next best thing, need the br tags from the db to actually be used -->
          <span v-html="'Question:' + selectedQuestion.question.question"></span>
        </template>
        <ui-list>
          <ui-item>
            <ui-form-field>
              <ui-radio v-model="chosenAnswer" input-id="A" value="A"></ui-radio>
              <label for="A">A: {{ selectedQuestion.question.answers.answerA }} </label>
            </ui-form-field>
          </ui-item>
          <ui-item>
            <ui-form-field>
              <ui-radio v-model="chosenAnswer" input-id="B" value="B"></ui-radio>
              <label for="B">B: {{ selectedQuestion.question.answers.answerB }} </label>
            </ui-form-field>
          </ui-item>
          <ui-item>
            <ui-form-field>
              <ui-radio v-model="chosenAnswer" input-id="C" value="C"></ui-radio>
              <label for="C">C: {{ selectedQuestion.question.answers.answerC }} </label>
            </ui-form-field>
          </ui-item>
          <ui-item>
            <ui-form-field>
              <ui-radio v-model="chosenAnswer" input-id="D" value="D"></ui-radio>
              <label for="D">D: {{ selectedQuestion.question.answers.answerD }} </label>
            </ui-form-field>
          </ui-item>
        </ui-list>
        <ui-alert v-if="answered && correct" state="success">Answer is correct!!</ui-alert>
        <ui-alert v-else-if="answered" state="error">
          Answer is not correct. :(
        </ui-alert>
        <ui-collapse v-if="answered && !correct">
            <template #toggle>
              <ui-button>Show Correct Answer</ui-button>
            </template>
            <div class="padded-div">Correct Answer is {{ selectedQuestion.question.correctAnswer }}</div>
            <div class="padded-div">{{ selectedQuestion.question.answerExplanation }}</div>
          </ui-collapse> 
        <template #actions>
          <ui-button @click="evaluateAnswer()" raised>Answer</ui-button>
        </template>
      </ui-side-sheet>

      
    </div>
  </body>
</template>


<style scoped>
.padded-div {
  padding: .5rem;
}
</style>