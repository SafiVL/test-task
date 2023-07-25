<template>
  <div>
    <h2> Проектные данные </h2>
    <button> Основное </button>
    <button :disabled="!isDisabled" style="cursor: not-allowed"> Перечень ПСД </button>
    <h4> Наименование и шифр</h4>
    <hr>
    <form ref="form" action="pinia.js" method="post">
      <label for="name">Наименование</label>
      <input type="text" v-model="projectName" id="name">

      <label for="code">Шифр</label>
      <input type="text" v-model="projectCode" id="code">

      <template v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}</label>
        <input @input="fetchDataFrom" type="text" v-model="field.value" :id="field.id" :list="field.listId">
        <datalist :id="field.listId">
          <option v-for="information in responseData" :key="information.id" :value="information[field.apiProperty]" />
        </datalist>
      </template>

      <label for="house">Дом</label>
      <input type="text" v-model="projectHouse" id="house">

      <label for="housing">Корпус</label>
      <input type="text" v-model="projectHousing" id="housing">

      <label for="index">Почтовый индекс</label>
      <input type="number" v-model="projectIndex" id="index">

    </form>
  </div>
  <hr>
  <input type="reset" @click="cancelChanges" value="Отменить">
  <input type="submit" @click="saveChanges" value="Сохранить">
</template>

<script>
import axios from 'axios'
import {onMounted, ref} from 'vue'
import { useProjectModule } from '../pinia'

export default {
  setup() {
    const projectModule = useProjectModule()
    const projectName = ref('')
    const projectCode = ref('')
    const projectHouse = ref('')
    const projectHousing = ref('')
    const projectIndex = ref('')
    const isDisabled = ref(false)
    const responseData = ref([])
    const form = ref(null)
    const fields = ref([
      { id: 'allCountries', label: 'Страна', apiProperty: 'country', listId: 'countries', value: '' },
      { id: 'region', label: 'Область/Край', apiProperty: 'region_with_type', listId: 'regions', value: '' },
      { id: 'locality', label: 'Населенный пункт', apiProperty: 'settlement', listId: 'settlement', value: '' },
      { id: 'street', label: 'Улица/Проспект', apiProperty: 'street', listId: 'streets', value: '' },
    ])

    const fetchDataFrom = () => {
      axios.post(
          'https://dadata.ru/api/v2/suggest/address',
          {
            query: "value",
            count: 20
          },
          {
            headers: {
              Authorization: 'Token 50535c6ad48bfcc31f62b5b76743ce0169a05d88',
            },
          }
      )
          .then(res => {
            responseData.value = res.data.suggestions.map(suggestion => suggestion.data)
          })
          .catch(error => {
            console.error(error)
          })
    }
    const saveChanges = () => {
      isDisabled.value = true
      if (projectName.value && projectCode.value && projectHouse.value && projectHousing.value && projectIndex.value != '') {
        localStorage.setItem('Name', projectName.value)
        localStorage.setItem('Code', projectCode.value)
        localStorage.setItem('House', projectHouse.value)
        localStorage.setItem('Housing', projectHousing.value)
        localStorage.setItem('Index', projectIndex.value)
        for (const field of fields.value) {
          localStorage.setItem(field.id, field.value)
        }
      alert("Данные сохранены")
      } else {
        alert("Заполните все поля")
      }
    }
    const cancelChanges = () => {
      projectName.value = ''
      projectCode.value = ''
      projectHouse.value = ''
      projectHousing.value = ''
      projectIndex.value = ''
      for (const field of fields.value) {
        field.value = ''
      }
    }
    onMounted(() => {
      projectName.value = localStorage.getItem('Name') || ''
      projectCode.value = localStorage.getItem('Code') || ''
      projectHouse.value = localStorage.getItem('projectHouse') || ''
      projectHousing.value = localStorage.getItem('projectHousing') || ''
      projectIndex.value = localStorage.getItem('projectIndex') || ''
      for (const field of fields.value) {
        field.value = localStorage.getItem(field.id)
      }
    })
    return {
      saveChanges,
      projectCode,
      projectName,
      projectHouse,
      projectHousing,
      projectIndex,
      isDisabled,
      responseData,
      fetchDataFrom,
      fields,
      projectModule,
      form,
      cancelChanges
    }
  }
}
</script>

<style scoped>
label {
  font-size: 14px;
}
input {
  border: none;
  border-bottom: 2px solid #D0D4E3;
}
input:focus {
  outline: none;
  border-bottom: 2px solid #161619;
}
</style>
