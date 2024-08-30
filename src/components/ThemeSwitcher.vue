<template>
    <div class="flex justify-end p-2 mb-4">
        <ul class="flex list-none m-0 p-0 gap-2 items-center">
            <li>
                <button type="button"
                    class="inline-flex w-8 h-8 p-0 items-center justify-center surface-0 dark:surface-800 border border-surface-200 dark:border-surface-600 rounded"
                    @click="onThemeToggler">
                    <i :class="`pi ${iconClass}`" />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const iconClass = ref('pi-moon');

const onThemeToggler = () => {
    const root = document.getElementsByTagName('html')[0];

    root.classList.toggle('p-dark');
    iconClass.value = iconClass.value === 'pi-moon' ? 'pi-sun' : 'pi-moon';
};
</script>
