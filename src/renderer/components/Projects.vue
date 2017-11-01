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
    <div class="projects-list-container" v-else>
      <div class="inner">
        <ul>
          <li v-for="(project, index) in allProjects" :key="index">
            <h2><router-link :to="{ name: 'project_single', params: { project_name: project.projectName }}">{{ project.projectName }}</router-link></h2>
            <p>SCSS Entry File: {{ project.sourcePaths.scssEntry }}</p>
            <p>JS Entry File: {{ project.sourcePaths.jsEntry }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="new-project-trigger-container">
      <div class="inner">
        <button class="button-save" @click="enterNewProject = !enterNewProject">Create A New Project</button>
      </div>
    </div>
    <div class="new-project-container" v-if="enterNewProject">
      <form>
        <div class="inner">
          <div class="new-group-form-heading">
            <h4>Create A New Project Here:</h4>
          </div>
          <span>Project Root Directory:</span>
          <button id="root-select" class="button-primary" @click="selectProjectRoot">select folder</button>

          <!-- <label for="project-name">Project Name:</label>
          <input id="project-name" type="text" v-model="singleProject.projectName" placeholder="my-awesome-project" /> -->

          <span>SCSS/SASS Entry File:</span>
          <button id="scss-select" class="button-primary" @click="selectSourceFile">select file</button>

          <span>JavaScript Entry File:</span>
          <button id="js-select" class="button-primary" @click="selectSourceFile">select file</button>

          <button class="button-save" @click="saveProject">save project</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import { remote } from 'electron'; // eslint-disable-line
import { mapGetters, mapActions } from 'vuex';
import path from 'path';
import { determineFileType, writeProjectConfig, getProjectFilesFromDisk } from '../fn/ProjectFunctions';

const mainWindow = remote.getCurrentWindow();

export default {
  name: 'projects',

  data() {
    return {
      enterNewProject: false,
      singleProject: {
        projectName: '',
        sourcePaths: {
          projectRoot: '',
          jsEntry: '',
          scssEntry: '',
        },
      },
    };
  },

  computed: {
    ...mapGetters(['allProjects']),
  },

  created() {
    this.clearProjects();
    getProjectFilesFromDisk(files => this.getAllProjects(files));
  },

  beforeDestroy() {
    this.clearProjects();
  },

  methods: {
    ...mapActions([
      'getAllProjects',
      'clearProjects',
    ]),

    selectProjectRoot() {
      remote.dialog.showOpenDialog(
        mainWindow,
        { properties: ['openDirectory'] },
        path => this.singleProject.sourcePaths.projectRoot = path[0], // eslint-disable-line
      );
    },

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

.new-project-trigger-container {
  padding: 2em 0;
}

form {
  .inner > * {
    display: block;
    margin-bottom: 1em;
  }
}
</style>
