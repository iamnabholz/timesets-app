import { writable } from 'svelte/store';

const defaultPomodoros  = [{
    id: 2,
    name: "Work Review",
    time: 15,
    completed: false
},
{
    id: 3,
    name: "Short Break",
    time: 5,
    completed: false
},
{
    id: 4,
    name: "Work Phase",
    time: 25,
    completed: false
},
{
    id: 5,
    name: "Long Break",
    time: 15,
    completed: false
},
{
    id: 6,
    name: "Work Phase",
    time: 25,
    completed: false
}]

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
  const state = JSON.parse(localStorage.getItem("timers")) || defaultPomodoros;
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
              localStorage.setItem("timers", JSON.stringify(state));

              return state;
          });
      },
      delete(id) {
          update(state => {
              state = state.filter(state => state.id != id);
              localStorage.setItem("timers", JSON.stringify(state));

              return state;
          });
      },
      reset() {
          update(state => {
              state = defaultPomodoros;
              localStorage.setItem("timers", JSON.stringify(state));

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

export const resetTimers = () => {
    if(window.confirm("Do you really want to reset your timers?"))
    {
        timers.reset();
    }
}

export const pomodoroState = writable(false);
export const runningTimerId = writable(0);
export const pomodoroPaused = writable(false);

export const stopwatchState = writable(false);

function lapStore() {
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

export const laps = lapStore();