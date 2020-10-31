<template>

<vue-cal selected-date="2018-11-19"
         :time-from="9 * 60"
         :time-to="19 * 60"
         hide-weekends
         :events="events"
          default-view="month"
           events-on-month-view="short"
         :disable-views="['years', 'year']"
         style="height: 800px">
  <!-- <div slot="event-renderer" slot-scope="{ cell, event, view }">
    <q-icon :name="event.icon"></q-icon>
      {{test(cell.content)}}
    <div class="vuecal__event-title" v-html="event.title" />
    <div class="vuecal__event-title vuecal__event-title--edit" contenteditable @blur="event.title = $event.target.innerHTML" v-html="event.title" />

    <small class="vuecal__event-time">
      <strong>Event start:</strong> <span>{{ event.startTime }}</span><br/>
      <strong>Event end:</strong> <span>{{ event.endTime }}</span>
    </small>
 

  </div> -->

   <div>
    <span slot="cell-content" slot-scope="{ cell, view, events }">
      <span class="vuecal__cell-date">{{ cell.content }}</span>
      <span class="vuecal__cell-events-count" v-if="['years', 'year', 'month'].includes(view.id) && customEventsCount(events)">
        {{ test(events) }}
      </span>
    </span>
  </div>
</vue-cal>
</template>
<script>
import VueCal from 'vue-cal'


import 'vue-cal/dist/vuecal.css'

export default {
  components: {
    'vue-cal': VueCal
  },
  data: () => ({
     events: [
      {
        start: '2018-11-20 14:00',
        end: '2018-11-20 18:00',
        title: 'Need to go shopping',
        icon: 'shopping_cart', // Custom attribute.
        class: 'leisure'
      },
      {
        start: '2018-11-22 10:00',
        end: '2018-11-23 15:00',
        title: 'Golf with John',
        icon: 'golf_course', // Custom attribute.
        class: 'sport'
      }
    ]

  }), // end of data
  methods: {
    test (t) {
      console.log(t, 'value')
    }
  }
}
</script>

<style>
.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}
.vuecal--month-view .vuecal__cell-date {padding: 4px;}

#app {
  margin: 30px auto;
  max-width: 580px;
  height: 350px;
}

.vuecal__event {
  background-color: rgba(173, 216, 230, 0.5);
}

.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}

a {
  position: fixed;
  top: 5px;
  right: 5px;
  color: #333;
}

</style>