import { writable } from 'svelte/store';

const defaultEntry = () => {
  return {
    id: Date.now(),
    name: 'New task',
    time: 10,
    completed: false
  };
}

export const newEntry = () => {
  timers.modify(defaultEntry());
}

function timerStore() {
  const state = [];
  const {
      subscribe,
      set,
      update
  } = writable(state);

  const timers = {
      modify(data) {
          update(state => {
              let index = state.findIndex(state => state.id == data.id);

              if (state[index] == null) {
                  state = [data].concat(state);
              } else {
                  state[index] = data;
              }
              //localStorage.setItem("tim", JSON.stringify(state));

              return state;
          });
      },
      delete(id) {
          update(state => {
              state = state.filter(state => state.id != id);
              //localStorage.setItem("tim", JSON.stringify(state));

              return state;
          });
      },
      reset() {
          update(state => {
              state = [];
              //localStorage.setItem("tim", JSON.stringify(state));

              return state;
          });
      }
  }

  return {
      subscribe,
      set,
      update,
      ...timers
  };
}

export const timers = timerStore();


export const controller = writable(false);