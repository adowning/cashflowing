// src/stores/notificationStore.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Define the structure of a notification
export interface Notification {
  id: number // Use timestamp or a more robust UUID in production
  message: string
  type: 'info' | 'success' | 'warning' | 'error' // Optional type for styling
  duration: number // Duration in milliseconds
}

export const useNotificationStore = defineStore('notifications', () => {
  // State: Array to hold active notifications
  const notifications = ref<Notification[]>([])

  // Getters (optional, but good practice)
  const activeNotifications = computed(() => notifications.value)

  // Actions
  function addNotification(
    message: string,
    type: Notification['type'] = 'info', // Default type
    duration: number = 5000, // Default duration 5 seconds
  ) {
    const newNotification: Notification = {
      id: Date.now(), // Simple unique ID
      message,
      type,
      duration,
    }

    notifications.value.push(newNotification)

    // Automatically remove the notification after its duration
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, duration)
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter(
      (notification) => notification.id !== id,
    )
  }

  return {
    notifications, // Expose raw state if needed directly
    activeNotifications,
    addNotification,
    removeNotification,
  }
})
