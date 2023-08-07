<template>
  <div class="autocomplete-input">
    <input v-model="inputValue" @input="handleInput" :required="required"/>
    <ul v-if="showSuggestions" class="suggestions">
      <li v-for="(suggestion, index) in filteredSuggestions" :key="index" @click="selectSuggestion(suggestion)">
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  props: {
    responseData: {
      type: Array,
      required: true,
    },
    required: Boolean,
  },
  setup(props) {
    const inputValue = ref('')
    const showSuggestions = ref(false)

    const filteredSuggestions = computed(() =>
      props.responseData.filter((data) =>
        data.toLowerCase().includes(inputValue.value.toLowerCase())
      )
    )

    const handleInput = () => {
      showSuggestions.value = true
    }

    const selectSuggestion = (suggestion) => {
      inputValue.value = suggestion
      showSuggestions.value = false
    }

    watch(inputValue, () => {
      showSuggestions.value = true
    })
    return {
      inputValue,
      showSuggestions,
      filteredSuggestions,
      handleInput,
      selectSuggestion,
    }
  }
}
</script>

<style>
.autocomplete-input {
  position: relative;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions li {
  padding: 8px 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f2f2f2;
}
</style>
