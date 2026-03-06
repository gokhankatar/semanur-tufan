<template>
  <div class="admin-section">
    <h2 class="text-headline-small mb-4">Yapılacaklar</h2>

    <v-card variant="outlined" class="pa-4 pa-md-6">
      <v-form @submit.prevent="handleAdd" class="mb-4">
        <div class="d-flex ga-2 align-center">
          <v-text-field
            v-model="newTodoTitle"
            placeholder="Yeni yapılacak ekle..."
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            prepend-inner-icon="mdi-plus"
            rounded="lg"
            @keydown.enter.prevent="handleAdd"
          />
          <v-btn type="submit" color="primary" icon="mdi-plus" :loading="adding" />
        </div>
      </v-form>

      <v-list v-if="todos.length" class="pa-0">
        <v-list-item
          v-for="todo in todos"
          :key="todo.id"
          :class="{ 'text-decoration-line-through text-medium-emphasis': todo.completed }"
          class="admin-todo__item"
          rounded="lg"
          @click="toggleTodo(todo)"
        >
          <template #prepend>
            <v-checkbox
              :model-value="todo.completed"
              hide-details
              color="primary"
              @click.stop="toggleTodo(todo)"
            />
          </template>
          <v-list-item-title>{{ todo.title }}</v-list-item-title>
          <template #append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click.stop="deleteTodo(todo)"
            />
          </template>
        </v-list-item>
      </v-list>

      <p v-else class="text-body-medium text-medium-emphasis text-center py-8">
        Henüz yapılacak yok. Yukarıdan ekleyebilirsiniz.
      </p>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from "~/interfaces";

const {
  fetchTodos,
  addTodo,
  toggleTodo: toggleTodoApi,
  deleteTodo: deleteTodoApi,
} = useTodos();

const todos = ref<Todo[]>([]);
const newTodoTitle = ref("");
const adding = ref(false);
const loading = ref(true);

const loadTodos = async () => {
  loading.value = true;
  try {
    todos.value = await fetchTodos();
  } finally {
    loading.value = false;
  }
};

onMounted(loadTodos);

const handleAdd = async () => {
  const title = newTodoTitle.value?.trim();
  if (!title) return;

  adding.value = true;
  try {
    await addTodo(title);
    newTodoTitle.value = "";
    await loadTodos();
  } finally {
    adding.value = false;
  }
};

const toggleTodo = async (todo: Todo) => {
  if (!todo.id) return;
  await toggleTodoApi(todo.id, !todo.completed);
  todo.completed = !todo.completed;
};

const deleteTodo = async (todo: Todo) => {
  if (!todo.id) return;
  await deleteTodoApi(todo.id);
  todos.value = todos.value.filter((t) => t.id !== todo.id);
};
</script>

<style scoped>
.admin-section {
  animation: fadeIn 0.3s ease;
}

.admin-todo__item {
  margin-bottom: 4px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
