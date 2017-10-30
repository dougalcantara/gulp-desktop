const state = {
  allProjects: [],
};

const mutations = {
  populateProjects(state, project) {
    state.allProjects.push(project);
  },

  emptyProjectsArray(state) {
    state.allProjects = [];
  },
};

const actions = {
  getAllProjects({ commit }, project) {
    commit('populateProjects', project);
  },

  clearProjects({ commit }) {
    commit('emptyProjectsArray');
  },
};

const getters = {
  allProjects(state) {
    return state.allProjects;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
