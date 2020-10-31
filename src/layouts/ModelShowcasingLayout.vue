<template>
  <q-layout view="lHh Lpr lff">
    <q-layout-header>
      <div class="hide-desktop">
      <q-toolbar
        color="white"
      >

        <q-toolbar-title class="absolute-center">
         <img id="logo_memp" alt="Maleficent Models Academy" src="~assets/mma.png">
        </q-toolbar-title>

      </q-toolbar>

    </div>
    <q-toolbar color="black" text-color="faded" style="height:60px; opacity:.8;" class="hide-mobile">
        <div class ="container row full-width">
            <div class="col-6">
                <q-toolbar-title>
                <q-btn flat style="color: #FFFFFF; text-align:center;" class=" q-ml-xl"  @click="$router.push('/')">
                <img id="logo_memp" alt="Maleficent Models Academy" src="~assets/memp.png" class=" vertical-middle" >
                </q-btn>
                </q-toolbar-title>
            </div>
            <div class="col-6 row" style="height:100%;">
                <div class="col-3 q-pt-sm">
 <!--                <q-btn flat label=" ABOUT US " style="color: #FFFFFF; text-align:center;" class="text-weight-bold q-pa-xs q-mx-lg"/> -->
                </div>
                <div class="col-3 q-pt-sm">
                <!-- <q-btn flat label=" EVENTS &amp; COURSES " style="color: #FFFFFF; text-align:center;" class="text-weight-bold q-pa-xs q-mx-xs"/> -->
                </div>
                <div class="col-3 q-pt-sm">
                <!-- <q-btn flat label=" LASTEST NEWS " style="color: #FFFFFF; text-align:center;" class="text-weight-bold q-pa-xs q-mx-lg"/> -->
                </div>
                <div class="col-3 q-pt-sm">
                <!-- <q-btn outline rounded label=" SIGN-IN " icon-right="account_box" color="white" style=" text-align:center;" class="text-weight-bold q-pa-xs q-mx-lg" @click="$router.push('/signin')"/> -->
                </div>
            </div>
        </div>
    </q-toolbar>

    </q-layout-header>
    <q-page-container class="bgimg">
      <router-view />
    </q-page-container >
  <q-layout-footer style="background-color:#232428;">
    <div class="justify center">
      <div class="q-pa-lg container">
        <div class="row">
          <div class="text-center full-width"><br>
            <p class="q-caption text-light">Copyright © 2018 Maleficent Models Academy</p>
          </div>

        </div>
      </div>
    </div>
  </q-layout-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  data () {
    return {
      leftDrawerOpen: false,
      state: true
    }
  },
  methods: {
    openURL,
    modelAppPage () {
      window.location.href = 'https://crux001.github.io/MaleficentModelsApp/#/'
    }
  },
  toggleHeader () {
    this.state = !this.state
  }
}
</script>
<style lang="css">
@import url("/css/style.css");
.bgimg{
  background-image: url("../statics/skyscraper.jpg");
}
*{
  font-family: 'Raleway', sans-serif;
  margin: 0; padding: 0;
  box-sizing: border-box;
  }

.hide-desktop{
        display: none;
}

#logo_memp{
  max-height: 50px;
}
a{
text-decoration: none;
}
a:link {
    color:#929293;
}

/* visited link */
a:visited {
    color:#929293;
}

/* mouse over link */
a:hover {
    color: rgb(247, 0, 255);
}

/* selected link */
a:active {
    color: crimson;
}
.q-layout-footer .q-icon{
  font-size: 40px;
  padding: 10px;
}

@media (max-width: 960px){
  #sitemap{
    display: none;
  }
  #location{
    display: none;
  }

  #social{
    width: 100%;
  }

  .hide-mobile{
        display: none;
  }

  .hide-desktop{
     display: block;
  }

}
</style>
