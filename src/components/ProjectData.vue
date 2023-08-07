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
              <label>Наименование</label>
              <ui-input v-model="project.name" required></ui-input>
            </div>
            <div class="all-fields">
              <label>Шифр</label>
              <ui-input v-model="project.code" required></ui-input>
            </div>
          <div class="form-column">
            <h4> Местонахождение проекта</h4>
            <hr>
            <template v-for="field in fields" :key="field.id">
              <label :for="field">{{ field.label }}</label>
              <autocomplete-input :response-data="activeFieldData" required/>
            </template>
          </div>
            <div class="address-column all-fields">
              <div>
                <label>Дом</label>
                <ui-input v-model="project.house" required></ui-input>
              </div>
              <div>
                <label>Корпус</label>
                <ui-input v-model="project.housing" required></ui-input>
              </div>
            </div>
            <label>Почтовый индекс</label>
            <ui-input v-model="project.postcode"  required></ui-input>
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
import UiInput from '../components/UiInput'
import AutocompleteInput from '../components/AutocompleteInput'

export default {
  components: {
    UiInput,
    AutocompleteInput
  },
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
          'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
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
          console.log(res.data)
          responseData.value = res.data.suggestions.map(suggestion => suggestion.data)
        })
          .catch(error => {
            console.error(error)
          })
    }
    const activeFieldData = computed(() => {
      const activeField = fields.value.find((field) => field.id === activeList.value)
      if (activeField) {
        const apiProperty = activeField.apiProperty
        return responseData.value.map((data) => data[apiProperty])
      }
      return []
    })
    const hasChanges = computed(() => {
      return (
          project.value.name !== localStorage.getItem('Name') ||
          project.value.code !== localStorage.getItem('Code') ||
          project.value.house !== localStorage.getItem('House') ||
          project.value.housing !== localStorage.getItem('Housing') ||
          project.value.postcode !== localStorage.getItem('Index')
      )
    })

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
      showDropdown,
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
      isSaveButtonActive,
      activeFieldData
    }
  }
}
</script>

<style>

.all-fields {
  margin-bottom: 20px;
}
</style>
