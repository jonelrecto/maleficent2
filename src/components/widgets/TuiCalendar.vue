<template>
<div style="height: 100%; width: 100%">
    <!-- <h1>🍞📅 TOAST UI Calendar + Vue</h1> -->
    <div>
        <!-- <q-select v-model="selectedView" :options="viewModeOptions">
            
        </q-select> -->

         <q-select
          v-model="selectedView"
          float-label="View Mode"
          radio
        :options="viewModeOptions"
        />

        <div class="q-mt-md">
            <q-btn class="q-ma-md" color="primary" icon="" @click="$refs.tuiCal.invoke('today'), setRenderRangeText()">Today</q-btn>
            <q-btn class="" round icon="mdi-chevron-left" @click="$refs.tuiCal.invoke('prev'), setRenderRangeText()" ></q-btn>
            <q-btn class="" round icon="mdi-chevron-right" @click="$refs.tuiCal.invoke('next') ,setRenderRangeText()"></q-btn>
            <p class="q-title">{{dateRange}}</p>
        </div>

        
        
    </div>
    <calendar style="height: 800px"
              ref="tuiCal"
              :useDetailPopup="useDetailPopup"
              :view="selectedView"
              :calendars="calendarList"
              :schedules="scheduleList"
              :template="template"
              :taskView="true"
              :scheduleView="true"
              :month="month"
              :week="week"
              :timezones="timezones"
              :disableDblClick="disableDblClick"
              :isReadOnly="isReadOnly"
              @clickSchedule="onClickSchedule"
              @clickDayname="onClickDayname"
              @beforeDeleteSchedule="onBeforeDeleteSchedule"
              @afterRenderSchedule="onAfterRenderSchedule"
              @clickTimezonesCollapseBtn="onClickTimezonesCollapseBtn"
    />
</div>
</template>
<script>
import 'tui-time-picker/dist/tui-time-picker.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-calendar/dist/tui-calendar.css';
// import './app.css';
import { Calendar } from '@toast-ui/vue-calendar'
// import myTheme from './myTheme';

const today = new Date();

const getDate = (type, start, value, operator) => {
    start = new Date(start);
    type = type.charAt(0).toUpperCase() + type.slice(1);
    if (operator === '+') {
        start[`set${type}`](start[`get${type}`]() + value);
    } else {
        start[`set${type}`](start[`get${type}`]() - value);
    }
    return start;
};


