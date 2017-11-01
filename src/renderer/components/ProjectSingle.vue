<template>
  <main>
    <div class="project-single">
      <div class="project-heading-container" v-if="currentProject[0]">
        <div class="inner">
          <h1>{{ currentProject[0].projectName }}</h1>
        </div>
      </div>
      <div class="project-options-container">
        <div class="inner">
          <h2>CSS Options:</h2>
          <form class="project-options--css">
            <div class="input-group">
              <input id="minify-css" type="checkbox" v-model="gulpOptions.minify">
              <label for="minify-css">&nbsp; Minify CSS</label>
            </div>
            <div class="input-group">
              <input id="write-sourcemaps" type="checkbox" v-model="gulpOptions.smaps">
              <label for="write-sourcemaps">&nbsp; Write SourceMaps</label>
            </div>
            <div class="input-group">
              <input id="autoprefix" type="checkbox" v-model="gulpOptions.autoprefix">
              <label for="autoprefix">&nbsp; AutoPrefix</label>
            </div>
          </form>
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
        minify: false,
        smaps: false,
        autoprefix: false,
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
      return this.allProjects.filter(project => // eslint-disable-line
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
        '/Users/apple/webdev/dummy-gulp-target/',
        './src/gulp/gulpfile.js',
        this.currentProject[0].sourcePaths,
        (output, err) => console.log(output, err),
      );
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
