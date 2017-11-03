<template>
  <main>
    <div class="project-single">
      <div class="project-heading-container" v-if="currentProject[0]">
        <div class="inner">
          <h1>{{ currentProject[0].projectName }}</h1>
        </div>
      </div>
      <div class="project-options--forms_container">
        <div class="inner">
          <div class="project-options--css_container">
            <div class="form-heading-container">
              <h2>CSS Options:</h2>
            </div>
            <form class="project-options--css_form">
              <div class="input-group">
                <input id="minify-css" type="checkbox" v-model="gulpOptions.CSSMinify">
                <label for="minify-css">&nbsp; Minify CSS</label>
              </div>
              <div class="input-group">
                <input id="write-CSSsourcemaps" type="checkbox" v-model="gulpOptions.CSSSmaps">
                <label for="write-CSSsourcemaps">&nbsp; Write SourceMaps</label>
              </div>
              <div class="input-group">
                <input id="autoprefix" type="checkbox" v-model="gulpOptions.CSSAutoprefix">
                <label for="autoprefix">&nbsp; AutoPrefix</label>
              </div>
            </form>
          </div>
          <div class="project-options--js_container">
            <div class="form-heading-container">
              <h2>JS Options:</h2>
            </div>
            <form class="project-options--js_form">
              <div class="input-group">
                <input id="minify-js" type="checkbox" v-model="gulpOptions.JSUglify">
                <label for="minify-js">&nbsp; Uglify JS</label>
              </div>
              <div class="input-group">
                <input id="write-JSsourcemaps" type="checkbox" v-model="gulpOptions.JSSmaps">
                <label for="write-JSsourcemaps">&nbsp; Write SourceMaps</label>
              </div>
              <div class="input-group">
                <input id="babel" type="checkbox" v-model="gulpOptions.JSBabel">
                <label for="babel">&nbsp; Babel</label>
              </div>
            </form>
          </div>
          <button @click="_runGulpOnProject" class="button-save">Run Gulp</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getProjectFilesFromDisk, runGulpOnProject } from '../fn/ProjectFunctions';

export default {
  name: 'project_single',

  data() {
    return {
      gulpOptions: {
        CSSMinify: false,
        CSSSmaps: false,
        CSSAutoprefix: false,
        JSSourceMaps: false,
        JSUglify: false,
        JSSmaps: false,
      },
    };
  },

  created() {
    getProjectFilesFromDisk(files => this.getAllProjects(files));
  },

  computed: {
    ...mapGetters(['allProjects']),

    currentProject() {
      if (!this.allProjects) return;
      return this.allProjects.filter(project => // eslint-disable-line consistent-return
        project.projectName === this.$route.params.project_name,
      );
    },
  },

  methods: {
    ...mapActions([
      'getAllProjects',
      'clearProjects',
    ]),

    packageGulpArguments() {
      const gulpOptionKeys = Object.keys(this.gulpOptions);
      const gulpOptionVals = Object.values(this.gulpOptions);
      const gulpArguments = [];

      gulpOptionVals.forEach((option, i) => {
        if (gulpOptionVals[i] === true) {
          gulpArguments.push(`${gulpOptionKeys[i]} `); // need a hardcoded 'space' char after each arg
        }
      });

      return gulpArguments;
    },

    _runGulpOnProject() {
      runGulpOnProject(
        this.gulpOptions,
        ['scss js'], // needs to be dynamic
        './src/gulp/gulpfile.js', // needs to be dynamic
        this.currentProject[0].sourcePaths,
        (err, data, stderr) => console.log(err || '', data, stderr),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  input, label {
    &:hover {
      cursor: pointer;
    }
  }
}

.project-options {
  &--css_container, &--js_container {
    padding: 1em 0;
  }
}

.form-heading-container {
  margin-bottom: 1em;
}
</style>