export default {
    name: 'App',
    components: {
        'calendar': Calendar
    },
    data() {
        return {
            viewModeOptions: [
                {
                    label: 'Monthly',
                    value: 'month'
                },
                {
                    label: 'Weekly',
                    value: 'week'
                },
                {
                    label: 'Daily',
                    value: 'day'
                }
            ],
            dateRange: '',
            selectedView: 'month',
            calendarList: [
                {
                    id: '0',
                    name: 'Private',
                    bgColor: '#e8e8e8',
                    borderColor: '#a1b56c'
                },
                {
                    id: '1',
                    name: 'Company',
                    bgColor: '#00a9ff',
                    borderColor: '#00a9ff'
                },
                {
                    id: '3',
                    name: 'Company',
                    color: '#e8e8e8',
                    bgColor: '#585858',
                    borderColor: '#a1b56c'
                }
            ],
            scheduleList: [
                {
                    id: '1',
                    calendarId: '0',
                    title: 'TOAST UI Calendar Study',
                    category: 'time',
                    dueDateClass: '',
                    
                    start: today.toISOString(),
                    end: getDate('hours', today, 3, '+').toISOString()
                },
                {
                    id: '2',
                    calendarId: '1',
                    title: 'Practice',
                    category: 'milestone',
                    dueDateClass: '',
                    start: getDate('date', today, 1, '+').toISOString(),
                    end: getDate('date', today, 1, '+').toISOString(),
                    isReadOnly: true
                },
                {
                    id: '3',
                    calendarId: '1',
                    title: 'FE Workshop',
                    category: 'milestone',
                    dueDateClass: '',
                    color: 'blue',
                    bgcolor: 'red',
                    start: getDate('date', today, 2, '-').toISOString(),
                    end: getDate('date', today, 1, '-').toISOString(),
                    isReadOnly: true
                },
                {
                    id: '4',
                    calendarId: '1',
                    title: 'Report',
                    category: 'time',
                    dueDateClass: '',
                    start: today.toISOString(),
                    end: getDate('hours', today, 1, '+').toISOString()
                }
            ],
            timezones: [{
                timezoneOffset: 540,
                displayLabel: 'GMT+09:00',
                tooltip: 'Seoul'
            }, {
                timezoneOffset: -420,
                displayLabel: 'GMT-08:00',
                tooltip: 'Los Angeles'
            }],
            template: {
                milestone(schedule) {
                    return `<span style="color:#fff;background-color: ${schedule.bgColor};">${schedule.title}</span>`;
                },
                milestoneTitle() {
                    return 'Milestone';
                },
                allday(schedule) {
                    return `${schedule.title}<i class="fa fa-refresh"></i>`;
                },
                alldayTitle() {
                    return 'All Day';
                }
            },
            month: {
                startDayOfWeek: 0,
                // visibleWeeksCount: 3
            },
            week: {
                showTimezoneCollapseButton: true,
                timezonesCollapsed: true
            },
            taskView: ['task'],
            scheduleView: false,
            useDetailPopup: true,
            disableDblClick: true,
            isReadOnly: false
        };
    },
    watch: {
        selectedView(newValue) {
            this.$refs.tuiCal.invoke('changeView', newValue, true);
            this.setRenderRangeText();
        }
    },
    methods: {
        init() {
            this.setRenderRangeText();
        },
        setRenderRangeText() {
            const {invoke} = this.$refs.tuiCal;
            const view = invoke('getViewName');
            const calDate = invoke('getDate');
            const rangeStart = invoke('getDateRangeStart');
            const rangeEnd = invoke('getDateRangeEnd');
            let year = calDate.getFullYear();
            let month = calDate.getMonth() + 1;
            let date = calDate.getDate();
            let dateRangeText = '';
            let endMonth, endDate, start, end;
            switch (view) {
                case 'month':
                    dateRangeText = `${year}-${month}`;
                    break;
                case 'week':
                    year = rangeStart.getFullYear();
                    month = rangeStart.getMonth() + 1;
                    date = rangeStart.getDate();
                    endMonth = rangeEnd.getMonth() + 1;
                    endDate = rangeEnd.getDate();
                    start = `${year}-${month}-${date}`;
                    end = `${endMonth}-${endDate}`;
                    dateRangeText = `${start} ~ ${end}`;
                    break;
                default:
                    dateRangeText = `${year}-${month}-${date}`;
            }
            this.dateRange = dateRangeText;
        },
        onClickNavi(event) {
            if (event.target.tagName === 'BUTTON') {
                const {target} = event;
                let action = target.dataset ? target.dataset.action : target.getAttribute('data-action');
                action = action.replace('move-', '');
                this.$refs.tuiCal.invoke(action);
                this.setRenderRangeText();
            }
        },
        onClickSchedule(res) {
            console.group('onClickSchedule');
            console.log('MouseEvent : ', res.event);
            console.log('Calendar Info : ', res.calendar);
            console.log('Schedule Info : ', res.schedule);
            console.groupEnd();
        },
        onClickDayname(res) {
            // view : week, day
            console.group('onClickDayname');
            console.log(res.date);
            console.groupEnd();
        },
        onBeforeDeleteSchedule(res) {
            console.group('onBeforeDeleteSchedule');
            console.log('Schedule Info : ', res.schedule);
            console.groupEnd();
            const idx = this.scheduleList.findIndex(item => item.id === res.schedule.id);
            this.scheduleList.splice(idx, 1);
        },
        onAfterRenderSchedule(res) {
            console.group('onAfterRenderSchedule');
            console.log('Schedule Info : ', res.schedule);
            console.groupEnd();
        },
        onClickTimezonesCollapseBtn(timezonesCollapsed) {
            // view : week, day
            console.group('onClickTimezonesCollapseBtn');
            console.log('Is Collapsed Timezone? ', timezonesCollapsed);
            console.groupEnd();
            if (timezonesCollapsed) {
                // this.theme['week.timegridLeft.width'] = '100px';
                // this.theme['week.daygridLeft.width'] = '100px';
            } else {
                // this.theme['week.timegridLeft.width'] = '50px';
                // this.theme['week.daygridLeft.width'] = '50px';
            }
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style>
</style>