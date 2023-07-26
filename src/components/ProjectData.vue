<template>
  <main class="main-container">
    <h2> Проектные данные </h2>
    <div class="button-group">
      <button class="basic-btn" style="margin-right: 5px"> Основное </button>
      <button class="btn-disabled" style="cursor: not-allowed" data-tooltip="эта подсказка длиннее, чем элемент"> Перечень ПСД </button>
    </div>
    <div class="form-container">
      <div class="form-block">
        <form ref="formData">
          <div class="form-column">
            <h4> Наименование и шифр</h4>
            <hr>
            <div class="all-fields">
              <label for="name">Наименование</label>
              <input :class="{ 'empty-input': isEmptyInput(project.name) }" type="text" v-model="project.name" id="name">
              <span v-if="isEmptyInput(project.name)" class="error-message">Ошибка</span>
            </div>

            <div class="all-fields">
              <label for="code">Шифр</label>
              <input :class="{ 'empty-input': isEmptyInput(project.code) }" type="text" v-model="project.code" id="code">
              <span v-if="isEmptyInput(project.code)" class="error-message">Ошибка</span>
            </div>

          <div class="form-column">
            <h4> Местонахождение проекта</h4>
            <hr>
            <template v-for="field in fields" :key="field.id">
              <label :for="field.id">{{ field.label }}</label>
              <input class="all-fields" @input="fetchDataFrom" v-model="project[field.apiProperty]" :class="{ 'empty-input': isEmptyInput(project[field.apiProperty]) }" :id="field.id" @focus="showDropdown(field.listId)">
              <span v-if="isEmptyInput(project[field.apiProperty])" class="error-message">Ошибка</span>
              <ul v-if="showList(field.listId)" class="dropdown-list">
                <li v-for="information in responseData" :key="information.id" @click="selectOption(field, information[field.apiProperty])">
                  {{ information[field.apiProperty] }}
                </li>
              </ul>
            </template>
          </div>
            <div class="address-column all-fields">
              <div>
                <label for="house">Дом</label>
                <input :class="{ 'empty-input': isEmptyInput(project.house) }" type="text" v-model="project.house" id="house">
                <span v-if="isEmptyInput(project.house)" class="error-message">Ошибка</span>
              </div>
              <div>
                <label for="housing">Корпус</label>
                <input :class="{ 'empty-input': isEmptyInput(project.housing) }" type="text" v-model="project.housing" id="housing">
                <span v-if="isEmptyInput(project.housing)" class="error-message">Ошибка</span>
              </div>
            </div>

            <label for="index">Почтовый индекс</label>
            <input :class="{ 'empty-input': isEmptyInput(project.postcode) }" class="postcode" type="number" v-model="project.postcode" id="index">
            <span v-if="isEmptyInput(project.postcode)" class="error-message">Ошибка</span>
          </div>
        </form>
      </div>
    </div>
    <hr>
    <div class="bottom-bnt">
      <button :class="isSaveButtonActive ? 'save-btn' : 'btn-disabled'" :disabled="!isSaveButtonActive" type="submit" @click="saveChanges">Сохранить</button>
      <button :disabled="!hasChanges" class="reset-btn" type="reset" @click="cancelChanges">Отменить</button>
      <!--      не активна должна быть есть поля пустые-->
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import { onMounted, ref, computed, watch } from 'vue'

export default {
  setup() {

    const activeList = ref(null)
    const isDisabled = ref(true)
    const responseData = ref([])
    const showError = ref(false)
    const project = ref({
      name: '',
      code: '',
      house: '',
      housing: '',
      postcode: ''
    })

    const fields = ref([
      { id: 'allCountries', label: 'Страна', apiProperty: 'country', listId: 'countries' },
      { id: 'region', label: 'Область/Край', apiProperty: 'region_with_type', listId: 'regions' },
      { id: 'locality', label: 'Населенный пункт', apiProperty: 'settlement', listId: 'settlement' },
      { id: 'street', label: 'Улица/Проспект', apiProperty: 'street', listId: 'streets' },
    ])

    const fetchDataFrom = () => {
      axios
        .post(
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
        ).then(res => {
          responseData.value = res.data.suggestions.map(suggestion => suggestion.data)
        })
          .catch(error => {
            console.error(error)
          })
    }

    const hasChanges = computed(() => {
      return (
          project.value.name !== localStorage.getItem('Name') ||
          project.value.code !== localStorage.getItem('Code') ||
          project.value.house !== localStorage.getItem('House') ||
          project.value.housing !== localStorage.getItem('Housing') ||
          project.value.postcode !== localStorage.getItem('Index')
      )
    })
    const isEmptyInput = (value) => {
      return typeof value === 'string' && value.trim() === ''
    }
    const emptyFields = computed(() => {
      return (
          project.value.name.trim() === '' ||
          project.value.code.trim() === '' ||
          project.value.house.trim() === '' ||
          project.value.housing.trim() === ''
      )
    })
    const isSaveButtonActive = computed(() => {
      return !emptyFields.value && hasChanges.value
    })

    const saveChanges = () => {
      if (!emptyFields.value && hasChanges.value) {
        localStorage.setItem('projectData', JSON.stringify(project.value))

        alert('Данные сохранены')
        isDisabled.value = true
      } else {
        isDisabled.value = true
        alert('Заполните все поля')
      }
    }

    const showDropdown = (listId) => {
      activeList.value = listId
    }

    const showList = (listId) => {
      return activeList.value === listId && responseData.value.length > 0
    }

    const selectOption = (field, value) => {
      project.value[field.apiProperty] = value
      activeList.value = null
    }

    watch(responseData, (newValue) => {
      if (newValue.length === 0) {
        activeList.value = null
      }
    })
    const getLocalStorageData = () => {
      if (localStorage.getItem('projectData')) {
        project.value = JSON.parse(localStorage.getItem('projectData'))
      }
    }
    const cancelChanges = () => {
      getLocalStorageData()
    }
    watch(() => [project.value.name, project.value.code, project.value.house, project.value.housing ], () => {
      isDisabled.value = emptyFields.value
    })
    onMounted(() => {
      getLocalStorageData()
    })
    return {
      isEmptyInput,
      showDropdown,
      showList,
      selectOption,
      saveChanges,
      isDisabled,
      responseData,
      fetchDataFrom,
      fields,
      cancelChanges,
      showError,
      emptyFields,
      hasChanges,
      project,
      isSaveButtonActive
    }
  }
}
</script>

<style>
.empty-input {
  border-bottom: 2px solid red;
}
.error-message {
  margin-top: 4px;
  display: flex;
  color: red;
  font-size: 14px;
}
.all-fields {
  margin-bottom: 20px;
}
</style>
