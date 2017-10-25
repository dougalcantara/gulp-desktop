const state = {
  allProjects: [],
};

const mutations = {
  populateProjects(state, projects) {
    state.allProjects = projects;
  },
};

const actions = {
  getAllProjects({ commit }, projects) {
    commit('populateProjects', projects);
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
