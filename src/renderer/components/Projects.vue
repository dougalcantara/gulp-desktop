<template>
  <main>
    <div class="heading-container">
      <div class="inner">
        <h1>Your Projects</h1>
      </div>
    </div>
    <div v-if="allProjects.length < 1" class="no-projects-warning-container">
      <div class="inner">
        <p>You don't have any projects yet!</p>
      </div>
    </div>
    <form>
      <div class="inner">
        <div class="new-group-form-heading">
          <h4>Create A New Project Here:</h4>
        </div>
        <label for="project-name">Project Name:</label>
        <input id="project-name" type="text" v-model="singleProject.projectName" placeholder="my-awesome-project" />

        <span>SCSS/SASS Entry File:</span>
        <button id="scss-select" class="button-primary" @click="selectSourceFile">select file</button>

        <span>JavaScript Entry File:</span>
        <button id="js-select" class="button-primary" @click="selectSourceFile">select file</button>

        <button class="button-save" @click="saveProject">save project</button>
      </div>
    </form>
  </main>
</template>

<script>
// eslint-disable-next-line
import { remote } from 'electron';
import { mapGetters, mapActions } from 'vuex';
import { determineFileType, writeProjectConfig } from '../fn/ProjectFunctions';

const mainWindow = remote.getCurrentWindow();

export default {
  name: 'projects',

  data() {
    return {
      singleProject: {
        projectName: '',
        sourcePaths: {
          jsEntry: '',
          scssEntry: '',
        },
      },
    };
  },

  computed: {
    ...mapGetters(['allProjects']),
  },

  methods: {
    ...mapActions(['getAllProjects']),

    selectSourceFile() {
      remote.dialog.showOpenDialog(
        mainWindow,
        { properties: ['openFile'] },
        filePath => determineFileType(filePath[0], this.singleProject.sourcePaths),
      );
    },

    saveProject() {
      writeProjectConfig(this.singleProject, this.alertSuccess);
    },

    alertSuccess() {
      return alert('Project saved!'); // eslint-disable-line
    },
  },

};
</script>

<style lang="scss" scoped>
.no-projects-warning-container {
  padding: 2em 0;
}

form {
  .inner > * {
    display: block;
    margin-bottom: 1em;
  }
}
</style>
