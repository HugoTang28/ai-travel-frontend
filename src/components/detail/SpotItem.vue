<template>
  <div
    v-if="data"
    class="spot-item"
  >
    <div class="spot-name">{{ data.spot || data.name || '待定' }}</div>
    <div
      v-if="data.duration || data.ticket || data.transportation"
      class="spot-details"
    >
      <div
        v-if="data.duration"
        class="detail-row"
      >
        <VanIcon
          name="clock-o"
          size="14"
        />
        <span>{{ data.duration }}</span>
      </div>
      <div
        v-if="data.ticket"
        class="detail-row"
      >
        <VanIcon
          name="ticket-o"
          size="14"
        />
        <span>{{ data.ticket }}</span>
      </div>
      <div
        v-if="data.transportation"
        class="detail-row"
      >
        <VanIcon
          name="logistics"
          size="14"
        />
        <span>{{ data.transportation }}</span>
      </div>
    </div>
    <div
      v-if="data.description"
      class="spot-desc"
    >
      {{ data.description }}
    </div>
  </div>
  <div
    v-else
    class="spot-item empty"
  >
    <VanEmpty
      description="暂无安排"
      :image-size="40"
    />
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.spot-item {
  padding: 8px 0;
}

.spot-item.empty {
  padding: 16px 0;
}

.spot-name {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
}

.spot-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.spot-desc {
  font-size: 14px;
  color: #969799;
  line-height: 1.5;
}
</style>
