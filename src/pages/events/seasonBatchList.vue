<template>
  <div class="flex q-pa-md">
    <tui-calendar></tui-calendar>
    <!-- <calendar></calendar> -->
  </div>
</template>
<script>
import Calendar from '../../components/widgets/VueCalendar'
import TuiCalendar from '../../components/widgets/TuiCalendar'


export default {
  components: {
    Calendar,
    TuiCalendar
  }

}
</script>