
export default [
  {
    path: '/',
    name: 'login',
    component: () => import('layouts/login')
  },
  {
    path: '/modelRegistration',
    component: () => import('layouts/Register2')
  },
  {
    path: '/portfolio/:id',
    component: () => import('layouts/ModelShowcasingLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ModelShowcasing.vue')
      },
    ]
  },
  // {
  //   path: '/modelRegistration',
  //   component: () => import('layouts/Register')
  // },
  {
    path: '/myAccount',
    component: () => import('layouts/MyAccount')
  },
  {
    path: '/test',
    component: () => import('layouts/test')
  },
  {
    path: '/dashboard',
    component: () => import('layouts/dashboard'),
    children:
    [
      {
        path: '/dashboard',
        component: () => import('pages/dashboard/index')
      },
      {
        path: '/events',
        component: () => import('layouts/events')
      },
      {
        path: '/eventseason/:id',
        name: 'eventSeason',
        component: () => import('pages/events/seasonEvent')
      },
      {
        path: '/eventseason/:id/:seasonNumber/seasonBatches',
        component: () => import('pages/events/eventSeasonActivities')
      },
      // {
      //   path: '/eventseason/:id/:seasonNumber/seasonBatches',
      //   component: () => import('pages/events/seasonBatchList')
      // },
      // {
      //   path: '/showcasing',
      //   component: () => import('layouts/showcasingModels')
      // },
      {
        path: '/showcasingSelection',
        component: () => import('layouts/showcasingMenu'),
        children: [
          {
            path: '/showcasingSelection',
            component: () => import('pages/showcasingMenu/showcasingSelection')
          },
          {
            path: '/clientDetails',
            component: () => import('pages/showcasingMenu/clientDetails')
          },
        ]
      },
      {
        path: '/seasons',
        component: () => import('layouts/seasons')
      },
      {
        path: '/schedules',
        component: () => import('layouts/schedule'),
        children: [
          {
            path: '/schedules',
            component: () => import('pages/Schedules/schedule_create')
          }
        ]
      },
      {
        path: '/allSchedules',
        component: () => import('pages/Schedules/allSchedule')
      },
      {
        path: '/batchlist',
        component: () => import('pages/Schedules/batch_list')
      },
      {
        path: '/models',
        component: () => import('layouts/models')
      },
      {
        path: '/allEventSchedules',
        component: () => import('layouts/allSchedules'),
        children: [
          {
            path: '/allEventSchedules',
            component: () => import('pages/allSchedules/viewAllEventSchedules')
          },
          {
            path: '/viewEventSchedules/:eventKey',
            name: 'viewEventSched',
            component: () => import('pages/allSchedules/viewEventSchedule')
          },
        ]
      },
      {
        path: '/allEventPayments',
        component: () => import('layouts/allEventPayments'),
        children: [
          {
            path: '/allEventPayments',
            component: () => import('pages/viewAllEventPayments')
          },
          {
            path: '/viewEventPayments/:eventKey',
            name: 'viewEventPayments',
            component: () => import('pages/viewEventPayments')
          },
        ]
      },
      {
        path: '/attendance',
        name: 'attendance',
        component: () => import('layouts/attendance2')
      },
      {
        path: '/attendanceList/:id/:title/:type',
        name: 'attendanceList',
        component: () => import('pages/attendanceSheet2')
      },
      {
        path: '/attendanceFullDay/:id/:date/:type',
        name: 'attendanceFullDay',
        component: () => import('pages/attendanceFullDay')
      },
      {
        path: '/allAttendances',
        component: () => import('layouts/allAttendances'),
        children: [
          {
            path: '/allAttendances',
            component: () => import('pages/allAttendances/allEventAttendances'),
          },
          {
            path: '/viewEventAttendances/:eventKey',
            name: 'viewEventAttendances',
            component: () => import('pages/allAttendances/viewEventAttendances'),
          },
        ]
      },
      {
        path: '/chat/:id',
        name: 'chat',
        component: () => import('layouts/messages')
      },
      {
        path: '/contractsigned/:id',
        name: 'contractsigned',
        component: () => import('layouts/contractSign2')
      },
      {
        path: '/contractsigned',
        component: () => import('layouts/contractSign2')
      },
      {
        path: '/reschedule',
        component: () => import('layouts/reschedule')
      },
      {
        path: '/reschedModels/:eventKey/:batchKey/:batchNumber/:activityID/:activityType',
        component: () => import('pages/rescheduled/reschedModels')
      },
      {
        path: '/reports',
        component: () => import('layouts/reports'),
        children: [
          {
            path: '/reports',
            component: () => import('pages/reports/hitrate')
          },
          {
            path: '/contractSignedReports',
            component: () => import('pages/reports/contractSignedReports')
          },
          {
            path: '/sales',
            component: () => import('pages/reports/sales'),
            children: [
              {
                path: '/sales',
                component: () => import('pages/reports/salesReports/salesReportsAll')
              },
              {
                path: '/salesByEvent/:eventKey',
                name: 'salesReportsByEvent',
                component: () => import('pages/reports/salesReports/salesReportsByEvent')
              }
            ]
          }
        ]
      },
      {
        path: '/paymentReports',
        component: () => import('pages/reports/paymentReports'),
        children: [
          {
            path: '/paymentReports',
            component: () => import('pages/reports/allPaymentReports')
          },
          {
            path: '/fullPaymentReports',
            component: () => import('pages/reports/fullPaymentReports')
          },
          {
            path: '/installmentPaymentReports',
            component: () => import('pages/reports/installmentPaymentReports')
          },
          {
            path: '/notPaidPaymentReports',
            component: () => import('pages/reports/notPaidPaymentReports')
          },
          {
            path: '/backOutPaymentReports',
            component: () => import('pages/reports/backOutPaymentReports')
          },
        ]
      },
      {
        path: '/users',
        component: () => import('layouts/users')
      },
      {
        path: '/settings',
        component: () => import('layouts/settings'),
        children: [
          {
            path: '/coursesSettings',
            component: () => import('pages/settings/coursesSettings')
          },
          {
            path: '/smsSettings',
            component: () => import('pages/settings/smsSettings')
          },
          // {
          //   path: '/activitySettings',
          //   component: () => import('pages/settings/activitySettings')
          // }
        ]
      },
      {
        path: '/smsnotification',
        component: () => import('layouts/smsNotification')
      },
      {
        path: '/SMSList/:id/:title/:type',
        name: 'SMSList',
        component: () => import('pages/SMSList')
      },
      {
        path: '/allSMS',
        component: () => import('layouts/allSMS'),
        children: [
          {
            path: '/allSMS',
            component: () => import('pages/allSMS/allSMSView'),
          },
          {
            path: '/viewEventSMS/:eventKey',
            name: 'viewEventSMS',
            component: () => import('pages/allSMS/viewEventSMS'),
          },
        ]
      }
      // {
      //   path: '/SMSListFullDay/:id/:title/:type',
      //   name: 'SMSListFullDay',
      //   component: () => import('pages/SMSListFullDay')
      // }

    ]
  },



  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
